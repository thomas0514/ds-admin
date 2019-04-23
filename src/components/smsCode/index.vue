<template>
  <div class="sms-code-container">
    <el-button @click="getCode" :disabled="isDisabled" :type="type">
      <span v-show="timer">{{secondsTime + "s"}}</span>
      <span v-show="!timer">获取验证码</span>
    </el-button>
  </div>
</template>

<script>
import { getSms } from "@/api/login";

export default {
  props: {
    type: {
      type: String,
      default: "primary"
    },
    waitTime: {
      type: Number,
      default: 60
    },
    identifyCode: {
      type: String,
      default: ""
    },
    form: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isDisabled: false,
      timer: null,
      secondsTime: 60
    };
  },

  methods: {
    getCode() {
      this.timeCountdown();
      this.$emit("getCode", true);
    },
    // 倒计时
    async timeCountdown() {
      this.secondsTime = this.waitTime;
      if (!this.timer) {
        let res = await getSms({
          smsType: "login",
          userName: this.form.userName
        });
        this.isDisabled = true;
        this.timer = setInterval(() => {
          if (this.secondsTime > 0) {
            this.secondsTime--;
          } else {
            clearInterval(this.timer); //清空定时器
            this.timer = null;
            this.isDisabled = false;
            this.secondsTime = this.waitTime;
          }
        }, 1000);
      }
    }
  }
};
</script>

<style  lang='less' scoped>
.sms-code-container {
  .el-button {
    width: 112px;
  }
}
</style>