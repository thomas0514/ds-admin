<!--
 * @Author: wuhao
 * @Date: 2018-12-17 16:47:14
 * @LastEditors: wuhao
 * @LastEditTime: 2018-12-25 15:44:22
 * @Description: 封装table搜索条件
 -->
<template>
  <div :class="{'hidden':hidden}" class="query-conditions-container">
    <el-form
      :inline="true"
      :model="queryParams"
      ref="qform"
      size="small"
      label-width="110px"
      class="demo-form-inline"
    >
      <template v-for="(item, index) in queryFormList">
        <el-form-item :key="index" v-if="item.type === 'input'" :label="item.label">
          <el-input clearable v-model="item.value" :placeholder="item.placeholder || ''"></el-input>
        </el-form-item>
        <el-form-item v-else-if="item.type === 'select'" :label="item.label" :key="index">
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
        <el-form-item v-else-if="item.type == 'cascader'" :label="item.label" :key="index">
          <el-cascader :options="item.options" v-model="item.value"></el-cascader>
        </el-form-item>
        <el-form-item :key="index" v-else-if="item.type === 'doubleinput'" :label="item.label">
          <el-input
            clearable
            v-model="pre"
            :placeholder="item.placeholder || ''"
            @blur="nextInputFocus"
            ref="startDay"
          ></el-input>-
          <el-input
            clearable
            v-model="next"
            :placeholder="item.placeholder || ''"
            @change="preInputFocus"
            ref="endDay"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-else-if="item.type === 'date' || item.type === 'datetimerange' || item.type === 'daterange'"
          :label="item.label"
          :key="index"
        >
          <el-date-picker
            :type="item.type"
            :format="item.format?item.format:'yyyy-MM-dd'"
            range-separator="至"
            placeholder="选择日期"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="daterangeChange"
            v-model="item.value"
          ></el-date-picker>
        </el-form-item>
      </template>
      <el-form-item>
        <el-button class="search-btn" icon="el-icon-search" type="primary" @click="search">搜索</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import doubleInput from "@/components/doubleInput";
export default {
  name: "queryConditions",
  props: {
    hidden: {
      type: Boolean,
      default: false
    },
    queryParams: {
      type: Object,
      default() {
        return {};
      }
    },
    queryFormList: {
      type: Array,
      default: () => []
    }
  },
   components: {
    doubleInput
  },
  data() {
    return {
      isFocus: false,
      pre: "",
      next: ""
    };
  },
  methods: {
    search(val) {
      this.$emit("search", this.queryParams);
    },
    // 日期区间选择callback
    daterangeChange(val) {
      this.$emit("daterangeChange", val);
    },
    nextInputFocus() {
      var pre = parseInt(this.$refs["startDay"][0].value);
      var next = parseInt(this.$refs["endDay"][0].value);
      if (pre >= next) {
        this.pre = "";
        this.$message.error("有效期起始值不能大于结束值");
        return false;
      }
      if (this.next == "") {
        this.$refs["endDay"][0].focus();
      }
    },
    preInputFocus(e) {
      if (this.$refs["startDay"][0].value == "") {
        this.$refs["startDay"][0].focus();
      } else {
        var pre = parseInt(this.$refs["startDay"][0].value);
        var next = parseInt(this.$refs["endDay"][0].value);
        if (pre >= next) {
          this.$message.error("有效期起始值不能大于结束值");
          this.next = "";
          return false;
        } else {
          for (var i in this.queryFormList) {
            if (this.queryFormList[i].type == "doubleinput") {
              this.queryFormList[i].options[0] = pre;
              this.queryFormList[i].options[1] = next;
            }
          }
        }
      }
    },
    resetForm() {
      this.pre = "";
      this.next = "";
      this.$emit("resetForm", "true");
    }
  }
};
</script>

<style scoped lang="less">
.query-conditions-container {
  background: #eee;
  padding: 18px 0 0;
  border: 1px solid #d3dce6;
  .el-input,
  .el-select {
    width: 190px;
  }
  .search-btn {
    margin-left: 20px;
  }
}
.query-conditions-container.hidden {
  display: none;
}
</style>
