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
      tableTitle="潜在客户列表"
      :loading="loading"
      :columns="headers"
      :list="list"
      :total="total"
      :pageNum.sync="tableParam.pageNum"
      :pageSize.sync="tableParam.pageSize"
      @detailsClick="detailsClick"
      @getList="initData"
      @toReal="toReal"
    ></base-table>
    <el-dialog :visible.sync="detailsVisible" title="文件上传" width="40%" @close="resetDialogData">
      <el-form>
        <div v-if="type=='upload'">
          <el-form-item label="请上传附件">
            <el-upload
              class="upload-demo"
              ref="upload"
              :action="upUrl"
              :file-list="fileList"
              :limit="1"
              :data="data"
              :auto-upload="false"
              :on-change="addFile"
              :on-remove="deleteFile"
              :before-upload="handleBeforeUpload"
              :on-success="handleSucess"
              :on-error="handleError"
              :headers="uploadHeaders"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item label="请选择渠道" style="margin-top:10px">
            <el-select v-model="channel" placeholder="请选择渠道" clearable>
              <el-option
                v-for="item in channelList"
                :key="item.channelId"
                :label="item.channelName"
                :value="item.channelName"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-else>
          <el-form-item>
            <span
              style="font-size:20px"
            >上传{{uploadResult.channelName}}成功，共新增{{uploadResult.successNum}}条数据</span>
          </el-form-item>
          <el-form-item>
            <span>发现已上传客户{{uploadResult.failNum}}人，上传无效</span>
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
import baseTable from "@/components/baseTableUser";
import queryConditions from "@/components/queryConditions";
import baseDetails from "@/components/baseDetails";
import toolbar from "@/components/toolbar";
import { formatQueryData } from "@/utils/tool";
import { getToken } from "@/utils/auth";

