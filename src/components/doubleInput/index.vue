<!--
 * @Author: wuhao
 * @Date: 2018-12-17 16:47:14
 * @LastEditors: wuhao
 * @LastEditTime: 2018-12-25 15:44:22
 * @Description: 封装table搜索条件
 -->
<template>
    <div :value="value">
         <el-input
            clearable
            v-model="pre"
            :placeholder="placeholder || ''"
            @blur="nextInputFocus"
            ref="start"
          ></el-input>-
          <el-input
            clearable
            v-model="next"
            :placeholder="placeholder || ''"
            @change="preInputFocus"
            ref="end"
          ></el-input>
    </div>
</template>
    
<script>
export default {
  name: "doubleInput",
  props: {
    value: {
      type: String,
      default: ""
    },
    placeholder:{
      type: String,
      default: ""
    },
  },
  data() {
    return {
      isFocus: false,
      pre: "",
      next: ""
    };
  },
  computed(){
    // indata:()=>{
    //     if(this.value!="" && this.value!=null){
    //         this.pre = this.vlaue.splite(",")[0];
    //         this.next = this.vlaue.splite(",")[0];
    //     }
    //     return this.pre
    //     return this.next 
    // }
  },
  methods: {
    indata(){
    },
    nextInputFocus() {
        if(this.next==""){
            this.$refs["end"].focus();
            return false;
        }
        if (this.pre >= this.next) {
            this.pre = "";
            this.$message.error("有效期起始值不能大于结束值")
            return false;
        }
    },
    preInputFocus(e) {
      if (this.pre == "") {
        this.$refs["start"].focus();
      } else {
        if (this.pre >= this.next) {
          this.$message.error("有效期起始值不能大于结束值")
          this.next = "";
          return false;
        } else {
            let arr = [],str="";
            arr[0] = this.pre;
            arr[1] = this.next;
            str = arr.join(",").toString()
            this.value = str;
        }
      }
    },
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
</style>
