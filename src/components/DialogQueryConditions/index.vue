<!--
 * @Author: wuhao
 * @Date: 2018-12-17 16:47:14
 * @LastEditors: wuhao
 * @LastEditTime: 2019-01-08 10:59:50
 * @Description: 封装table搜索条件
 -->
<template>
  <div :class="{'hidden':hidden}" class="query-conditions-container">
    <el-dialog title="查询条件" :visible.sync="dialogShow">
      <el-form
        :inline="true"
        :model="queryParams"
        ref="queryForm"
        size="small"
        label-width="100px"
        class="demo-form-inline"
      >
        <template v-for="(item, index) in queryFormList">
          <el-form-item :key="index" v-if="item.type === 'input'" :label="item.label">
            <el-input clearable v-model="item.value" :placeholder="item.placeholder || ''"></el-input>
          </el-form-item>

          <el-form-item v-else-if="item.type === 'select'" :label="item.label">
            <el-select
              :clearable="item.clearable"
              :filterable="item.filterable"
              v-model="item.value"
              :placeholder="item.placeholder || ''"
            >
              <el-option
                v-for="(option,i) in item.options"
                :key="i"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            v-else-if="item.type === 'date' || item.type === 'daterange'"
            :label="item.label"
          >
            <el-date-picker
              :type="item.type"
              value-format="yyyy-MM-dd"
              range-separator="至"
              placeholder="选择日期"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="daterangeChange"
              v-model="item.value"
            ></el-date-picker>
          </el-form-item>
        </template>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('queryForm')">重置</el-button>
        <el-button type="primary" @click="submitForm('queryForm')">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "queryConditions",
  props: {
    hidden: {
      type: Boolean,
      default: false
    },
    dialogFormVisible: {
      type: Boolean,
      default: false
    },
    queryParams: {
      type: Object,
      default: () => {}
    },
    queryFormList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      resetData: ""
    };
  },
  mounted() {
    this.resetData = this.queryParams;
  },
  computed: {
    dialogShow: {
      get() {
        return this.dialogFormVisible;
      },
      set(val) {
        this.$emit("update:dialogFormVisible", val);
      }
    }
  },
  methods: {
    submitForm(val) {
      this.$emit("search", this.queryParams);
    },
    // 日期区间选择callback
    daterangeChange(val) {
      this.$emit("daterangeChange", val);
    },
    // 重置搜索表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.$emit("resetForm", this.resetData);
    }
  }
};
</script>

<style scoped lang="less">
.query-conditions-container {
  .el-input,
  .el-select {
    width: 210px;
  }
}
.query-conditions-container.hidden {
  display: none;
}
</style>
