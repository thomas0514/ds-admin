<template>
  <div class="app-container registered-users-page">
    <toolbar :toolButtons="toolButtons" @uploadBtn="uploadBtn" @exportExcel="exportExcel"></toolbar>
    <queryConditions
      :dialogFormVisible.sync="dialogFormVisible"
      :queryFormList.sync="queryFormList"
      :queryParams="queryParams"
      @search="initData"
      @resetForm="resetForm"
    ></queryConditions>
    <base-table
      tableTitle
      :loading="loading"
      :columns="headers"
      :list="list"
      :total="total"
      :pageNum.sync="tableParam.pageNum"
      :pageSize.sync="tableParam.pageSize"
      @getList="initData"
    ></base-table>
    <el-dialog :visible.sync="detailsVisible" title="文件上传" width="40%">
      <el-form>
        <div v-if="type=='upload'">
          <el-form-item label="请上传附件">
            <el-upload
              class="upload-demo"
              ref="upload"
              :action="upLoadData.upUrl"
              :on-success="handleUploadSucess"
              :before-upload="handleBeforeUpload"
              :file-list="upLoadData.fileList"
              :on-change="addFile"
              :on-remove="deleteFile"
              :limit="1"
              :auto-upload="false"
              :on-error="handleUploadError"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item>
            <span style="font-size:20px">上传数据成功，点击导出数据</span>
            <el-button style="margin-left:20px" type="text" @click="exportData">立即导出</el-button>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailsVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submit" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { devService } from "@/config/env";
import api from "@/api/index";
import listMixins from "@/mixins/tableList";
import baseTable from "@/components/baseTable";
import queryConditions from "@/components/queryConditions";
import baseDetails from "@/components/baseDetails";
import toolbar from "@/components/toolbar";

