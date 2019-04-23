<!--
 * @Author: wuhao
 * @Date: 2018-12-17 16:47:14
 * @LastEditors: wuhao
 * @LastEditTime: 2019-01-07 14:31:40
 * @Description: 封装顶部工具操作栏
 -->
<template>
  <div :class="{'hidden':hidden}" class="toolbar-container">
    <el-button
      v-for="(item,index) in toolButtons"
      :key="index"
      :icon="item.icon"
      @click.native="BtnClick(item.operation)"
      type="text"
    >{{item.name}}</el-button>
  </div>
</template>

<script>
export default {
  name: "toolbar",
  props: {
    hidden: {
      type: Boolean,
      default: false
    },
    toolButtons: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    BtnClick(operation) {
      console.log("bbb");
      this.$emit(operation);
    }
  }
};
</script>

<style lang="less">
.toolbar-container {
  border: 1px solid #d3dce6;
  width: 100%;
  background-color: #fff;
  .el-button {
    margin-left: 20px;
    span {
      color: #333;
    }
  }
}

.toolbar-container.hidden {
  display: none;
}
</style>
