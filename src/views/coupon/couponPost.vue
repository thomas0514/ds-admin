<template>
  <div class="app-container registered-users-page">
    <el-form
      :model="couponPostForm"
      ref="couponPostForm"
      :rules="rules"
      label-position="left"
      label-width="150px"
    >
      <el-form-item label="优惠券类型" prop="grantType">
        <el-select v-model="couponPostForm.grantType">
          <el-option label="现金满减券" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="优惠券名称" prop="name">
        <el-input
          class="input-text"
          v-model="couponPostForm.name"
          placeholder="请输入优惠券名称"
          clearable
          maxlength="8"
        ></el-input>
      </el-form-item>
      <el-form-item label="副标题" prop="viceName">
        <el-input
          class="input-text"
          v-model="couponPostForm.viceName"
          placeholder="请输入优惠券副标题"
          clearable
          maxlength="2"
        ></el-input>
      </el-form-item>
      <el-form-item label="面值" prop="price">
        <el-input
          class="input-text"
          v-model.number="couponPostForm.price"
          placeholder="优惠券面值为1〜999之间的整数"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item prop="condition" class="form-text-condition" label="使用条件金额满">
        <el-input
          type="number"
          class="input-text-condition"
          v-model.number="couponPostForm.condition"
          placeholder="不填则默认为0"
          clearable
        ></el-input>元可用
      </el-form-item>
      <el-form-item label="有效期" prop="validity">
        <el-date-picker
          v-model="couponPostForm.validity"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="发放用户" prop="sendUser">
        <el-select v-model="couponPostForm.sendUser">
          <el-option label="真实用户" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0px" class="form-submit">
        <el-button type="primary" @click="submitForm('couponPostForm')">发送</el-button>
        <el-button @click="resetForm('couponPostForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from "@/api/index";

export default {
  name: "couponPost",
  components: {},
  data() {
    var checkMoney = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("金额不能为空"));
      }
      if (!Number.isInteger(value) || value < 1 || value > 999) {
        callback(new Error("请输入1〜999之间的整数"));
      } else {
        callback();
      }
    };

    return {
      couponPostForm: {
        grantType: "1",
        name: "",
        viceName: "",
        price: "",
        validity: "",
        condition: "",
        sendUser: "1",
        startTime: "",
        endTime: ""
      },
      rules: {
        grantType: {
          required: true
        },
        name: {
          required: true,
          message: "请输入优惠券名称",
          trigger: "blur"
        },
        viceName: {
          required: true,
          message: "请输入优惠券副标题",
          trigger: "blur"
        },
        price: {
          required: true,
          validator: checkMoney,
          trigger: "blur"
        },
        validity: {
          required: true,
          message: "请选择优惠券有效期",
          trigger: "blur"
        },
        sendUser: {
          required: true
        }
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.sendCoupon();
        } else {
          return false;
        }
      });
    },

    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    async sendCoupon() {
      let params = this.couponPostForm;
      if (!params.condition) {
        params.condition = 0;
      }
      params.startTime = params.validity[0];
      params.endTime = params.validity[1];
      let res = await api.postCoupon(params);
      if (res.status == 1) {
        this.$message("发送成功");
        this.resetForm('couponPostForm')
      }
    }
  }
};
</script>

<style lang="less">
.input-text {
  width: 300px;
}

.input-text-condition {
  width: 300px;
  margin-right: 15px;
}

.form-text-condition {
  font-size: 14px;
  color: #606266;
  font-weight: 600;
}

.form-submit {
  margin-left: 55px;
  margin-top: 55px;
}
</style>