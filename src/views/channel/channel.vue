<template>
  <div class="app-container registered-users-page">
    <toolbar :toolButtons="toolButtons" @uploadBtn="uploadBtn"></toolbar>
    <queryConditions
      :dialogFormVisible.sync="dialogFormVisible"
      :queryFormList.sync="queryFormList"
      :queryParams="queryParams"
      @search="initData"
      @resetForm="resetForm"
    ></queryConditions>
    <base-table
      tableTitle="渠道管理列表"
      :loading="loading"
      :columns="headers"
      :list="list"
      :total="total"
      :pageNum.sync="tableParam.pageNum"
      :pageSize.sync="tableParam.pageSize"
      @modifyInfo="modifyInfo"
      @changeWechat="changeWechat"
      @getList="initData"
    ></base-table>
    <el-dialog :visible.sync="detailsVisible" :title="title" width="30%">
      <el-form label-width="100px">
        <div v-if="type=='addChannel'">
          <el-form-item label="渠道名称">
            <el-input v-model="channelName"></el-input>
          </el-form-item>
        </div>
        <div v-if="type=='infoModify'">
          <el-form-item label="渠道名称">
            <el-input v-model="data.channelName"></el-input>
          </el-form-item>
          <el-form-item label="投放时间" required>
            <el-form-item>
              <el-date-picker
                type="datetime"
                placeholder="投放时间"
                v-model="data.putInTime"
                style="width: 100%;"
                value-format="yyyy-MM-dd HH:mm"
              ></el-date-picker>
            </el-form-item>
          </el-form-item>
          <el-form-item label="渠道类型">
            <el-input v-model="data.channelType"></el-input>
          </el-form-item>
          <el-form-item label="合作形式">
            <el-input v-model="data.formOfCooperation"></el-input>
          </el-form-item>
          <el-form-item label="投放文章">
            <el-input v-model="data.droppingArticles"></el-input>
          </el-form-item>
          <el-form-item label="文章阅读量">
            <el-input v-model="data.readingVolume" type="number"></el-input>
          </el-form-item>
          <el-form-item label="渠道状态">
            <el-select v-model="data.channelStatus" placeholder="请选择渠道状态">
              <el-option
                v-for="(item,index) in channelStatusList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-if="type=='changeWechat'">
          <el-form-item label="昵称">
            <el-input v-model="data.currentWxNickName" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item label="二维码">
            <img style="width:120px;height:120px" :src="data.currentWxQRCodePath">
          </el-form-item>
          <label>更换后</label>
          <el-form-item label="昵称" style="margin-top:15px">
            <el-input v-model="wechatnickName"></el-input>
          </el-form-item>
          <el-form-item label="二维码">
            <el-upload
              class="upload-demo"
              :action="imgUrl"
              ref="upload"
              :on-success="handleUploadSucess"
              :before-upload="handleBeforeUpload"
              :file-list="fileList"
              :limit="1"
              list-type="picture"
              :on-error="handleUploadError"
              :on-remove="deleteFile"
              :headers="uploadHeaders"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
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
import { getToken } from "@/utils/auth";

