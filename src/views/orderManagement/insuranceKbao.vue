<template>
  <div class="app-container registered-users-page">
    <toolbar :toolButtons="toolButtons" @exportExcel="exportExcel"></toolbar>
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
      @detailsClick="detailsClick"
      @getList="initData"
    ></base-table>
    <baseDetails
      title="用户详情"
      :detailsVisible.sync="detailsVisible"
      :detailsOptions="detailsOptions"
      :detailsObj="detailsData"
    ></baseDetails>
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
          name: "phoneNumber",
          label: "电话",
          placeholder: "请输入电话",
          value: ""
        },
        {
          type: "select",
          name: "agentName",
          label: "推广费代理人",
          placeholder: "请选择推广费代理人",
          value: "",
          clearable: true,
          options: []
        },

        {
          type: "select",
          name: "adviserName",
          label: "顾问",
          placeholder: "请选择顾问",
          value: "",
          clearable: true,
          options: []
        },
        {
          type: "select",
          name: "expertName",
          label: "专家",
          placeholder: "请选择专家",
          value: "",
          clearable: true,
          options: []
        },
        {
          type: "select",
          name: "aideName",
          label: "小助手",
          placeholder: "请选择小助手",
          value: "",
          clearable: true,
          options: []
        },

        {
          type: "select",
          name: "orderStatus",
          label: "订单状态",
          placeholder: "请选择订单状态",
          value: "",
          clearable: true,
          options: [
            {
              label: "已提交",
              value: "1"
            },
            {
              label: "已核保",
              value: "2"
            },
            {
              label: "已收费",
              value: "3"
            },
            {
              label: "已承保",
              value: "4"
            },
            {
              label: "其他",
              value: "5"
            }
          ]
        },

        {
          type: "daterange",
          name: "insureStartDate",
          label: "起保时间",
          placeholder: "请选择起保时间",
          value: "",
          clearable: true
        },
        {
          type: "daterange",
          name: "insureEndDate",
          label: "终保时间",
          placeholder: "请选择终保时间",
          value: "",
          clearable: true
        }
      ],
      headers: [
        {
          key: "orderId",
          title: "订单号"
        },
        {
          title: "保险公司",
          key: "companyName"
        },
        {
          title: "产品名称",
          key: "productName"
        },
        {
          title: "订单状态",
          key: "orderStatus",
          escape: obj => {
            return obj.orderStatus == 1
              ? "已提交"
              : obj.orderStatus == 2
              ? "已核保"
              : obj.orderStatus == 3
              ? "已收费"
              : obj.orderStatus == 4
              ? "已承保"
              : "其他";
          }
        },
        {
          title: "保单号",
          key: "policyNo"
        },
        {
          title: "保单金额",
          key: "premium"
        },
        {
          title: "起保时间",
          key: "insureStartDate"
        },
        {
          title: "终保时间",
          key: "insureEndDate"
        },
        {
          title: "推广费代理人",
          key: "agentName"
        },
        {
          title: "投保人",
          key: "insurerName"
        },
        {
          title: "被保人",
          key: "insuredName"
        },
        {
          title: "电话",
          key: "phoneNumber"
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
      detailsOptions: [],
      detailsData: {},
      detailsVisible: false
    };
  },
  created() {
    this.initData();
    // this.getCompanyList();
    // this.getProvices();
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
      this.listSuccessCb("getKBaoList");
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
      if (res.data == null || res.data.length == 0) {
        return;
      }
      res.data.map((item, index) => {
        tempArr.push({
          label: item.agentName,
          value: item.id
        });
      });
      this.queryFormList[2].options = tempArr;
    },
    async getAdviserList() {
      let tempArr = [];
      let res = await api.getAdviserList();
      if (res.data == null || res.data.length == 0) {
        return;
      }
      res.data.map((item, index) => {
        tempArr.push({
          label: item.adviserName,
          value: item.adviserId
        });
      });
      this.queryFormList[3].options = tempArr;
    },
    async getExpertList() {
      let tempArr = [];
      let res = await api.getExpertList();
      if (res.data == null || res.data.length == 0) {
        return;
      }
      res.data.map((item, index) => {
        tempArr.push({
          label: item.expertName,
          value: item.expertId
        });
      });
      this.queryFormList[4].options = tempArr;
    },
    async getAideList() {
      let tempArr = [];
      let res = await api.getAideList();
      if (res.data == null || res.data.length == 0) {
        return;
      }
      res.data.map((item, index) => {
        tempArr.push({
          label: item.aideName,
          value: item.aideId
        });
      });
      this.queryFormList[5].options = tempArr;
    },
    // 详情
    detailsClick(row) {
      this.detailsData = row;
      this.detailsVisible = true;
    },
    // 导出数据
    exportExcel() {
      // this.exportExcelCb(`${devService}/admin/agent/excel`);
      this.exportExcelCb("exportExcelKbao");
    }
  }
};
</script>

<style lang="less">
</style>