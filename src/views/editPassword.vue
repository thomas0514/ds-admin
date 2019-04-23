<template>
  <div class="app-container edit-password-container">
    <el-form
      ref="passwordForm"
      :model="passwordForm"
      :rules="loginRules"
      :hide-required-asterisk="true"
      class="login-form"
      auto-complete="on"
      label-position="right"
      label-width="100px"
    >
      <el-form-item label="原密码" prop="password">
        <el-input
          :type="pwdType"
          v-model="passwordForm.oldPassword"
          name="password"
          auto-complete="on"
          placeholder="请输入原密码"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye"/>
        </span>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          :type="pwdType"
          v-model="passwordForm.newPassword"
          name="password"
          auto-complete="on"
          placeholder="请输入新密码"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye"/>
        </span>
      </el-form-item>
      <el-form-item label="确认密码" prop="newPasswordAgain">
        <el-input
          :type="pwdType"
          v-model="passwordForm.newPasswordAgain"
          name="password"
          auto-complete="on"
          placeholder="请再次输入新密码"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye"/>
        </span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click.native.prevent="onSubmit">提交</el-button>
        <el-button @click.native.prevent="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { validate } from "@/utils/validation";
import { changePassword } from "@/api/login";

export default {
  name: "editPassword",
  components: {},
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      passwordForm: {
        oldPassword: "",
        newPassword: "",
        newPasswordAgain: ""
      },
      loginRules: {
        oldPassword: [
          {
            required: true,
            min: 6,
            max: 16,
            trigger: "blur",
            validator: validate
          }
        ],
        newPassword: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        newPasswordAgain: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ]
      },
      pwdType: "password"
    };
  },
  mounted() {},
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    onSubmit() {
      this.$refs.passwordForm.validate(valid => {
        if (valid) {
          this.$confirm("确定修改密码吗？修改完需要重新登录！", "修改密码", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(async () => {
            let res = await changePassword({
              oldPassword: this.passwordForm.oldPassword,
              newPassword: this.passwordForm.newPassword,
              newPasswordAgain: this.passwordForm.newPasswordAgain
            });
            if (res.status == 1) {
              this.$message({
                type: "success",
                message: "修改成功!"
              });
              this.$store.dispatch("LogOut").then(() => {
                location.reload();
              });
            } else {
              this.$message({
                type: "error",
                message: res.msg
              });
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 重置form表单
    reset() {
      this.passwordForm.oldPassword = "";
      this.passwordForm.newPassword = "";
      this.passwordForm.newPasswordAgain = "";
      this.$refs.passwordForm.clearValidate();
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.edit-password-container {
  .login-form {
    width: 350px;
    max-width: 100%;
    margin: 5% auto;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 2px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .input-btn {
    position: absolute;
    right: -116px;
    top: 50%;
    transform: translateY(-50%);
    height: 40px;
    cursor: pointer;
  }
}
</style>

