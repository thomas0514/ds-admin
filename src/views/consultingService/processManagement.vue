<template>
  <div class="app-container process-management-page" ref="wrap">
    <div class="management-top">
      <el-button size="small" @click="gotoPage" type="primary">返回</el-button>
      <el-button
        class="ml20"
        size="small"
        @click="callConsulting"
        icon="el-icon-phone-outline"
        type="primary"
        plain
      >拨打电话</el-button>
    </div>
    <div class="process-top">
      <div class="title">快捷入口</div>
      <div class="list">
        <div class="list-li">
          <p>
            客户目前所处阶段：
            <i>{{serviceOrderSubText}}</i>
          </p>
          <p class="btn">
            <el-button @click="gotoPosition" size="small" type="primary">查看</el-button>
          </p>
        </div>
        <div class="list-li">
          <p>
            咨询需求问卷：
            <i>{{question==1?'已填写':'未填写'}}</i>
          </p>
          <p class="btn">
            <el-button
              v-if="question==1"
              @click="gotoDemandQuestionnaire"
              size="small"
              type="primary"
            >查看</el-button>
          </p>
        </div>
        <div class="list-li">
          <p>
            下次沟通时间：
            <i>{{communicateTime?communicateTime:'无'}}</i>
          </p>
          <p class="btn">
            <el-button size="small" @click="changeProcessDialog" type="primary">查看</el-button>
          </p>
        </div>
        <div class="list-li bn">
          <p>
            方案需求表：
            <i>{{requirSheet==1?'已填写':'未填写'}}</i>
          </p>
          <p class="btn">
            <el-button
              @click="gotoEnterCustomer"
              size="small"
              type="primary"
              v-if="requireButton==1"
            >{{requirSheet==1?'查看':'填写'}}</el-button>
          </p>
        </div>
      </div>
      <el-dialog title="进度" :visible.sync="processDialogStatus">
        <div class="processList">
          <ul>
            <li v-for="(p,index) in processList" :key="index" v-html="p"></li>
          </ul>
        </div>
      </el-dialog>
    </div>
    <div class="process-center">
      <div class="title">订单阶段</div>
      <div class="process-step" id="processStep" ref="processStep">
        <div class="process-line" id="processLine" ref="processLine">
          <div class="process-bar" id="processBar" ref="processBar"></div>
        </div>
        <div
          class="process-li"
          :id="'processli'+index"
          v-for="(item,index) in allProcessList"
          :key="index"
        >
          <div class="icon" :class="item.processStatus==4?'wc':''">
            <span></span>
          </div>
          <div class="tit">
            <b>「 {{item.processName}} 」</b>
            {{item.tips}}
          </div>
          <div class="list">
            <ul>
              <li v-for="(liitem,liindex) in item.historyRemarks" :key="liindex" v-html="liitem"></li>
            </ul>
          </div>
          <div
            class="zx-record mt20"
            v-for="(zxitem,zindex) in item.processButtons"
            :key="zindex"
            v-if="zxitem.url==701"
          >
            <div class="textarea-bd">
              <span class="tit">情况记录</span>
              <el-input
                class="list-bd"
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="如需记录客户的情况，可记录在此"
                v-model="note"
              ></el-input>
              <div class="textarea-btn">
                <el-button size="small" @click="saveRecord" type="success">保存</el-button>
              </div>
            </div>
          </div>
          <div class="btns mt20">
            <span
              class="mr20"
              v-if="btnitem.url!='701'"
              v-for="(btnitem,btnindex) in item.processButtons"
              :key="btnindex"
            >
              {{btnitem.text}}
              <el-button
                size="small"
                @click="btnChange(btnitem.url)"
                :type="btnitem.url=='506'||btnitem.url=='702'?'success':'primary'"
              >{{btnitem.name}}</el-button>
            </span>
          </div>
        </div>
      </div>
    </div>
    <div class="processInsurce">
      <div class="title">客户投保</div>
      <div class="text">添加此客户到投保需求表里
        <el-button size="small" @click="changeDialogTableVisible" type="primary">添加</el-button>
      </div>
    </div>
    <el-dialog title="添加投保需求" :visible.sync="dialogTableVisible">
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
    <el-dialog
      :title="appointmentTimeText"
      width="640px"
      :visible.sync="appointmentTimeTableVisible"
    >
      <div class="appoint-top" v-if="customerLevel">
        <span>{{customerLevel}}</span>
        <span>
          当前预约时间：
          <em>{{customerTime}}</em>
        </span>
      </div>
      <div class="date">
        <span>日</span>
        <span>一</span>
        <span>二</span>
        <span>三</span>
        <span>四</span>
        <span>五</span>
        <span>六</span>
        <span
          v-for="(p,index) in date"
          :class="p.dayStatus==4?p.dayId==currentDate?'active':'':'disabled'"
          :key="index"
          @click="getCustomerWorkDay(p)"
        >{{p.msg?p.msg:p.day}}</span>
      </div>
      <div class="worktime" v-if="workTime.length>0">
        <span
          :class="p.select?p.workTimeId==workTimeId?'active':'':'disabled' "
          @click="selectWorkTime(p)"
          v-for="(p,index) in workTime"
          :key="index"
        >{{p.msg}}</span>
      </div>
      <div class="opt">
        <el-button @click="submitExpertInfo" type="success">提交</el-button>
        <el-button @click="changeAppointmentTimeTableVisible" type="info">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/index";
