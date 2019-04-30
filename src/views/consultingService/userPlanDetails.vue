<template>
  <div class="app-container user-scenario-page">
    <div class="top-btn">
      <el-button size="small" @click="gotoPage" type="primary">返回</el-button>
    </div>
    <div class="user-scenario-top" v-if="customerInfo">
      <div class="title">配置方案</div>
    </div>
    <div class="user-info" v-if="customerInfo">
      <div class="title">客户基本情况及需求</div>
      <div class="base-info">
        <div class="base-li">
          <span class="tit">姓名：</span>
          <span class="txt">{{customerInfo.linkmanName}}</span>
          <span class="tit mr30">年收入：</span>
          <span class="txt">{{customerInfo.income}}</span>
          <span class="tit mr30">预算：</span>
          <span class="txt">{{customerInfo.budget}}</span>
          <span class="tit mr30">需要方案时间：</span>
          <span class="txt">{{customerInfo.needDateDayId}}</span>
        </div>
        <div class="base-li">
          <span class="tit">备注：</span>
          <span class="txt">{{customerInfo.remark}}</span>
        </div>
      </div>
      <el-table :data="customerInfo.customerMsgList" border="" style="width: 100%">
        <el-table-column prop="customerName" label="成员"></el-table-column>
        <el-table-column prop="avatarUrl" label="头像">
          <template slot-scope="scope">
            <img width="44" :src="scope.row.avatarUrl">
          </template>
        </el-table-column>
        <el-table-column prop="gender" label="性别">
          <template slot-scope="scope">{{scope.row.gender=='1'?'男':scope.row.gender==2?'女':'未知'}}</template>
        </el-table-column>
        <el-table-column prop="birthday" label="出生日期" width="100"></el-table-column>
        <el-table-column prop="age" label="年龄"></el-table-column>
        <el-table-column prop="idNumber" label="身份证号"></el-table-column>
        <el-table-column prop="gender" label="有无社保">
          <template slot-scope="scope">{{scope.row.isSecurity=='1'?'有社保':'无社保'}}</template>
        </el-table-column>
        <el-table-column prop="health" label="健康状况"></el-table-column>
        <el-table-column prop="limit" label="需要保障/额度" width="540"></el-table-column>
      </el-table>
    </div>
    <div class="customerList">
      <div class="customerLi" v-for="(customerLi,index) in customerList" :key="index">
        <div class="customerLiTop">
          <div class="tit">{{customerLi.level}}：</div>
          <el-select
            v-model="customerLi.code"
            filterable
            allow-create
            default-first-option
            @change="selectCustomerName(customerLi)"
            placeholder="请选择客户"
          >
            <el-option
              v-for="item in customerMsgList"
              :key="item.code"
              :label="item.customerName"
              :value="item.code"
            ></el-option>
          </el-select>
          <el-button
            @click="deleteCustomerItem(customerList,index)"
            size="small"
            icon="el-icon-remove-outline"
            type="danger"
          >删除</el-button>
        </div>
        <div class="customerLiCenter">
          <div
            class="customerLiItem"
            v-for="(productItem,pIndex) in customerLi.productList"
            :key="pIndex"
          >
            <div class="customerLiTitle">
              <span class="ctit">{{productItem.name}}</span>
              <el-button
                @click="deleteProductItem(customerLi.productList,pIndex)"
                size="mini"
                icon="el-icon-remove-outline"
                type="danger"
              >删除</el-button>
            </div>
            <el-form :inline="true" size="small" :model="productItem" class="demo-form-inline">
              <el-form-item label="险种类型">
                <el-select
                  v-model="productItem.classify"
                  @change="selectClassify(productItem)"
                  filterable
                  placeholder="险种类型"
                >
                  <el-option
                    v-for="icItem in insuranceClassifies "
                    :key="icItem.value"
                    :label="icItem.label"
                    :value="icItem.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="具体产品">
                <el-select
                  v-model="productItem.productId"
                  @change="selectProductName(productItem)"
                  filterable
                  placeholder="具体产品"
                >
                  <el-option
                    v-for="ipItem in productItem.insuranceProducts "
                    :key="ipItem.productId"
                    :label="ipItem.productName"
                    :value="ipItem.productId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="productItem.planList&&productItem.planList.length>0" label="保障计划">
                <el-select v-model="productItem.plan" filterable placeholder="保障计划">
                  <el-option
                    v-for="plItem in productItem.planList"
                    :key="plItem.value"
                    :label="plItem.label"
                    :value="plItem.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="附加项"
                v-if="productItem.additionItemList && productItem.additionItemList.length>0"
              >
                <el-select
                  v-model="productItem.additional.value"
                  multiple
                  :placeholder="productItem.additional.placeholder"
                >
                  <el-option
                    v-for="llItem in productItem.additionItemList"
                    :key="llItem.value"
                    :label="llItem.label"
                    :value="llItem.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <el-form :inline="true" size="small" :model="productItem" class="demo-form-inline">
              <el-form-item label="缴费年限">
                <el-select style="width:160px" v-model="productItem.payYears" placeholder="请选择缴费年限">
                  <el-option
                    v-for="paItem in productItem.payYearsList"
                    :key="paItem.value"
                    :label="paItem.label"
                    :value="paItem.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="保障年限">
                <el-select
                  style="width:160px"
                  v-model="productItem.coverYears"
                  placeholder="请选择保障年限"
                >
                  <el-option
                    v-for="pgItem in productItem.coverYearsList"
                    :key="pgItem.value"
                    :label="pgItem.label"
                    :value="pgItem.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="保额(万元)">
                <el-select
                  style="width:160px"
                  filterable
                  allow-create
                  default-first-option
                  v-model="productItem.basicAmt"
                  placeholder="请选择保额"
                >
                  <el-option
                    v-for="iaItem in productItem.basicAmtList"
                    :key="iaItem.value"
                    :label="iaItem.label"
                    :value="iaItem.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="保费(元)">
                <el-input
                  style="width:120px"
                  placeholder="请输入保费"
                  v-model="productItem.premium"
                  clearable
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-circle-plus-outline"
                  @click="calculatePremium(productItem)"
                >计算保费</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="addProduct">
            <el-button
              type="primary"
              @click="addProduct(customerLi.productList)"
              size="small"
              icon="el-icon-circle-plus-outline"
            >添加产品</el-button>
          </div>
        </div>
      </div>
      <div class="operation" v-if="customerInfo">
        <el-button @click="addCustomer" type="primary" icon="el-icon-circle-plus-outline">添加客户</el-button>
        <el-button @click="temporaryPlan" type="warning" icon="el-icon-setting">暂存方案</el-button>
        <el-button @click="submitPlan" type="success" icon="el-icon-refresh">发送给客户</el-button>
      </div>
    </div>
    <el-dialog title="方案二维码" :visible.sync="qrcodeDialog">
      <div class="qrcode">
        <img :src="qrcodeUrl" alt="方案二维码">
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/index";
export default {
  name: "userPlanDetails",
  components: {},
  data() {
    return {
      orderId: "",
      customerInfo: null,
      cities: [],
      customerTemp: {
        level: "客户1",
        code: "", //数组
        productList: []
      },
      productTmp: {
        name: "产品1",
        classify: "",
        productId: "",
        //具体产品
        insuranceProducts: [],
        plan: "",
        planList: [],
        additional: {
          placeholder: "请选择附加项",
          value: []
        },
        additionalItems: [],
        payYears: "",
        payYearsList: [], //缴费年限
        coverYears: "",
        coverYearsList: [], //保障年限
        basicAmt: "",
        basicAmtList: [], //保额
        premium: ""
      },
      customerList: [],
      //险种分类
      insuranceClassifies: [
        {
          value: 100,
          label: "医疗险"
        },
        {
          value: 101,
          label: "重疾险"
        },
        {
          value: 201,
          label: "年金险"
        },
        {
          value: 301,
          label: "人寿险"
        },
        {
          value: 401,
          label: "意外险"
        }
      ],
      areaId: "",
      areaName: null,
      customerMsgList: [],
      qrcodeDialog: false,
      qrcodeUrl: null
    };
  },
  created() {
    this.initData();
  },
  methods: {
    // 初始化数据
    async initData() {
      let orderId = this.$route.query.orderId || "";
      if (orderId == "") {
        this.$message({
          type: "error",
          message: "订单id不存在",
          center: true
        });
        return false;
      }
      this.orderId = orderId;
      //通过订单id获取客户信息
      let customerResult = await api.getCustomerInfoByOrderId({
        orderId: this.orderId
      });
      if (customerResult.data) {
        this.customerInfo = customerResult.data;
        this.customerMsgList = customerResult.data.customerMsgList;
        this.areaId = customerResult.data.areaId;
      } else {
        this.$message({
          type: "error",
          message: "请先填写客户需求",
          center: true
        });
        return false;
      }
      //根据订单Id查询原始方案
      let customerPlanResult = await api.getCustomerPlan({
        orderId: this.orderId
      });
      if (customerPlanResult.data) {
        let customerPlanInfo = customerPlanResult.data;
        this.areaId = customerPlanInfo.areaId;
        this.areaName = customerPlanInfo.areaName;
        let planForCustomerList = customerPlanInfo.planForCustomerList;
        let customerList = [];
        for (var i = 0; i < planForCustomerList.length; i++) {
          let customerTemp = this._.cloneDeep(this.customerTemp);
          customerTemp.code = planForCustomerList[i].code;
          let levelSize = parseInt(i) + 1;
          customerTemp.level = "客户" + levelSize;
          customerTemp.productList = [];
          for (
            var j = 0;
            j < planForCustomerList[i].customerProductList.length;
            j++
          ) {
            let productInfo = planForCustomerList[i].customerProductList[j];
            let productTmp = this._.cloneDeep(this.productTmp);
            let nameSize = parseInt(j) + 1;
            productTmp.name = "产品" + nameSize;
            productTmp.classify = productInfo.productLabel;
            await this.selectClassify(productTmp);
            productTmp.productId = productInfo.productId;
            await this.selectProductName(productTmp);
            productTmp.basicAmt = productInfo.basicAmt;
            productTmp.payYears = productInfo.payYears;
            productTmp.plan = productInfo.plan;
            productTmp.premium = productInfo.premium;
            productTmp.coverYears = productInfo.coverYears;
            productTmp.additional.value = productInfo.additionItemList;
            productTmp.productUrl = productInfo.productUrl;
            customerTemp.productList.push(productTmp);
          }
          customerList.push(customerTemp);
        }
        this.customerList = customerList;
      } else {
        let productTmp = this._.cloneDeep(this.productTmp);
        this.customerTemp.productList.push(productTmp);
        this.customerList.push(this.customerTemp);
      }
    },
    async selectClassify(productItem) {
      //选取地理位置和险种分类获取产品
      let planResult = await api.getPlanProductList({
        areaId: this.areaId,
        productType: productItem.classify
      });
      if (planResult.data) {
        productItem.productId = "";
        productItem.insuranceProducts = [];
        productItem.plan = "";
        productItem.planList = [];
        productItem.additional = {
          placeholder: "请选择附加项",
          value: []
        };
        productItem.additionalItems = [];
        productItem.payYears = "";
        productItem.payYearsList = []; //缴费年限
        productItem.coverYears = "";
        productItem.coverYearsList = []; //保障年限
        productItem.basicAmt = "";
        productItem.basicAmtList = []; //保额
        productItem.premium = "";
        productItem.insuranceProducts = planResult.data;
      }
    },
    addCustomer() {
      //添加客户
      let levelSize = parseInt(this.customerList.length) + 1;
      var obj = {
        level: "客户" + levelSize,
        code: "", //数组
        productList: [
          {
            name: "产品1",
            classify: "",
            productId: "",
            //具体产品
            insuranceProducts: [],
            plan: "",
            planList: [],
            additional: {
              label: "附加项",
              placeholder: "请选择附加项",
              value: []
            },
            additionItemList: [],
            payYears: "",
            payYearsList: [], //缴费年限
            coverYears: "",
            coverYearsList: [], //保障年限
            basicAmt: "",
            basicAmtList: [], //保额
            premium: ""
          }
        ]
      };
      this.customerList.push(obj);
    },
    deleteCustomerItem(customerList, index) {
      //删除客户
      customerList.splice(index, 1);
    },
    //选中产品
    selectProductName(productItem) {
      productItem.plan = "";
      productItem.planList = [];
      productItem.additional = {
        placeholder: "请选择附加项",
        value: []
      };
      productItem.additionalItems = [];
      productItem.payYears = "";
      productItem.payYearsList = []; //缴费年限
      productItem.coverYears = "";
      productItem.coverYearsList = []; //保障年限
      productItem.basicAmt = "";
      productItem.basicAmtList = []; //保额
      productItem.premium = "";
      let productId = productItem.productId;
      let products = productItem.insuranceProducts;
      for (let i = 0; i < products.length; i++) {
        if (products[i].productId == productId) {
          productItem.planList = products[i].planList;
          productItem.additionItemList = products[i].additionItemList;
          productItem.payYearsList = products[i].payYearsList;
          productItem.coverYearsList = products[i].coverYearsList;
          productItem.basicAmtList = products[i].basicAmtList;
        }
      }
      let planList = productItem.planList;
      if (planList) {
        let newPlanList = [];
        for (let i = 0; i < planList.length; i++) {
          newPlanList.push({
            value: planList[i],
            label: planList[i]
          });
        }
        productItem.planList = newPlanList;
      }

      let payYearsList = productItem.payYearsList;
      if (payYearsList) {
        let newPayYearsList = [];
        for (let i = 0; i < payYearsList.length; i++) {
          newPayYearsList.push({
            value: payYearsList[i],
            label: payYearsList[i]
          });
        }
        productItem.payYearsList = newPayYearsList;
      }

      let additionItemList = productItem.additionItemList;
      if (additionItemList) {
        let newAdditionItemList = [];
        for (let i = 0; i < additionItemList.length; i++) {
          newAdditionItemList.push({
            value: additionItemList[i],
            label: additionItemList[i]
          });
        }
        productItem.additionItemList = newAdditionItemList;
      }

      let coverYearsList = productItem.coverYearsList;
      if (coverYearsList) {
        let newCoverYearsList = [];
        for (let i = 0; i < coverYearsList.length; i++) {
          newCoverYearsList.push({
            value: coverYearsList[i],
            label: coverYearsList[i]
          });
        }
        productItem.coverYearsList = newCoverYearsList;
      }
      let basicAmtList = productItem.basicAmtList;
      if (basicAmtList) {
        let newBasicAmtList = [];
        for (let i = 0; i < basicAmtList.length; i++) {
          newBasicAmtList.push({
            value: basicAmtList[i],
            label: basicAmtList[i]
          });
        }
        productItem.basicAmtList = newBasicAmtList;
      }
    },
    addProduct(productList) {
      //添加产品
      let nameSize = parseInt(productList.length) + 1;
      let obj = {
        name: "产品" + nameSize,
        classify: "",
        productId: "",
        //具体产品
        insuranceProducts: [],
        plan: "",
        planList: [],
        additional: {
          label: "附加项",
          placeholder: "请选择附加项",
          value: []
        },
        additionalItems: [],
        payYears: "",
        payYearsList: [], //缴费年限
        coverYears: "",
        coverYearsList: [], //保障年限
        basicAmt: "",
        basicAmtList: [], //保额
        premium: ""
      };
      productList.push(obj);
    },
    deleteProductItem(productList, index) {
      //删除产品
      productList.splice(index, 1);
    },
    async calculatePremium(item) {
      //计算保费
      let result = await api.getProductUrl({
        kbaoUserId: this.customerInfo.kbaoUserId,
        productId: item.productId
      });
      if (result.status == 1) {
        if (result.data) {
          window.open(result.data.id);
        }
      } else {
        this.$message({
          type: "error",
          message: result.msg,
          center: true
        });
      }
    },
    //选择客户
    selectCustomerName(customerLi) {
      let code = customerLi.code.toString();
      let customerStatus = true;
      let customerMsgList = this.customerMsgList;
      for (var i = 0; i < customerMsgList.length; i++) {
        if (customerMsgList[i].code == code) {
          customerStatus = false;
          customerLi.customerName = customerMsgList[i].customerName;
        }
      }
      if (customerStatus) {
        customerLi.customerName = code;
      }
    },
    async temporaryPlan() {
      let customerList = this.customerList;
      let planForCustomerList = [];
      for (var i = 0; i < customerList.length; i++) {
        let obj = {
          code: customerList[i].code,
          customerName: customerList[i].customerName,
          customerProductList: []
        };
        for (var j = 0; j < customerList[i].productList.length; j++) {
          obj.customerProductList.push({
            productId: customerList[i].productList[j].productId,
            plan: customerList[i].productList[j].plan,
            additionItemList: customerList[i].productList[j].additional.value,
            basicAmt: customerList[i].productList[j].basicAmt,
            premium: customerList[i].productList[j].premium,
            payYears: customerList[i].productList[j].payYears,
            coverYears: customerList[i].productList[j].coverYears
          });
        }
        planForCustomerList.push(obj);
      }
      let obj = {
        serviceOrderId: this.orderId,
        planForCustomerList: planForCustomerList
      };
      let result = await api.saveCustomerPlan(obj);
      if (result.status == 1) {
        this.$message({
          type: "success",
          message: "暂存方案成功",
          center: true
        });
      } else {
        this.$message({
          type: "error",
          message: "暂存方案失败",
          center: true
        });
      }
    },
    async submitPlan() {
      let result = await api.updateCustomerPlan({
        id: this.orderId
      });
      if (result.status == 1) {
        this.$message({
          type: "success",
          message: "发送方案成功",
          center: true
        });
        let qrcodeResult = await api.createQrcode({
          orderId: this.orderId
        });
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
      } else {
        this.$message({
          type: "error",
          message: result.msg,
          center: true
        });
      }
    },
    gotoPage() {
      this.$router.back(-1);
    }
  }
};
</script>

