<template>
  <div class="app-container registered-users-page">
    <queryConditions
      :dialogFormVisible.sync="dialogFormVisible"
      :queryFormList.sync="queryFormList"
      :queryParams="queryParams"
      @search="initData"
      @resetForm="resetForm"
    ></queryConditions>
    <div class="export">
      <el-button icon="el-icon-download" @click="exportExcel" type="primary">导出</el-button>
    </div>
    <base-table
      tableTitle="优惠券发送记录列表"
      :loading="loading"
      :columns="headers"
      :list="list"
      :total="total"
      :pageNum.sync="tableParam.pageNum"
      :pageSize.sync="tableParam.pageSize"
      @getList="initData"
    ></base-table>
  </div>
</template>

<script>
import { devService } from "@/config/env";
import api from "@/api/index";
import listMixins from "@/mixins/tableList";
import baseTable from "@/components/baseTableUser";
import queryConditions from "@/components/queryConditions";
import toolbar from "@/components/toolbar";

export default {
  name: "couponRecord",
  mixins: [listMixins],
  components: {
    queryConditions,
    baseTable,
    toolbar
  },
  data() {
    return {
      queryFormList: [
        {
          type: "datetimerange",
          format:"yyyy-MM-dd HH:mm:ss",
          name: "startTime",
          label: "发放时间",
          placeholder: "请选择开始时间",
          value: "",
          clearable: true,
          options: []
        }
      ],
      headers: [
        {
          key: "grantTime",
          title: "发放时间"
        },
        {
          key: "grantCount",
          title: "发放人数"
        },
        {
          key: "usedCount",
          title: "使用人数"
        },
        {
          key: "conditionExplain",
          title: "优惠券规则"
        },
        {
          key: "endTime",
          title: "到期时间"
        },
        {
          key: "name",
          title: "发放人"
        }
      ]
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
      this.listSuccessCb("getCouponRecordList");
    },
    resetForm(){
      this.queryFormList[0].value=""
    },
    // 导出数据
    exportExcel() {
      this.exportExcelCb("exportCouponExcel");
    }
  }
};
</script>

<style lang="less">
.export {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>