import { parseTime } from "@/utils";
export default {
  name: "processManagement",
  mixins: [],
  components: {},
  data() {
    return {
      dialogTableVisible: false,
      serviceOrderId: "",
      value1: "",
      serviceOrderSubText: "",
      requireButton: 0,
      question: "",
      requirSheet: "",
      communicateTime: "",
      processDialogStatus: false,
      processList: [],
      form: {
        serviceOrderId: "",
        insureDate: "",
        kind: "",
        remark: ""
      },
      allProcessList: [],
      processActive: 0,
      appointmentTimeTableVisible: false,
      currentDate: "",
      appointmentTimeText: "客户预约时间",
      date: [],
      workTime: [],
      workTimeId: "",
      customerLevel: "",
      customerTime: "",
      btnStatus: "", //操作类型
      note: "" //情况记录
    };
  },
  async created() {
    this.serviceOrderId = this.$route.query.id;
    await this.initData();
  },
  mounted() {
    var height = this.$refs.processStep.offsetHeight;
    // this.$refs.processLine.style.height = height + "px";
    let processActive = this.processActive;
    // var offsetTop = this.$refs[""].offsetTop;
    // console.log(offsetTop);
    // this.$refs.processBar.style.height = offsetTop + "px";
  },
  methods: {
    // 初始化数据
    async initData() {
      let processMangerResult = await api.getProcessManger({
        serviceOrderId: this.serviceOrderId
      });
      if (processMangerResult.status == 1) {
        if (processMangerResult.data) {
          this.communicateTime = processMangerResult.data.communicateTime;
          this.question = processMangerResult.data.question;
          this.requirSheet = processMangerResult.data.requirSheet;
          this.requireButton = processMangerResult.data.requireButton;
          this.serviceOrderSubText =
            processMangerResult.data.serviceOrderSubText;
        }
      } else {
        this.$message({
          type: "error",
          message: processMangerResult.msg,
          center: true
        });
      }
      this.getAllProcess();
    },
    async getAllProcess() {
      let processReuslt = await api.getAllProcess({
        serviceOrderId: this.serviceOrderId
      });
      if (processReuslt.status == 1) {
        if (processReuslt.data) {
          this.allProcessList = processReuslt.data;
          let allProcessList = this.allProcessList;
          for (let i = 0; i < allProcessList.length; i++) {
            if (allProcessList[i].processStatus == 1) {
              this.processActive = i;
            }
          }
        }
      } else {
        this.$message({
          type: "error",
          message: processReuslt.msg,
          center: true
        });
      }
    },
    async getProcessTime() {
      let processTimeResult = await api.getProcessTime({
        serviceOrderId: this.serviceOrderId
      });
      if (processTimeResult.status == 1) {
        if (processTimeResult.data) {
          this.processList = processTimeResult.data;
        }
      }
    },
    gotoDemandQuestionnaire() {
      this.$router.push({
        path: "demandQuestionnaire",
        query: {
          id: this.serviceOrderId
        }
      });
    },
    async getAppointmentWorkDayInfo() {
      this.changeAppointmentTimeTableVisible();
      let result = await api.getAppointmentWorkday({
        serviceOrderId: this.serviceOrderId
      });
      if (result.status == 1) {
        if (result.data) {
          this.date = result.data;
        }
      } else {
        this.$message({
          type: "error",
          message: result.msg,
          center: true
        });
      }
    },
    async getExpertWorkDayInfo() {
      this.changeAppointmentTimeTableVisible();
      let result = await api.getExpertWorkDayInfo({
        serviceOrderId: this.serviceOrderId
      });
      if (result.status == 1) {
        if (result.data) {
          this.customerLevel = result.data.customerLevel;
          this.customerTime = result.data.time;
        }
      } else {
        this.$message({
          type: "error",
          message: result.msg,
          center: true
        });
      }
      let expertWorkDayResult = await api.getExpertWorkday({
        serviceOrderId: this.serviceOrderId
      });
      if (expertWorkDayResult.status == 1) {
        if (expertWorkDayResult.data) {
          this.date = expertWorkDayResult.data;
        }
      } else {
        this.$message({
          type: "error",
          message: expertWorkDayResult.msg,
          center: true
        });
      }
    },
    async updateCustomerPlan() {
      let result = await api.updateCustomerPlan({
        id: this.serviceOrderId
      });
      if (result.status == 1) {
        this.$message({
          type: "success",
          message: "发送方案成功",
          center: true
        });
      } else {
        this.$message({
          type: "success",
          message: result.msg,
          center: true
        });
      }
    },
    async btnChange(type) {
      //201 查看咨询需求问卷
      this.btnStatus = type;
      if (type == "201") {
        this.$router.push({
          path: "demandQuestionnaire",
          query: {
            id: this.serviceOrderId
          }
        });
      } else if (type == "202") {
        //202 初次设置沟通时间
        if (!this.PermissionAuth("process", "put")) {
          this.$message({
            type: "error",
            message: "该操作没有权限",
            center: true
          });
          return false;
        }
        await this.getAppointmentWorkDayInfo();
      } else if (type == "401") {
        //401 修改沟通时间
        if (!this.PermissionAuth("process", "put")) {
          this.$message({
            type: "error",
            message: "该操作没有权限",
            center: true
          });
          return false;
        }
        await this.getAppointmentWorkDayInfo();
      } else if (type == "402") {
        //402 方案需求填写
        this.$router.push({
          path: "enterCustomer",
          query: {
            id: this.serviceOrderId,
            pageStatus: "process"
          }
        });
      } else if (type == "403") {
        //403 讲解方案时间，专家预约时间
        if (!this.PermissionAuth("process", "put")) {
          this.$message({
            type: "error",
            message: "该操作没有权限",
            center: true
          });
          return false;
        }
        await this.getExpertWorkDayInfo();
      } else if (type == "501") {
        //501 创建方案
        this.$router.push({
          path: "userPlanDetails",
          query: {
            orderId: this.serviceOrderId
          }
        });
      } else if (type == "502") {
        //502 查看方案
        this.$router.push({
          path: "userPlanDetails",
          query: {
            orderId: this.serviceOrderId
          }
        });
      } else if (type == "503") {
        //503发送方案
        if (!this.PermissionAuth("process", "put")) {
          this.$message({
            type: "error",
            message: "该操作没有权限",
            center: true
          });
          return false;
        }
        await this.updateCustomerPlan();
        await this.getAllProcess();
      } else if (type == "504") {
        //504 修改专家预约时间
        if (!this.PermissionAuth("process", "put")) {
          this.$message({
            type: "error",
            message: "该操作没有权限",
            center: true
          });
          return false;
        }
        await this.getExpertWorkDayInfo();
      } else if (type == "505") {
        //505 修改方案，调接口
        if (!this.PermissionAuth("process", "put")) {
          this.$message({
            type: "error",
            message: "该操作没有权限",
            center: true
          });
          return false;
        }
        this.updatePlanStatus();
      } else if (type == "506") {
        //506 方案满意
        if (!this.PermissionAuth("process", "put")) {
          this.$message({
            type: "error",
            message: "该操作没有权限",
            center: true
          });
          return false;
        }
        await this.planSatisfied();
        await this.getAllProcess();
      } else if (type == "702") {
        //701 回访完成
        if (!this.PermissionAuth("process", "put")) {
          this.$message({
            type: "error",
            message: "该操作没有权限",
            center: true
          });
          return false;
        }
        this.completeVisit();
        await this.getAllProcess();
      } else if (type == "701") {
        //702 情况记录
      }
    },
    async updatePlanStatus() {
      let result = await api.updatePlanStatus({
        id: this.serviceOrderId
      });
      if (result.status == 1) {
        this.$router.push({
          path: "userPlanDetails",
          query: {
            orderId: this.serviceOrderId
          }
        });
        await this.getAllProcess();
      } else {
        this.$message({
          type: "error",
          message: result.msg,
          center: true
        });
      }
    },
    async planSatisfied() {
      let result = await api.planSatisfied({
        id: this.serviceOrderId
      });
      if (result.status == 1) {
        this.$message({
          type: "success",
          message: "提交成功",
          center: true
        });
        await this.getAllProcess();
      } else {
        this.$message({
          type: "error",
          message: result.msg,
          center: true
        });
      }
    },
    async completeVisit() {
      let result = await api.completeVisit({
        id: this.serviceOrderId
      });
      if (result.status == 1) {
        this.$message({
          type: "success",
          message: "提交成功",
          center: true
        });
        await this.getAllProcess();
      } else {
        this.$message({
          type: "error",
          message: result.msg,
          center: true
        });
      }
    },
    gotoPosition() {
      window.scrollTo(0, document.documentElement.clientHeight);
    },
    changeProcessDialog() {
      this.processDialogStatus = !this.processDialogStatus;
      this.getProcessTime();
    },
    gotoEnterCustomer() {
      if (!this.PermissionAuth("process", "put")) {
        this.$message({
          type: "error",
          message: "该操作没有权限",
          center: true
        });
        return false;
      }
      let query = {
        id: this.serviceOrderId
      };
      if (this.requirSheet == 1) {
        query.pageStatus = "edit";
      }
      this.$router.push({
        path: "enterCustomer",
        query: query
      });
    },
    gotoPage() {
      this.$router.back(-1);
    },
    async changeDialogTableVisible() {
      this.dialogTableVisible = !this.dialogTableVisible;
      let result = await api.getInsureOne({
        serviceOrderId: this.serviceOrderId
      });
      if (result.status == 1) {
        if (result.data) {
          this.form = result.data;
        }
      }
    },
    changeAppointmentTimeTableVisible() {
      this.workTimeId = "";
      this.currentDate = "";
      this.workTime = [];
      this.appointmentTimeTableVisible = !this.appointmentTimeTableVisible;
    },
    async getCustomerWorkDay(item) {
      //预约 选择时间
      this.workTimeId = "";
      if (item.dayStatus == 4) {
        this.currentDate = item.dayId;
        let obj = {
          dayId: item.dayId,
          serviceOrderId: this.serviceOrderId
        };
        let result;
        let btnStatus = this.btnStatus;
        if (btnStatus == "202" || btnStatus == "401") {
          result = await api.getAppointmentWorkTime(obj);
        } else {
          result = await api.getExpertWorkTime(obj);
        }
        if (result.status == 1) {
          if (result.data) {
            this.workTime = result.data;
          }
        } else {
          this.$message({
            type: "error",
            message: result.msg,
            center: true
          });
        }
      }
    },
    selectWorkTime(item) {
      if (item.select) {
        this.workTimeId = item.workTimeId;
      }
    },
    async submitExpertInfo() {
      if (this.currentDate == "") {
        this.$message({
          type: "error",
          message: "请选择日期",
          center: true
        });
        return false;
      } else if (this.workTimeId == "") {
        this.$message({
          type: "error",
          message: "请选择时间段",
          center: true
        });
        return false;
      }
      var obj = {
        dayId: this.currentDate,
        serviceOrderId: this.serviceOrderId,
        workTimeId: this.workTimeId
      };
      let btnStatus = this.btnStatus;
      let result;
      if (btnStatus == "202") {
        //202 初次设置沟通时间
        result = await api.addAppointmentWorkDay(obj);
      } else if (btnStatus == "401") {
        //401 修改沟通时间
        result = await api.editAppointmentWorkDay(obj);
      } else if (btnStatus == "403") {
        //403 讲解方案时间，专家预约时间
        result = await api.addExpertWorkDay(obj);
      } else if (btnStatus == "504") {
        //504 修改专家预约时间
        result = await api.editExpertWorkDay(obj);
      }
      if (result.status == 1) {
        this.changeAppointmentTimeTableVisible();
        this.$message({
          type: "success",
          message: "提交成功",
          center: true
        });
        await this.getAllProcess();
      } else {
        this.$message({
          type: "error",
          message: result.msg,
          center: true
        });
      }
    },
    async saveRecord() {
      if (!this.PermissionAuth("process", "put")) {
        this.$message({
          type: "error",
          message: "该操作没有权限",
          center: true
        });
        return false;
      }
      if (this.note == "") {
        this.$message({
          type: "error",
          message: "请输入内容",
          center: true
        });
        return false;
      }
      let result = await api.processRecord({
        id: this.serviceOrderId,
        note: this.note
      });
      if (result.status == 1) {
        this.note = "";
        await this.getAllProcess();
        this.$message({
          type: "success",
          message: "提交成功",
          center: true
        });
      } else {
        this.$message({
          type: "error",
          message: result.msg,
          center: true
        });
      }
    },
    //客户投保
    async submit() {
      this.form.serviceOrderId = this.serviceOrderId;
      if (this.form.insureDate) {
        this.form.insureDate = parseTime(this.form.insureDate);
      }
      let result = await api.changeInsuranceDemand(this.form);
      if (result.status == 1) {
        this.dialogTableVisible = false;
        this.$message({
          type: "success",
          message: "提交成功",
          center: true
        });
      } else {
        this.$message({
          type: "error",
          message: result.msg,
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
    },
    async callConsulting() {
      let result = await api.callConsulting({
        id: this.serviceOrderId
      });
      if (result.status == 1) {
        this.$message({
          type: "success",
          message: "拨打成功",
          center: true
        });
      } else {
        this.$message({
          type: "error",
          message: result.msg,
          center: true
        });
      }
    }
  }
};
</script>

<style lang="less">
.process-management-page {
  .management-top {
    .ml20 {
      margin-left: 50px;
    }
  }
  .title {
    font-size: 18px;
    font-weight: bold;
    margin: 15px auto;
  }
  .process-top {
    .list {
      overflow: hidden;
      .list-li {
        width: 25%;
        float: left;
        text-align: center;
        font-size: 14px;
        border-right: 1px #dcdfe6 solid;
        i {
          font-style: normal;
          color: #66ccff;
        }
      }
      .bn {
        border-right: none;
      }
      .btn {
        text-align: center;
      }
    }
  }
  .process-center {
    margin-top: 20px;
    border-top: 1px #dcdfe6 solid;
    font-size: 14px;
  }
  .zx-time {
    span {
      border: 1px #dcdfe6 solid;
      padding: 8px;
      margin-left: 15px;
    }
  }
  .btns {
    margin-left: 20px;
    .el-button {
      margin-left: 20px;
    }
  }
  .textarea-bd {
    position: relative;
    padding-left: 80px;
    width: 380px;
    .tit {
      position: absolute;
      left: 0;
      top: 0;
    }
    .list-bd {
      width: 300px;
    }
    .textarea-btn {
      margin-top: 15px;
      text-align: right;
    }
  }
  .mt20 {
    margin-top: 20px;
  }
  .mr20 {
    margin-right: 20px;
  }
  .process-step {
    position: relative;
    padding-left: 30px;
  }
  .process-line {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 5px;
    background-color: #ccc;
  }
  .process-bar {
    background-color: #ccc;
    height: 100%;
    width: 5px;
  }
  .process-li {
    position: relative;
    .icon {
      width: 20px;
      height: 20px;
      background: #00f;
      border-radius: 50%;
      position: absolute;
      left: -38px;
      top: 0;
    }
    .wc {
      background: #666;
    }
    .tit {
      b {
        font-size: 16px;
      }
    }
    .list {
      li {
        margin-top: 10px;
        color: #97a8be;
        i {
          color: #66ccff;
          font-style: normal;
        }
      }
      p {
        display: block;
        color: #000;
        margin-top: 20px;
        span {
          border: 1px #dcdfe6 solid;
          padding: 8px;
          margin-left: 15px;
        }
      }
    }
    .btns {
      margin-bottom: 20px;
    }
  }
  .processList {
    max-height: 400px;
    overflow: auto;
    li {
      font-size: 14px;
      margin-bottom: 15px;
      border-bottom: 1px dashed #97a8be;
      padding-bottom: 15px;
      list-style: none;
      color: #666;
    }
  }
  .processInsurce {
    border-top: 1px #dcdfe6 solid;
    font-size: 14px;
  }
  .opt {
    text-align: center;
  }
  .el-dialog__body {
    padding: 10px;
  }
  .date {
    border: 1px #dcdfe6 solid;
    width: 300px;
    box-sizing: border-box;
    border-right: none;
    border-bottom: none;
    margin: 0 auto;
    max-height: 201px;
    overflow: auto;
    span {
      float: left;
      height: 40px;
      width: 14.285%;
      text-align: center;
      line-height: 40px;
      box-sizing: border-box;
      border-right: 1px #dcdfe6 solid;
      border-bottom: 1px #dcdfe6 solid;
    }
    .disabled {
      color: #ccc;
    }
    .active {
      background-color: #409eff;
      color: #fff;
    }
  }
  .worktime {
    border: 1px #dcdfe6 solid;
    overflow: hidden;
    width: 541px;
    margin: 30px auto;
    border-right: none;
    span {
      float: left;
      font-size: 14px;
      width: 90px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-right: 1px #dcdfe6 solid;
    }
    .active {
      background-color: #409eff;
      color: #fff;
    }
    .disabled {
      color: #ccc;
      background-image: url("../../assets/images/res_full.png");
      background-repeat: no-repeat;
      background-position: top right;
    }
  }
  .opt {
    margin-top: 30px;
  }
  .appoint-top {
    font-size: 14px;
    color: #000;
    border-bottom: 1px #dcdfe6 dashed;
    padding-bottom: 20px;
    text-align: center;
    margin: 0 auto 30px;
    span {
      margin-right: 50px;
      em {
        border: 1px #dcdfe6 solid;
        font-style: normal;
        padding: 5px 8px;
      }
    }
  }
  .zx-record {
    margin-left: 20px;
    margin-bottom: 20px;
  }
}
</style>