export default {
  name: "potentialUser",
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
          name: "wxName",
          label: "微信号",
          placeholder: "请输入微信号",
          value: ""
        },
        {
          type: "input",
          name: "nickName",
          label: "微信昵称",
          placeholder: "请输入微信昵称",
          value: ""
        },
        {
          type: "input",
          name: "channelName",
          label: "渠道来源",
          placeholder: "请输入渠道来源",
          value: ""
        },
        {
          type: "select",
          name: "isReal",
          label: "是否真实客户",
          placeholder: "请选择",
          value: "",
          clearable: true,
          options: [
            {
              label: "是",
              value: "1"
            },
            {
              label: "否",
              value: "0"
            }
          ]
        },
        {
          type: "daterange",
          name: "startTime",
          label: "上传时间",
          placeholder: "请选择开始时间",
          value: "",
          clearable: true,
          valueFormat: "yyyy-MM-dd"
        }
      ],
      headers: [
        {
          key: "avatarUrl",
          title: "微信头像",
          slot: "img",
          hidden: true,
          extra: true
        },
        {
          key: "wxName",
          title: "微信号"
        },
        {
          key: "nickName",
          title: "微信昵称"
        },
        {
          key: "channelName",
          title: "渠道来源"
        },
        {
          type: "operate",
          key: "isReal",
          title: "是否真实用户",
          operates: [
            {
              name: "更换顾问",
              key: "isReal",
              emitKey: "toReal",
              escape: obj => {
                return obj.isReal == 1 ? "是" : "否";
              },
              escape2: obj => {
                return obj.isReal != 1;
              }
            }
          ]
        },
        {
          key: "updateTime",
          title: "上传时间"
        }
      ],
      detailsData: {},
      detailsVisible: false,
      type: "tempUser",
      title: "文件上传",
      fileList: [],
      channelList: [],
      channel: "",
      data: {
        channelName: "",
        channelId: ""
      },
      upUrl: `${devService}/customer/temp/uploadData/`,
      type: "upload", //upload loaded 分别表示上传前和上传之后
      uploadResult: {}, //拼接上传结果提示信息data
      uploadHeaders: { authorization: getToken() }
    };
  },
  created() {
    this.initData();
    this.getChannelList();
  },
  methods: {
    // 初始化数据
    initData(obj) {
      if (obj && obj.limit) {
        this.tableParam.pageSize = obj.limit;
      }
      this.listSuccessCb("potentialUsers");
    },
    //重置搜索表单
    resetForm() {
      for (let i = 0; i < this.queryFormList.length; i++) {
        this.queryFormList[i].value = "";
      }
    },
    async getChannelList() {
      let result = await api.getChannelList();
      if (result.status) {
        this.channelList = result.data;
      } else {
        this.$message.error(res.msg);
      }
    },
    toReal(row) {
      let wxId = row.wxId;
      this.$router.push({
        path: "realUser",
        query: {
          wxId
        }
      });
    },
    // 详情
    detailsClick(row) {
      this.detailsData = row;
      this.detailsVisible = true;
    },
    // 导出数据
    exportExcel() {
      this.exportExcelCb("exportExcel");
    },
    //上传数据
    uploadBtn() {
      if (!this.PermissionAuth("temp", "post")) {
        this.$message.error("该操作没有权限");
        return;
      }
      this.fileList = [];
      this.channel = "";

      this.detailsVisible = true;
    },
    addFile(file, fileList) {
      // 对上传的文件格式进行预过滤，待启用
      let fileName = file.name;
      let fileSize = file.size / 1024;
      let type = fileName.split(".").splice(-1)[0];

      const MAX_SIZE = 60 * 1024;
      // const FILE_TYPE_LIST = ["xlsx", "json"];
      const FILE_TYPE_LIST = ["json"];

      if (fileSize > MAX_SIZE) {
        this.$message.error("上传文件超过60M限制，请重新确认");
        fileList.pop();
        return;
      }
      // debugger;
      if (FILE_TYPE_LIST.indexOf(type) == -1) {
        this.$message.error("上传文件的类型只能为json，请重新确认");
        fileList.pop();
        return;
      }

      this.fileList = fileList;
    },
    deleteFile(file, fileList) {
      this.fileList = fileList;
    },
    handleSucess(res, file, fileList) {
      if (res.status) {
        res = res.data;
        this.uploadResult.channelName = res.channelName;
        this.uploadResult.successNum = res.successNum;
        this.uploadResult.failNum = res.failNum;
        this.uploadResult.key = res.saveKey;
        this.type = "loaded";
      } else {
        this.$message.error(res.msg);
      }
    },
    handleError(res) {
      this.$message.error(res.msg);
    },

    handleBeforeUpload(file) {
    },
    async submit() {
      if (this.type == "loaded") {
        this.detailsVisible = false;
        return;
      }
      if (this.fileList.length == 0) {
        this.$message.error("请选择上传的文件");
        return false;
      }

      if (this.channel == "" || this.channel == undefined) {
        this.$message.error("请选择上传的渠道");
        return false;
      }

      let _this = this;
      let id = "";
      for (let item of this.channelList) {
        if (this.channel == item.channelName) {
          id = item.channelId;
          break;
        }
      }

      _this.data.channelName = _this.channel;
      _this.data.channelId = id;

      this.$refs.upload.submit();
      this.type = "upload";
    },
    //导出上传失败数据
    async exportData() {
      let data = {
        key: escape(this.uploadResult.key)
      };

      let res = await api.exportExceltempUser(data);
      if (res.status == 1) {
        window.location.href = res.data.strData;
        this.type = "upload";
        this.detailsVisible = false;
        this.fileList.pop();
        this.channel = "";
      } else {
        this.$message.error(res.msg);
      }
    },
    //关闭对话框时把对话框内容恢复成初始值
    resetDialogData() {
      // debugger;
      this.detailsVisible = false;
      this.type = "upload";
      this.detailsVisible = false;
      this.fileList.pop();
      this.channel = "";
    }
  }
};
</script>

<style lang="less">
</style>