<style lang="less">
.user-scenario-page {
  font-size: 14px;
  .top-btn {
    margin-bottom: 20px;
  }
  .user-scenario-top {
    .title {
      font-size: 20px;
      font-weight: bold;
      padding-bottom: 20px;
      border-bottom: 1px #ddd solid;
    }
  }
  .user-info {
    .title {
      font-size: 18px;
      color: #333;
      padding: 10px;
      font-weight: bold;
    }
    .base-info {
      margin-bottom: 20px;
    }
    .base-li {
      border-top: 1px #ddd solid;

      .tit {
        color: #606266;
      }
      .txt {
        color: #909399;
      }
      .mr30 {
        margin-left: 10%;
        border-left: 1px #ddd solid;
      }
      span {
        display: inline-block;
        padding: 10px;
      }
    }
  }
  .insuredArea {
    margin: 10px;
  }
  .customerLi {
    margin: 10px 10px 30px 10px;
    border: 1px #ddd solid;
    padding: 20px;
    background: #eee;
    .tit {
      display: inline-block;
    }
    .customerLiTop {
      padding-bottom: 10px;
      border-bottom: 1px #ddd solid;
      button {
        float: right;
        margin: 6px;
      }
    }
    .customerLiTitle {
      padding: 5px;
      border-bottom: 1px #ddd solid;
      margin-bottom: 20px;
      background: #ddd;
      overflow: hidden;
      .ctit {
        float: left;
        margin: 7px 0 0 10px;
      }
      button {
        float: right;
      }
    }
    .addProduct {
      margin-top: 20px;
      text-align: center;
    }
  }
  .operation {
    margin-top: 20px;
    text-align: center;
  }
  .qrcode {
    text-align: center;
  }
}
</style>