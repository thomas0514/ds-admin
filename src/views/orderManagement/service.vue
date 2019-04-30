<template>
  <div class="app-container registered-users-page">
    <toolbar :toolButtons="toolButtons" @queryBtn="queryBtn" @exportExcel="exportExcel"></toolbar>
    <queryConditions
      :dialogFormVisible.sync="dialogFormVisible"
      :queryFormList.sync="queryFormList"
      :queryParams="queryParams"
      @search="initData"
      @resetForm="resetForm"
    ></queryConditions>
    <base-table
      tableTitle="咨询服务订单列表"
      :loading="loading"
      :columns="headers"
      :list="list"
      :total="total"
      :pageNum.sync="tableParam.pageNum"
      :pageSize.sync="tableParam.pageSize"
      @detailsClick="detailsClick"
      @isCounselors="isCounselors"
      @isDelays="isDelays"
      @viewRecords="viewRecords"
      @getList="initData"
    ></base-table>
    <el-dialog title="延期" :visible.sync="isDelay">
      <el-form :model="delay">
        <el-form-item label="延期天数" :label-width="formLabelWidth">
          <el-input v-model="delay.days"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isDelay = false" size="small">取 消</el-button>
        <el-button type="primary" @click="delayedPeriod" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="更换专家" :visible.sync="isCounselor">
      <el-form :model="delay">
        <el-form-item label="更换专家" :label-width="formLabelWidth">
          <el-select v-model="counselor.expertId" placeholder="请选择" @change="counselorChange">
            <el-option
              v-for="item in expertList"
              :key="item.expertId"
              :label="item.expertName"
              :value="item.expertId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isCounselor = false" size="small">取 消</el-button>
        <el-button type="primary" @click="changeCounselor" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="更换记录" :visible.sync="isRecords">
      <el-table :data="recordList" style="width: 100%">
        <el-table-column width="100">
          <template slot-scope="scope">
            <div
              style="width:40px;height:40px;background:#009ed7;boreder:1px solid #fff;border-radius:50%;position:relative"
            >
              <div
                style="width:40px;height:40px;position:absolute;top:4px;left:5px;color:#fff;line-height:16px;"
              >
                {{scope.row.proMsg}}
                <br>分配
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="typeMsg" label=""></el-table-column>
        <el-table-column prop="time" label=""></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="商品详情" :visible.sync="isGoods">
      <el-table :data="goodsList" style="width: 100%" border>
        <el-table-column prop="name" label="商品名称"></el-table-column>
        <el-table-column prop="couponName" label="优惠券"></el-table-column>
        <el-table-column prop="costPrice" label="应付金额"  align="center"></el-table-column>
        <el-table-column prop="payPrice" label="实付金额"  align="center"></el-table-column>
        <el-table-column prop="statusMsg" label="状态"  align="center"></el-table-column>
        <el-table-column prop="refundExplanation" label="退款原因"></el-table-column>
        <el-table-column label="操作" width="100" align="center">
          <template slot-scope="scope">
            <el-button
              @click="isOrderRefundClick(scope.row)"
              type="text"
              size="small"
              :disabled="scope.row.serviceOrderStatus!=10"
            >退款</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="退款" :visible.sync="isOrderRefund">
      <el-form :model="orderRefundList">
        <el-form-item label="退款金额" :label-width="formLabelWidth">
          <el-input v-model="orderRefundList.payPrice" disabled></el-input>
        </el-form-item>
        <el-form-item label="退款说明" :label-width="formLabelWidth">
          <el-input v-model="orderRefundList.refundExplanation" type="textarea" :row="5"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isOrderRefund = false" size="small">取 消</el-button>
        <el-button type="primary" @click="orderRefund" size="small">确 定</el-button>
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
          name: "客户申请退款管理",
          operation: "queryBtn",
          icon: "el-icon-menu"
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
          type: "select",
          name: "grade",
          label: "商品名称",
          placeholder: "请选择商品",
          value: "",
          clearable: true,
          options: [
            {
              label: "白银版",
              value: "白银版"
            },
            {
              label: "黄金版",
              value: "黄金版"
            },
            {
              label: "钻石版",
              value: "钻石版"
            }
          ]
        },
        {
          type: "select",
          name: "adviserId",
          label: "负责顾问",
          placeholder: "请选择顾问",
          value: "",
          clearable: true,
          options: []
        },
        {
          type: "select",
          name: "expertId",
          label: "专家",
          placeholder: "请选择专家",
          value: "",
          clearable: true,
          options: []
        },
        {
          type: "select",
          name: "mainProcessCode",
          label: "服务阶段",
          placeholder: "请选择服务阶段",
          value: "",
          clearable: true,
          options: [
            {
              label: "购买服务",
              value: "100"
            },
            {
              label: "填写问卷",
              value: "200"
            },
            {
              label: "匹配专家",
              value: "300"
            },
            {
              label: "初次沟通",
              value: "400"
            },
            {
              label: "方案设计",
              value: "500"
            },
            {
              label: "完成评价",
              value: "600"
            },
            {
              label: "品质回访",
              value: "700"
            }
          ]
        },
        {
          type: "doubleinput",
          name: "startDay",
          label: "服务有效期",
          placeholder: "请输入服务有效期",
          value: "",
          options: []
        },
        {
          type: "",
          name: "endDay",
          label: "服务有效期",
          placeholder: "请输入服务有效期",
          value: "",
          options: []
        },
        {
          type: "daterange",
          name: "startTime",
          label: "付款时间",
          value: "",
          clearable: true
        },
        {
          type: "select",
          name: "sort",
          label: "排序",
          placeholder: "请选择排序",
          value: "",
          clearable: true,
          options: [
            {
              label: "付款时间倒序",
              value: "0"
            },
            {
              label: "付款时间正序",
              value: "1"
            }
          ]
        }
      ],
      headers: [
        {
          key: "serviceOrderId",
          title: "订单ID"
        },
        {
          key: "payTime",
          title: "付款时间"
        },
        {
          key: "nickName",
          title: "微信昵称"
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
          key: "adviserName",
          title: "负责顾问"
        },
        {
          key: "expertName",
          title: "负责专家"
        },
        {
          key: "aideName",
          title: "助手"
        },
        {
          type: "operate",
          key: "expertTransferRecords",
          title: "咨询师转移记录",
          width: "80",
          operates: [
            {
              name: "查看记录",
              emitKey: "viewRecords"
            }
          ]
        },
        {
          key: "mainProcessCode",
          title: "服务阶段(主流程阶段)",
          width: "90"
        },
        {
          type: "operate",
          title: "更换咨询师",
          width: "60",
          operates: [
            {
              name: "更换",
              emitKey: "isCounselors"
            }
          ]
        },
        {
          key: "effectiveTime",
          title: "服务有效期",
          width: "60"
        },
        {
          type: "operate",
          title: "延长有效期",
          width: "60",
          operates: [
            {
              name: "编辑",
              emitKey: "isDelays"
            }
          ]
        },
        {
          type: "operate",
          title: "操作",
          width: "50",
          operates: [
            {
              name: "详情",
              emitKey: "detailsClick"
            }
          ]
        }
      ],
      detailsOptions: [],
      detailsData: {},
      detailsVisible: false,
      delay: {},
      isDelay: false,
      expertList: [],
      isCounselor: false,
      counselor: {
        expertId:"",
        expertName:""
      },
      isRecords: false,
      recordList: [],
      goodsList: [],
      isGoods: false,
      isOrderRefund: false,
      orderRefundList: {}
    };
  },
  created() {
    this.initData();
    this.getHeadExperList();
    this.getAdviserList();
  },
  methods: {
    // 初始化数据
    initData(obj) {
      if (obj && obj.limit) {
        this.tableParam.pageSize = obj.limit;
      }
      this.listSuccessCb("getOrderList");
    },
    //重置搜索表单
    resetForm() {
      for (let i = 0; i < this.queryFormList.length; i++) {
        this.queryFormList[i].value = "";
        if(this.queryFormList[i].type=="doubleinput"){
          this.queryFormList[i].options=[];
        }
      }
    },
    // 详情
    detailsClick(row) {
      this.orderRefundList.serviceOrderId = row.serviceOrderId;
      for (let i = 0; i < row.serviceOrderSubList.length; i++) {
        row.serviceOrderSubList[i].statusMsg = "进行中";
        row.serviceOrderSubList[i].couponName =
          (
            row.serviceOrderSubList[i].payPrice -
            row.serviceOrderSubList[i].costPrice
          ).toFixed(2) + "元";
        if (
          row.serviceOrderSubList[i].payPrice -
            row.serviceOrderSubList[i].costPrice ==
          0
        ) {
          row.serviceOrderSubList[i].couponName = "暂无优惠券";
        }
        if (row.serviceOrderSubList[i].serviceOrderStatus == 40) {
          row.serviceOrderSubList[i].statusMsg = "退款中";
        }
        if (row.serviceOrderSubList[i].serviceOrderStatus == 42) {
          row.serviceOrderSubList[i].statusMsg = "退款拒绝";
        }
        if (row.serviceOrderSubList[i].serviceOrderStatus == 44) {
          row.serviceOrderSubList[i].statusMsg = "退款关闭";
        }
        if (row.serviceOrderSubList[i].serviceOrderStatus == 46) {
          row.serviceOrderSubList[i].statusMsg = "退款成功";
        }
        if (row.serviceOrderSubList[i].serviceOrderStatus == 50) {
          row.serviceOrderSubList[i].statusMsg = "待评价";
        }
        if (row.serviceOrderSubList[i].serviceOrderStatus == 60) {
          row.serviceOrderSubList[i].statusMsg = "已完成";
        }
      }
      this.goodsList = row.serviceOrderSubList;
      this.isGoods = true;
    },
    async getHeadExperList() {
      let queryFormList = this.queryFormList;
      let newList = [];
      let result = await api.getExpertList();
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
    async getAdviserList() {
      let queryFormList = this.queryFormList;
      let newList = [];
      let result = await api.getAdviserList();
      if (result.data) {
        let list = result.data;
        for (let i = 0; i < list.length; i++) {
          newList.push({
            label: list[i].adviserName,
            value: list[i].adviserId
          });
        }
        this.experList = newList;
      }
      for (let i = 0; i < queryFormList.length; i++) {
        if (queryFormList[i].name == "adviserId") {
          queryFormList[i].options = newList;
        }
      }
    },
    //退款订单
    queryBtn() {
      this.$router.push({
        path: "/orderManagement/refund"
      });
    },
    // 导出数据
    exportExcel() {
      this.exportExcelCb("exportServiceExcel");
    },
    async changeResumer(row) {
      let that = this;
      let data = {
        expertName: row.expertName,
        serviceOrderId: row.serviceOrderId
      };
      let res = await api.changeResumer(data);
      if (res.status == 1) {
        that.$message.success(res.msg);
        that.initData();
      } else {
        that.$message.error(res.msg);
      }
    },
    isDelays(row) {
      if(!this.PermissionAuth("service", "put")){
        this.$message.error("该操作没有权限");
        return false;
      }
      this.isDelay = true;
      this.delay.serviceOrderId = row.serviceOrderId;
    },
    async delayedPeriod() {
      let that = this;
      let data = {
        days: that.delay.days,
        serviceOrderId: that.delay.serviceOrderId
      };
      let res = await api.delayedPeriod(data);
      if (res.status == 1) {
        that.$message.success(res.msg);
        that.isDelay = false;
        that.initData();
      } else {
        that.$message.error(res.msg);
      }
    },
    isCounselors(row) {
      if(!this.PermissionAuth("service", "put")){
        this.$message.error("该操作没有权限");
        return false;
      }
      this.counselor.serviceOrderId = row.serviceOrderId;
      this.counselor.expertId = "";
      this.getServiceExpertList({serviceOrderId:row.serviceOrderId})
    },
    async changeCounselor() {
      let that = this;
      let data = {
        serviceOrderId: that.counselor.serviceOrderId,
        expertId: that.counselor.expertId,
        expertName: that.counselor.expertName
      };
      let res = await api.changeResumer(data);
      if (res.status == 1) {
        that.$message.success(res.msg);
        that.isCounselor = false;
        that.initData();
      } else {
        that.$message.error(res.msg);
      }
    },
    async getServiceExpertList(data) {
      let that = this;
      let res = await api.getServiceExpertList(data);
      if (res.status == 1) {
        if(res.data.length>0){
          that.expertList = res.data;
          that.isCounselor = true;
        }else{
          that.$message.error("无专家可选");
        }
        
      } else {
        that.$message.error(res.msg);
      }
    },
    counselorChange(val) {
      for (var i in this.expertList) {
        if (this.expertList[i].expertId == val) {
          this.counselor.expertId = this.expertList[i].expertId;
          this.counselor.expertName = this.expertList[i].expertName;
        }
      }
    },
    //记录
    viewRecords(row) {
      this.isRecords = true;
      for (let i = 0; i < row.expertTransferRecords.length; i++) {
        row.expertTransferRecords[i].proMsg = i + 1 + "次";
        if (i == 0) {
          row.expertTransferRecords[i].proMsg = "初次";
        }
        row.expertTransferRecords[i].typeMsg =
          row.expertTransferRecords[i].operator +
          "手动分配: " +
          row.expertTransferRecords[i].expertName;
        if (row.expertTransferRecords[i].type == 0) {
          row.expertTransferRecords[i].typeMsg =
            "系统完成分配: " + row.expertTransferRecords[i].expertName;
        }
      }
      this.recordList = row.expertTransferRecords;
    },
    isOrderRefundClick(row) {
      if(!this.PermissionAuth("service", "put")){
        this.$message.error("该操作没有权限");
        return false;
      }
      this.orderRefundList.refundExplanation="";
      this.isOrderRefund = true;
      this.orderRefundList.serviceProductId = row.serviceProductId;
      this.orderRefundList.payPrice = row.payPrice;
    },
    async orderRefund() {
      let that = this;
      let data = {
        serviceOrderId: that.orderRefundList.serviceOrderId,
        serviceProductId: that.orderRefundList.serviceProductId,
        refundExplanation: that.orderRefundList.refundExplanation
      };
      let res = await api.orderRefund(data);
      if (res.status == 1) {
        that.$message.success(res.msg);
        that.isOrderRefund = false;
        that.isGoods = false;
        that.initData();
      } else {
        that.$message.error(res.msg);
      }
    }
  }
};
</script>

<style lang="less">
.registered-users-page {
}
</style>