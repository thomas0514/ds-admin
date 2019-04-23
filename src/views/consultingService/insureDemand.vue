<template>
  <div class="app-container user-feedback-page">
    <toolbar :toolButtons="toolButtons" @createQrCode="createQrCode"></toolbar>
    <queryConditions
      :dialogFormVisible.sync="dialogFormVisible"
      :queryFormList.sync="queryFormList"
      :queryParams="queryParams"
      @search="initData"
      @resetForm="resetForm"
    ></queryConditions>
    <base-table
      tableTitle="投保需求列表"
      :loading="loading"
      :columns="headers"
      :list="list"
      :total="total"
      :pageNum.sync="tableParam.pageNum"
      :pageSize.sync="tableParam.pageSize"
      @editClick="editClick"
      @viewClick="viewClick"
      @viewPlan="viewPlan"
      @getList="initData"
    ></base-table>
    <el-dialog title="编辑投保需求" :visible.sync="dialogTableVisible">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="投保时间">
          <el-date-picker
            type="date"
            placeholder="选择投保时间"
            v-model="form.insureDate"
            style="width: 100%;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="投保险种">
          <el-input v-model="form.kind"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div class="opt">
        <el-button @click="submit" type="primary">提交</el-button>
        <el-button @click="cancel" type="info">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="投被保人资料问卷二维码" :visible.sync="qrcodeDialog">
      <div class="qrcode">
        <img :src="qrcodeUrl" alt="投被保人资料问卷二维码">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/index";
import { parseTime } from "@/utils";
import listMixins from "@/mixins/tableList";
import baseTable from "@/components/baseTable";
import queryConditions from "@/components/queryConditions";

