<template>
  <div class="login-container">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <h3 class="title">
        <img width="150px" src="static/dt-logo.png">大童保险咨询后台管理系统
      </h3>
      <el-form-item prop="userName">
        <span class="svg-container">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          v-model.trim="loginForm.userName"
          name="userName"
          type="text"
          auto-complete="on"
          placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"/>
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="请输入密码"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye"/>
        </span>
      </el-form-item>
      <el-form-item prop="smsCode">
        <span class="svg-container">
          <svg-icon icon-class="smsCode"/>
        </span>
        <el-input
          v-model.trim="loginForm.smsCode"
          name="smsCode"
          auto-complete="on"
          placeholder="请输入短信验证码"
          @keyup.enter.native="handleLogin"
        />
        <div class="input-btn">
          <smsCode
            :waitTime="5"
            :form="loginForm"
            :identifyCode="identifyCode"
            @getCode="getCode"
            @refreshCode="refreshCode()"
          ></smsCode>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >登 录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import SIdentify from "@/components/identify";
import smsCode from "@/components/smsCode";
import { validate } from "@/utils/validation";

export default {
  name: "Login",
  components: {
    SIdentify,
    smsCode
  },
  data() {
    return {
      loginForm: {
        userName: "",
        password: "",
        smsCode: ""
      },
      loginRules: {
        userName: [
          {
            required: true,
            trigger: "blur",
            enNum: true,
            validator: validate
          }
        ],
        password: [{ required: true, trigger: "blur", validator: validate }],
        smsCode: [{ required: true, trigger: "blur", validator: validate }]
      },
      loading: false,
      pwdType: "password",
      redirect: undefined,
      identifyCodes: "1234567890",
      identifyCode: ""
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  mounted() {
    this.identifyCode = "";
    this.makeCode(this.identifyCodes, 4);
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("Login", this.loginForm)
            .then(res => {
              this.loading = false;
              if (res.isChangePassword == 1) {
                this.$router.push({ path: "/sysSettings/editPassword" });
              } else {
                this.$router.push({ path: this.redirect || "/" });
              }
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 获取验证码
    getCode(v) {
      console.log(v);
    },
    // 生成一个随机数
    randomNum(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    },
    refreshCode() {
      this.identifyCode = "";
      this.makeCode(this.identifyCodes, 4);
    },
    makeCode(o, l) {
      for (let i = 0; i < l; i++) {
        this.identifyCode += this.identifyCodes[
          this.randomNum(0, this.identifyCodes.length)
        ];
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    max-width: 100%;
    padding: 35px 35px 15px 35px;
    margin: 70px auto;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 20px;
    font-weight: 100;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    img {
      position: relative;
      margin-right: 20px;
      top: 10px;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .input-btn {
    position: absolute;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
    height: 40px;
    cursor: pointer;
  }
}
</style>
