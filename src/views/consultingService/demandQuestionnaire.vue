<template>
  <div class="app-container question-page">
    <el-button size="small" @click="gotoPage" type="primary">返回</el-button>
    <div class="questions">
      <div class="questions-li" v-for="(item,index) in questionMos" :key="index">
        <div class="title">{{index+1}}、{{item.content}}</div>
        <div class="opt">
          <el-radio-group
            v-if="item.questionType == 1 && item.optionsAnswer"
            v-model="item.optionsAnswer[0]"
          >
            <el-radio
              v-for="(p,pindex) in item.options"
              :key="pindex"
              :label="p.seq"
              :disabled="p.seq==item.optionsAnswer[0]?false:true"
            >{{p.content}}</el-radio>
          </el-radio-group>
          <el-checkbox-group v-if="item.questionType == 2" v-model="item.optionsAnswer">
            <el-checkbox
              v-for="(p,pindex) in item.options"
              :key="pindex"
              :label="p.seq"
              disabled
            >{{p.content}}</el-checkbox>
          </el-checkbox-group>
          <el-select
            v-if="item.questionType == 3 && item.optionsAnswer"
            v-model="item.optionsAnswer[0]"
          >
            <el-option
              v-for="p in item.options"
              :key="p.seq"
              :label="p.content"
              :value="p.seq"
              disabled
            ></el-option>
          </el-select>
          <div
            class="answer"
            v-if="item.questionType == 4 || item.questionType == 5|| item.questionType == 6"
          >{{item.textAnswer}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/index";

export default {
  name: "demandQuestionnaire",
  mixins: [],
  components: {},
  data() {
    return {
      questionMos: []
    };
  },
  created() {
    this.initData();
  },
  methods: {
    // 初始化数据
    async initData() {
      let serviceOrderId = this.$route.query.id;
      let result = await api.getConsultingAnswer({
        serviceOrderId: serviceOrderId
      });
      if (result.status == 1) {
        if (result.data) {
          this.questionMos = result.data.questionMos;
        } else {
          this.$message({
            type: "error",
            message: "用户没有填写问卷",
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
.question-page {
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #409eff;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #409eff;
    border-color: #409eff;
  }
  .el-checkbox .el-checkbox {
    margin-left: 15px;
    margin-right: 15px;
    margin-top: 15px;
  }
  .el-checkbox + .el-checkbox {
    margin-left: 15px;
  }
  .questions {
    margin-top: 15px;
    font-size: 14px;
    .questions-li {
      margin-bottom: 10px;
      border-bottom: 1px dashed #dcdfe6;
      padding-bottom: 10px;
    }
    .title {
      margin-bottom: 20px;
      font-weight: bold;
    }
    .answer {
      color: #666;
    }
  }
}
</style>