export default {
  name: "insureDemand",
  mixins: [listMixins],
  components: {
    queryConditions,
    baseTable
  },
  data() {
    return {
      toolButtons: [
        {
          name: "投被保人资料问卷二维码",
          operation: "createQrCode",
          icon: "el-icon-menu"
        }
      ],
      qrcodeDialog: false,
      qrcodeUrl: "",
      dialogTableVisible: false,
      form: {
        serviceOrderId: "",
        insureDate: "",
        kind: "",
        remark: ""
      },
      serviceOrderId: "",
      experList: [],
      queryFormList: [
        {
          type: "input",
          name: "wxUserId",
          label: "微信号",
          placeholder: "请输入微信号",
          value: ""
        },
        {
          type: "input",
          name: "phoneNumber",
          label: "手机号",
          placeholder: "请输入手机号",
          value: ""
        },
        {
          type: "input",
          name: "customerName",
          label: "姓名",
          placeholder: "请输入姓名",
          value: ""
        },
        {
          type: "select",
          name: "isInsure",
          label: "是否投保",
          placeholder: "请选择状态",
          value: "",
          options: [
            {
              label: "是",
              value: 1
            },
            {
              label: "否",
              value: 0
            }
          ]
        },
        {
          type: "select",
          name: "subProcessCode",
          label: "订单状态",
          placeholder: "请选择状态",
          value: "",
          options: [
            {
              value: "101",
              label: "购买服务"
            },
            {
              value: "201",
              label: "待填写问卷"
            },
            {
              value: "202",
              label: "待选择时间"
            },
            {
              value: "301",
              label: "已匹配专家"
            },
            {
              value: "401",
              label: "待初次沟通"
            },
            {
              value: "403",
              label: "初次沟通环节"
            },
            {
              value: "501",
              label: "待出具方案"
            },
            {
              value: "502",
              label: "待发送方案"
            },
            {
              value: "503",
              label: "待沟通方案"
            },
            {
              value: "504",
              label: "方案沟通环节"
            },
            {
              value: "506",
              label: "待修改方案"
            },
            {
              value: "507",
              label: "待发送方案"
            },
            {
              value: "601",
              label: "方案满意"
            },
            {
              value: "701",
              label: "电话回访环节"
            },
            {
              value: "704",
              label: "已完成回访"
            }
          ]
        },
        {
          type: "datetimerange",
          name: "startTime",
          label: "投保日期",
          placeholder: "请选择投保日期",
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
          options: []
        }
      ],
      headers: [
        {
          key: "serviceOrderId",
          title: "订单ID"
        },
        {
          key: "wxName",
          title: "微信号"
        },
        {
          key: "customerName",
          title: "客户姓名"
        },
        {
          key: "phoneNumber",
          title: "手机号"
        },
        {
          key: "adviserName",
          title: "顾问"
        },
        {
          key: "expertName",
          title: "专家"
        },
        {
          key: "aideName",
          title: "小助手"
        },
        {
          type: "operate",
          key: "plan",
          title: "方案",
          operates: [
            {
              name: "点击查看",
              key: "viewPlan",
              emitKey: "viewPlan"
            }
          ]
        },
        {
          key: "customerRequirDate",
          title: "客户最新申请时间"
        },
        {
          key: "demandDate",
          title: "需求时间"
        },
        {
          key: "tbtime",
          title: "投保时间",
          escape: row => {
            console.log(row);
            return row.insureInfo ? row.insureInfo.insureDate : "";
          }
        },
        {
          key: "tbtime",
          title: "投保险种",
          escape: row => {
            return row.insureInfo ? row.insureInfo.kind : "";
          }
        },
        {
          key: "remarks",
          title: "备注",
          escape: row => {
            return row.insureInfo ? row.insureInfo.remark : "";
          }
        },
        {
          key: "insureStatus",
          title: "是否投保",
          escape: row => {
            return row.isInsure == 0 ? "未" : "已投保";
          }
        },
        {
          key: "subProcessCodeText",
          title: "订单阶段"
        },
        {
          type: "operate",
          title: "操作",
          operates: [
            {
              name: "编辑",
              key: "edit",
              emitKey: "editClick"
            },
            {
              name: "查看资料",
              key: "view",
              emitKey: "viewClick"
            }
          ]
        }
      ]
    };
  },
  created() {
    this.initData();
    this.getExperList();
  },
  methods: {
    // 初始化数据
    async initData(obj) {
      if (obj && obj.limit) {
        this.tableParam.pageSize = obj.limit;
      }
      this.listSuccessCb("getInsureList");
    },
    //重置搜索表单
    resetForm() {
      for (let i = 0; i < this.queryFormList.length; i++) {
        this.queryFormList[i].value = "";
      }
    },
    async createQrCode() {
      let qrcodeResult = await api.createInsureQrcode();
      if (qrcodeResult.status == 1) {
        this.qrcodeUrl = qrcodeResult.data.id;
        if (this.qrcodeUrl) {
          this.qrcodeDialog = true;
        }
      } else {
        this.$message({
          type: "error",
          message: "二维码生成失败",
          center: true
        });
      }
    },
    async getExperList() {
      let queryFormList = this.queryFormList;
      let newList = [];
      let result = await api.getExperList();
      if (result.data) {
        let list = result.data;
        for (let i = 0; i < list.length; i++) {
          newList.push({
            label: list[i].expertName,
            value: list[i].expertId
          });
        }
      }
      for (let i = 0; i < queryFormList.length; i++) {
        if (queryFormList[i].name == "expertId") {
          queryFormList[i].options = newList;
        }
      }
    },
    async viewPlan(row) {
      this.$router.push({
        path: "userPlanDetails",
        query: {
          orderId: row.serviceOrderId
        }
      });
    },
    editClick(row) {
      this.serviceOrderId = row.serviceOrderId;
      if (row.insureInfo) {
        this.form = row.insureInfo;
      } else {
        this.form.serviceOrderId = row.serviceOrderId;
      }
      this.dialogTableVisible = !this.dialogTableVisible;
    },
    viewClick(row) {
      this.$router.push({
        path: "insuranceQuestionnaire",
        query: {
          id: row.serviceOrderId
        }
      });
    },
    async submit() {
      if (this.form.insureDate) {
        this.form.insureDate = parseTime(this.form.insureDate);
      }
      let result = await api.changeInsuranceDemand(this.form);
      if (result.status == 1) {
        this.$message({
          type: "success",
          message: "修改成功",
          center: true
        });
        this.form = {
          insureDate: "",
          kind: "",
          remark: ""
        };
        this.dialogTableVisible = false;
      } else {
        this.$message({
          type: "error",
          message: "修改失败",
          center: true
        });
      }
    },
    cancel() {
      this.dialogTableVisible = false;
      this.form = {
        insureDate: "",
        kind: "",
        remark: ""
      };
    }
  }
};
</script>

<style lang="less">
.user-feedback-page {
  .opt {
    text-align: center;
    margin-top: 20px;
  }
}
</style>