export default {
  name: "cahnnel",
  mixins: [listMixins],
  components: {
    queryConditions,
    baseTable,
    baseDetails
  },
  data() {
    return {
      toolButtons: [
        {
          name: "添加渠道",
          operation: "uploadBtn",
          icon: "el-icon-plus"
        }
      ],
      queryFormList: [
        {
          type: "select",
          name: "channelStatus",
          label: "渠道状态",
          placeholder: "请选择渠道状态",
          value: "",
          options: []
        },
        {
          type: "input",
          name: "personInCharge",
          label: "负责人",
          placeholder: "请输入负责人姓名",
          value: ""
        },
        {
          type: "input",
          name: "channelType",
          label: "渠道类型",
          placeholder: "请输入渠道类型",
          value: ""
        },
        {
          type: "input",
          name: "formOfCooperation",
          label: "合作形式",
          placeholder: "请输入合作形式",
          value: ""
        },
        {
          type: "daterange",
          name: "startTime",
          label: "开始时间",
          placeholder: "请选择开始时间",
          value: "",
          clearable: true,
          options: []
        }
      ],
      headers: [
        {
          key: "channelUrl",
          title: "渠道链接",
          extra: true
        },
        {
          key: "channelQRcode",
          width: "120",
          slot: "img",
          hidden: true,
          title: "渠道链接二维码"
        },
        {
          key: "personInCharge",
          title: "负责人"
        },
        {
          key: "putInTime",
          title: "投放时间"
        },
        {
          key: "channelType",
          title: "渠道类型"
        },
        {
          key: "formOfCooperation",
          title: "合作形式"
        },
        {
          key: "droppingArticles",
          title: "投放文章"
        },
        {
          key: "channelName",
          title: "渠道名称"
        },
        {
          key: "readingVolume",
          title: "文章阅读量"
        },
        {
          key: "channelStatus",
          title: "渠道状态",
          escape: row => {
            return row.channelStatus == 0
              ? "未投放"
              : row.channelStatus == 1
              ? "已投放"
              : "废弃";
          }
        },
        {
          key: "pv",
          title: "PV"
        },
        {
          key: "uv",
          title: "UV"
        },
        {
          type: "operate",
          title: "操作",
          width: "150",
          operates: [
            {
              name: "信息修改",
              emitKey: "modifyInfo"
            },
            {
              name: "更换微信",
              emitKey: "changeWechat"
            }
          ]
        }
      ],
      detailsData: {},
      detailsVisible: false,
      upLoadVis: false,
      hidden: false,
      type: "", //设置弹出框的类型 channel为渠道页面的添加渠道和修改信息
      title: "",
      data: {}, //弹出框当前行信息
      wechatnickName: "", //修改微信昵称
      channelName: "", //添加渠道 渠道名称
      channelStatusList: [],
      imgUrl: `${devService}/channel/uploadWxQRcode`,
      fileList: [],
      upData: {
        currentWxQRCodeName: "",
        currentWxQRCodePath: ""
      },
      methodHeaders: {
        Method: "put"
      },
      uploadHeaders: { authorization: getToken() }
    };
  },
  created() {
    this.initData();
    // this.getCompanyList();
    this.getChannelStatus(); //获取渠道状态
  },
  methods: {
    // 初始化数据
    initData(obj) {
      if (obj && obj.limit) {
        this.tableParam.pageSize = obj.limit;
      }
      this.listSuccessCb("getChannelDetail");
    },
    //重置搜索表单
    resetForm() {
      for (let i = 0; i < this.queryFormList.length; i++) {
        this.queryFormList[i].value = "";
      }
    },
    //改修信息
    modifyInfo(row) {
      this.data = Object.assign({}, row);
      this.detailsVisible = true;
      this.type = "infoModify";
      this.title = "修改信息";
    },
    //改修信息
    changeWechat(row) {
      console.log(this.fileList);

      this.fileList.length = 0;

      console.log(this.fileList, 222);
      this.detailsVisible = true;
      this.type = "changeWechat";
      this.title = "更换微信";
      //恢复默认数据
      this.wechatnickName = "";
      this.data = Object.assign({}, row);

      this.fileList.pop();
    },
    // 导出数据
    exportExcel() {
      this.exportExcelCb(`${devService}/customer/temp/excel`);
    },
    uploadBtn() {
      this.detailsVisible = true;
      this.type = "addChannel";
      this.title = "添加渠道";
      this.channelName = "";
    },
    uploadVisible(val) {
      this.upLoadVis = val;
    },
    async submit() {
      let result;
      switch (this.type) {
        case "addChannel":
          result = await api.channelAdd({ strData: this.channelName });
          console.log(result);
          break;
        case "infoModify":
          let that = this;

          let data = {
            channelName: that.data.channelName,
            putInTime: that.data.putInTime,
            channelType: that.data.channelType,
            formOfCooperation: that.data.formOfCooperation,
            droppingArticles: that.data.droppingArticles,
            readingVolume: that.data.readingVolume,
            channelStatus: that.data.channelStatus,
            channelId: that.data.channelId
          };
          result = await api.channelUpdate(data);
          console.log(result);
          break;
        case "changeWechat":
          console.log("changeWechat");
          if (!this.wechatnickName) {
            this.$message.error("输入昵称后，请重试");
            return false;
          }
          if (this.upData.currentWxQRCodeName == "") {
            this.$message.error("二维码图片未选择或者未上传，请重试");
            return false;
          }

          let tmp = Object.assign(
            {
              channelId: this.data.channelId,
              nickName: this.wechatnickName
            },
            this.upData
          );

          console.log(tmp);
          result = await api.changeWechat(tmp);

        // return;

        default:
          break;
      }
      if (result.status) {
        console.log("oK");
        this.initData();
        this.detailsVisible = false;
        if (this.type == "changeWechat") {
          console.log("oK", "changeWechat");
          this.wechatnickName = "";
          this.deleteFile();
          // this.upData = {
          //   currentWxQRCodeName: "",
          //   currentWxQRCodePath: ""
          // };
          // this.fileList.length = 0;
        }
      } else {
        this.$message.error(res.msg);
      }
    },
    handleUploadSucess(res, file, fileList) {
      console.log(res, 22222222);
      console.log(file, 22222222);
      console.log(fileList, 22222222);
      this.fileList = fileList;

      if (res.status == 1) {
        // this.upData.currentWxQRCodePath = res.data.currentWxQRCodePath;
        // this.upData.currentWxQRCodeName = res.data.currentWxQRCodeName;
        this.upData = res.data;
      } else {
        this.$message.error(res.msg);
      }
    },
    handleUploadError(res) {
      console.log(res);
    },
    deleteFile(file, fileList) {
      console.log("delete");
      this.upData = {
        currentWxQRCodeName: "",
        currentWxQRCodePath: ""
      };
      this.fileList.pop();

      // this.fileList = fileList;
    },
    handleBeforeUpload() {},
    async getChannelStatus() {
      // let tempArr = [];
      let res = await api.getChannelStatus();
      // res.data.map((item, index) => {
      //   tempArr.push({
      //     label: item.des,
      //     value: item.status
      //   });
      // });
      // this.queryFormList[0].options = tempArr;
      res.data.map((item, index) => {
        this.channelStatusList.push({
          label: item.des,
          value: item.status
        });
      });
      this.queryFormList[0].options = this.channelStatusList;
      console.log(this.channelStatusList);
    }
  }
};
</script>

<style lang="less">
</style>