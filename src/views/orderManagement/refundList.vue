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
			tableTitle="退款订单列表"
			:loading="loading"
			:columns="headers"
			:list="list"
			:total="total"
			:pageNum.sync="tableParam.pageNum"
			:pageSize.sync="tableParam.pageSize"
			@agreeRefund="agreeRefund"
			@isRefuse="isRefuse"
			@getList="initData"
		></base-table>
		<el-dialog title="退款说明" :visible.sync="isReason">
			<el-form :model="refund">
				<el-form-item label="退款说明" :label-width="formLabelWidth">
					<el-input v-model="refund.denialReason"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="isReason = false" size="small">取 消</el-button>
				<el-button type="primary" @click="refuseRefund" size="small">确 定</el-button>
			</div>
		</el-dialog>
	</div>
  
</template>

<script>
import { devService } from "@/config/env";
import api from "@/api/index";
import listMixins from "@/mixins/tableList";
import baseTable from "@/components/baseTableRefund";
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
      formLabelWidth: "120px",
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
          type: "daterange",
          name: "startTime",
          label: "退款时间",
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
          key: "serviceOrderId",
          title: "订单编号"
        },
        {
          key: "refundId",
          title: "退款申请号"
        },
        {
          key: "applyRefundTime",
          title: "申请退款时间"
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
          key: "customerName",
          title: "客户姓名"
        },
        {
          key: "phoneNumber",
          title: "手机号",
          width: "100"
        },
        {
          key: "productName",
          title: "退款商品"
        },
        {
          key: "coupon",
          title: "优惠券"
        },
        {
          key: "costPrice",
          title: "应付金额"
        },
        {
          key: "payPrice",
          title: "实付金额"
        },
        {
          key: "refundStatus",
          title: "退款状态"
        },
        {
          key: "refundReason",
          title: "退款原因"
        },
        {
          key: "refundExplanation",
          title: "退款说明"
        },
        {
          key: "operator",
          title: "操作人"
        },
        {
          key: "denialReason",
          title: "拒绝原因"
        },
        {
          type: "operate",
          title: "操作",
          width: "100",
          operates: [
            {
              name: "同意",
              emitKey: "agreeRefund"
            },
            {
              name: "拒绝",
              emitKey: "isRefuse"
            }
          ]
        }
      ],
      detailsOptions: [],
      detailsData: {},
      detailsVisible: false,
      refund: {},
      isReason: false
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
      this.listSuccessCb("getRefundList");
    },
    //重置搜索表单
    resetForm() {
      for (let i = 0; i < this.queryFormList.length; i++) {
        this.queryFormList[i].value = "";
      }
    },
    // 导出数据
    exportExcel() {
      this.exportExcelCb("exportRefundExcel");
    },
    async postRefund() {
      let that = this;
      let data = {
        denialReason: that.refund.denialReason,
        refundId: that.refund.refundId,
        refundStatus: that.refund.refundStatus
      };
      let res = await api.postRefund(data);
      if (res.status == 1) {
        that.$message.success(res.msg);
        that.initData();
      } else {
        that.$message.error(res.msg);
      }
    },
    agreeRefund(row) {
      let that = this;
      that.refund.denialReason = "";
      that.refund.refundId = row.refundId;
      that.refund.refundStatus = 3;
      let title = "同意客户" + row.customerName + "的退款申请";
      that
        .$confirm(title, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          that.postRefund();
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
    isRefuse(row) {
      this.isReason = true;
      this.refund.refundId = row.refundId;
      this.refund.refundStatus = 8;
    },
    refuseRefund() {
      this.isReason = false;
      this.postRefund();
    }
  }
};
</script>

<style lang="less">
.registered-users-page {
}
</style>