export default {
  name: "Kbao",
  mixins: [listMixins],
  components: {
    queryConditions,
    baseTable,
    baseDetails,
    toolbar
  },
  data() {
    return {
      toolButtons: [
        {
          name: "上传数据",
          operation: "uploadBtn",
          icon: "el-icon-upload"
        },
        {
          name: "导出数据",
          operation: "exportExcel",
          icon: "el-icon-download"
        }
      ],
      queryFormList: [
        {
          type: "input",
          name: "policyNo",
          label: "保单号",
          placeholder: "请输入保单号",
          value: ""
        },
        {
          type: "input",
          name: "staPremiumMin",
          label: "大童标保最小值",
          placeholder: "请输入大童标保",
          value: ""
        },
        {
          type: "input",
          name: "staPremiumMax",
          label: "大童标保最大值",
          placeholder: "请输入大童标保",
          value: ""
        },
        {
          type: "select",
          name: "kbaoUserId",
          label: "主代理人",
          placeholder: "请选择主代理人",
          value: "",
          clearable: true,
          options: []
        },

        {
          type: "select",
          name: "adviserId",
          label: "顾问",
          placeholder: "请选择顾问",
          value: "",
          clearable: true,
          options: []
        },
        {
          type: "select",
          name: "expertId",
          label: "专家",
          placeholder: "请输入专家",
          value: "",
          clearable: true,
          options: []
        },
        {
          type: "select",
          name: "aideId",
          label: "小助手",
          placeholder: "请选择小助手",
          value: "",
          clearable: true,
          options: []
        },

        {
          type: "select",
          name: "isMainRisk",
          label: "是否主险",
          placeholder: "请选择是否主险",
          value: "",
          clearable: true,
          options: [
            {
              label: "全部",
              value: ""
            },
            {
              label: "是",
              value: "Y"
            },
            {
              label: "否",
              value: "N"
            }
          ]
        },
        {
          type: "select",
          name: "orderType",
          label: "渠道标识",
          placeholder: "请选择渠道标识",
          value: "",
          clearable: true,
          options: [
            {
              label: "短意险",
              value: "1"
            },
            {
              label: "定期寿险",
              value: "2"
            },
            {
              label: "线下寿险",
              value: "3"
            },
            {
              label: "电投寿险",
              value: "4"
            },
            {
              label: "高端医疗",
              value: "5"
            },
            {
              label: "车险交强险",
              value: "6"
            },
            {
              label: "车险商业险",
              value: "7"
            },
            {
              label: "互联网团体险",
              value: "8"
            },
            {
              label: "线下高端医疗",
              value: "9"
            },
            {
              label: "线上高端医疗",
              value: "10"
            }
          ]
        }
      ],
      headers: [
        {
          key: "policyNo",
          title: "保单号"
        },
        {
          title: "主代理人",
          key: "agentName"
        },
        {
          title: "险种",
          key: "productName"
        },
        {
          title: "是否主险",
          key: "isMainRisk",
          escape: obj => {
            return obj.value == "Y" ? "是" : obj.value == "N" ? "否" : "全部";
          }
        },
        {
          title: "大童标保",
          key: "staPremium"
        },
        {
          title: "期交保费",
          key: "premium"
        },
        {
          title: "渠道标识",
          key: "orderType"
        },
        {
          title: "顾问",
          key: "adviserName"
        },
        {
          title: "专家",
          key: "expertName"
        },
        {
          title: "小助手",
          key: "aideName"
        }
      ],
      detailsVisible: false,
      upLoadData: {
        upUrl: `${devService}/order/core/upload`,
        fileList: []
      },
      type: "upload" //upload loaded 分别表示上传前和上传之后
    };
  },
  created() {
    this.initData();
    this.getAgentList(); //代理人列表
    this.getAdviserList(); //顾问
    this.getExpertList(); //专家
    this.getAideList(); //小助手
  },
  methods: {
    // 初始化数据
    initData(obj) {
      if (obj && obj.limit) {
        this.tableParam.pageSize = obj.limit;
      }
      this.listSuccessCb("getCorePolicyList");
    },
    //重置搜索表单
    resetForm() {
      for (let i = 0; i < this.queryFormList.length; i++) {
        this.queryFormList[i].value = "";
      }
    },
    async getAgentList() {
      let tempArr = [];
      let res = await api.getAgentList();
      res.data.map((item, index) => {
        tempArr.push({
          label: item.agentName,
          value: item.id
        });
      });
      this.addFormData("kbaoUserId", tempArr);
    },
    async getAdviserList() {
      let tempArr = [];
      let res = await api.getAdviserList();
      res.data.map((item, index) => {
        tempArr.push({
          label: item.adviserName,
          value: item.adviserId
        });
      });
      this.addFormData("adviserId", tempArr);
    },
    async getExpertList() {
      let tempArr = [];
      let res = await api.getExpertList();
      res.data.map((item, index) => {
        tempArr.push({
          label: item.expertName,
          value: item.expertId
        });
      });
      this.addFormData("expertId", tempArr);
    },
    async getAideList() {
      let tempArr = [];
      let res = await api.getAideList();
      res.data.map((item, index) => {
        tempArr.push({
          label: item.aideName,
          value: item.aideId
        });
      });
      this.addFormData("aideId", tempArr);
    },
    // 导出数据
    exportExcel() {
      // this.exportExcelCb(`${devService}/admin/agent/excel`);
      this.exportExcelCb("exportExcelCore");
    },
    //插入queryForm数据
    addFormData(key, arr) {
      if (key == "" || arr.length == 0) {
        return;
      }
      for (let i = 0; i < this.queryFormList.length; i++) {
        if (this.queryFormList[i].name == key) {
          this.queryFormList[i].options = arr;
        }
      }
    },
    uploadBtn() {
      console.log("upload");

      this.detailsVisible = true;
      this.type == "upload";
    },
    submit() {
      this.detailsVisible = true;
      if (this.upLoadData.fileList.length == 0) {
        this.$message.error("请选择上传的文件");
      }
      this.$refs.upload.submit();
    },
    addFile(file, fileList) {
      // console.log(file);
      // console.log(fileList);

      // 对上传的文件格式进行预过滤，待启用
      // let fileName = file.name;
      // let fileSize = file.size / 1024;
      // let type = fileName.split(".").splice(-1)[0];

      // const MAX_SIZE = 100000;
      // const FILE_TYPE_LIST = ["xlsx", "json"];

      // if (fileList > MAX_SIZE) {
      //   this.$message.error("上传文件超过XX限制，请重新确认");
      //   fileList.pop();
      // }
      // if (!type in FILE_TYPE_LIST) {
      //   this.$message.error("上传文件类型不对，请重新确认");
      //   fileList.pop();
      // }

      this.upLoadData.fileList = fileList;
    },
    deleteFile(file, fileList) {
      this.upLoadData.fileList = fileList;
    },
    //上传成功
    handleUploadSucess(res) {
      console.log(res.status, 333);
      if (res.status == 1) {
        this.type = "loaded";
        this.upLoadData.fileList.pop();
        console.log(this.type);
      }
    },
    //上传失败
    handleUploadError(res) {},
    handleBeforeUpload(res) {}, //导出上传失败数据
    exportData() {
      // console.log(this.uploadResult.key);
      // let data = {
      //   key: escape(this.uploadResult.key)
      // };
      window.location.href = `${devService}/order/core/upload`;
    }
  }
};
</script>

<style lang="less">
</style>