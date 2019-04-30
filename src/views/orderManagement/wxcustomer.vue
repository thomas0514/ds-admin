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
      tableTitle="绑定客户微信"
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
import baseTable from "@/components/baseTableOrg";
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
      queryFormList: [
        {
          type: "input",
          name: "nickName",
          label: "微信昵称",
          placeholder: "请输入微信昵称",
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
          type: "input",
          name: "phoneNumber",
          label: "手机号",
          placeholder: "请输入手机号",
          value: ""
        },

        {
          name: "sort",
          value: "createTime"
        }
      ],
      headers: [
        {
          key: "avatarUrl",
          title: "微信头像",
          type: "img"
        },
        {
          key: "nickName",
          title: "微信昵称"
        },
        {
          key: "wxName",
          title: "微信号"
        },
        {
          key: "serviceOrderId",
          title: "订单编号"
        },
        {
          key: "payTime",
          title: "付款时间"
        },
        {
          key: "customerName",
          title: "姓名"
        },
        {
          key: "phoneNumber",
          title: "手机号"
        },
        {
          type: "operate",
          title: "操作",
          width: "50",
          operates: [
            {
              name: "同步",
              emitKey: "synchronize"
            }
          ]
        }
      ],
      detailsOptions: [],
      detailsData: {},
      detailsVisible: false
    };
  },
  created() {
    this.initData();
  },
  methods: {
    // 初始化数据
    initData(obj) {
      if (obj && obj.limit) {
        this.tableParam.pageSize = obj.limit;
      }
      this.listSuccessCb("getWxcustomerList");
    },
    //重置搜索表单
    resetForm() {
      for (let i = 0; i < this.queryFormList.length; i++) {
        this.queryFormList[i].value = "";
      }
    },
    synchronize(row) {
      let that = this;
      if(!that.PermissionAuth("wxcustomer", "put")){
        that.$message.error("该操作没有权限");
        return false;
      }
      let policyIds = that.$route.query.policyId.split(",");
      let title = "确定绑定" + "“" + row.customerName + "”的保险订单吗？";
      let data = {
        policyIds: policyIds,
        serviceOrderId: row.serviceOrderId
      };
      that
        .$confirm(title, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
            that.orderBind(data);
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消绑定"
          });
        });
    },
    async orderBind(data) {
      let res = await api.orderBind(data);
      if (res.status == 1) {
        this.$message.success(res.msg);
        this.initData();
      } else {
        this.$message.error(res.msg);
      }
    },
  }
};
</script>

<style lang="less">
.registered-users-page {
}
</style>