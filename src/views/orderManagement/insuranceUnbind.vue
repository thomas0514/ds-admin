<template>
  <div class="app-container registered-users-page">
    <queryConditions
      :dialogFormVisible.sync="dialogFormVisible"
      :queryFormList.sync="queryFormList"
      :queryParams="queryParams"
      @search="initData"
      @resetForm="resetForm"
    ></queryConditions>
    <base-table
      tableTitle="解绑订单列表"
      :loading="loading"
      :columns="headers"
      :list="list"
      :total="total"
      :pageNum.sync="tableParam.pageNum"
      :pageSize.sync="tableParam.pageSize"
      @synchronize="synchronize"
      @getList="initData"
    ></base-table>
  </div>
</template>

<script>
import { devService } from "@/config/env";
import api from "@/api/index";
import listMixins from "@/mixins/tableList";
import baseTable from "@/components/baseTable";
import queryConditions from "@/components/queryConditions";
import baseDetails from "@/components/baseDetails";

export default {
  name: "registeredUsers",
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
          name: "同步",
          operation: "selectAll",
          icon: "el-icon-rank"
        }
      ],
      queryFormList: [
        {
          type: "input",
          name: "customerName",
          label: "投保人姓名",
          placeholder: "请输入投保人姓名",
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
          name: "idNo",
          label: "身份证号",
          placeholder: "请输入身份证号",
          value: ""
        },
        {
          type: "select",
          name: "areaId",
          label: "地区",
          placeholder: "请选择地区",
          value: "",
          clearable: true,
          options: [
          ]
        },
        {
          type: "select",
          name: "status",
          label: "状态",
          placeholder: "请选择状态",
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
            },{
              label: "其他",
              value: "5"
            },
          ]
        },
        {
          type: "daterange",
          name: "startTime",
          label: "订单时间",
          value: "",
          clearable: true
        },
        {
          name: "sort",
          value: "createTime"
        }
      ],
      headers: [
        {
          key: "orderId",
          title: "订单编号"
        },
        {
          key: "orderTime",
          title: "订单时间",
          width:"90"
        },
        {
          key: "policyNo",
          title: "保单号"
        },
        {
          key: "printNo",
          title: "投保单号"
        },
        {
          key: "orderType",
          title: "险种"
        },
        {
          key: "productName",
          title: "产品名称"
        },
        {
          key: "insurer",
          title: "投保人"
        },
        {
          key: "insurerIdNo",
          title: "投保人身份证号"
        },
        {
          key: "insurerPhone",
          title: "投保人手机号"
        },
        {
          key: "insured",
          title: "被保人"
        },
        {
          key: "insuredIdNo",
          title: "被保人身份证号"
        },
        {
          key: "staPremium",
          title: "保费"
        },
        {
          key: "areaName",
          title: "地区"
        },
        {
          key: "orderStatus",
          title: "状态"
        },
        {
          type: "operate",
          title: "操作",
          width: "50",
          operates: [
            {
              name: "解绑",
              emitKey: "synchronize"
            }
          ]
        }
      ],
      policyIds: []
    };
  },
  created() {
    this.initData();
    this.getAreaList();
  },
  methods: {
    // 初始化数据
    initData(obj) {
      if (obj && obj.limit) {
        this.tableParam.pageSize = obj.limit;
      }
      this.listSuccessCb("getUnBindList");
    },
    //重置搜索表单
    resetForm() {
      for (let i = 0; i < this.queryFormList.length; i++) {
        this.queryFormList[i].value = "";
      }
    },
     synchronize(row) {
      let that = this;
      let policyId = row.policyId
      let title = "确定解绑“" + row.insurer + "”的保险订单吗？";
      let data = {
        id: policyId,
      };
      that
        .$confirm(title, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
            that.orderUnBind(data);
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
     async orderUnBind(data) {
      let res = await api.orderUnBind(data);
      if (res.status == 1) {
        this.$message.success(res.msg);
        this.initData();
      } else {
        this.$message.error(res.msg);
      }
    },
    selectAll() {
      let policyId = this.policyIds.join(",");
      if (policyId == "" || policyId == null) {
        this.$message.error("您还未选择需要解绑的保单");
        return false;
      }
      this.$router.push({
        path: "/orderManagement/wxcustomer",
        query: {
          policyId: policyId,
          bindStatus: 0
        }
      });
    },
    changeSelect(val) {
      this.policyIds = [];
      for (var i in val) {
        this.policyIds.push(val[i].policyId);
      }
    },
    async getAreaList() {
      let queryFormList = this.queryFormList;
      let newList = [];
      let result = await api.getHeadAreaList();
      if (result.data) {
        let list = result.data;
        for (let i = 0; i < list.length; i++) {
          newList.push({
            label: list[i].areaName,
            value: list[i].areaId
          });
        }
      }
      for (let i = 0; i < queryFormList.length; i++) {
        if (queryFormList[i].name == "areaId") {
          queryFormList[i].options = newList;
        }
      }
    },
  }
};
</script>

<style lang="less">
.registered-users-page {
}
</style>