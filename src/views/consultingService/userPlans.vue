<template>
  <div class="app-container user-feedback-page">
    <queryConditions
      :dialogFormVisible.sync="dialogFormVisible"
      :queryFormList.sync="queryFormList"
      :queryParams="queryParams"
      @search="initData"
      @resetForm="resetForm"
    ></queryConditions>
    <base-table
      tableTitle="客户方案列表"
      :loading="loading"
      :columns="headers"
      :list="list"
      :total="total"
      :pageNum.sync="tableParam.pageNum"
      :pageSize.sync="tableParam.pageSize"
      @detailsClick="detailsClick"
      @getList="initData"
    ></base-table>
  </div>
</template>

<script>
import api from "@/api/index";
import listMixins from "@/mixins/tableList";
import baseTable from "@/components/baseTable";
import queryConditions from "@/components/queryConditions";

export default {
  name: "userPlans",
  mixins: [listMixins],
  components: {
    queryConditions,
    baseTable
  },
  data() {
    return {
      experList: [],
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
          name: "expertId",
          label: "专家",
          placeholder: "请输入专家",
          value: "",
          options: []
        },
        {
          type: "select",
          name: "planStatus",
          label: "方案状态",
          placeholder: "请输入方案状态",
          value: "",
          options: [
            {
              label: "待配置",
              value: 1
            },
            {
              label: "已完成",
              value: 2
            },
            {
              label: "需修改",
              value: 3
            }
          ]
        },
        {
          type: "select",
          name: "sort",
          label: "排序",
          placeholder: "请选择排序",
          value: "",
          options: [
            {
              label: "创建时间正序",
              value: "1"
            },
            {
              label: "创建时间倒序",
              value: "-1"
            }
          ]
        }
      ],
      headers: [
        {
          key: "serviceOrderId",
          title: "订单ID",
          width: "150px"
        },
        {
          key: "createTime",
          title: "订单时间",
          width: "150px"
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
          key: "areaName",
          title: "地区"
        },
        {
          key: "planStatus",
          title: "状态",
          escape: row => {
            return row.planStatus == 1
              ? "待配置"
              : row.planStatus == 2
                ? "已完成"
                : "需修改";
          }
        },
        {
          type: "operate",
          title: "操作",
          operates: [
            {
              name: "配置方案",
              key: "configure",
              emitKey: "detailsClick"
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
      this.listSuccessCb("getCustomerOrderList");
    },
    //重置搜索表单
    resetForm() {
      for (let i = 0; i < this.queryFormList.length; i++) {
        this.queryFormList[i].value = "";
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
        this.experList = newList;
      }
      for (let i = 0; i < queryFormList.length; i++) {
        if (queryFormList[i].name == "expertId") {
          queryFormList[i].options = newList;
        }
      }
    },
    async detailsClick(row) {
      if (!this.PermissionAuth("plan", "put")) {
        this.$message({
          type: "error",
          message: "该操作没有权限",
          center: true
        });
        return false;
      }
      this.$router.push({
        path: "userPlanDetails",
        query: {
          orderId: row.serviceOrderId
        }
      });
    }
  }
};
</script>

<style lang="less">
.user-feedback-page {
  .img-box {
    width: 500px;
    display: inline-block;
    vertical-align: top;
    img {
      margin-right: 10px;
    }
  }
}
</style>