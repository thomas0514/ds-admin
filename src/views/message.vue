<template>
  <div class="app-container message-container">
    <div class="nodata" v-if="list.length==0">
      <i class="el-icon-warning"></i>暂无消息
    </div>
    <el-row>
      <el-col :span="7" v-for="(p, index) in list" :key="index" :offset="index%3 ? 2 :0">
        <el-card :body-style="{ padding: '0px' }">
          <div class="item">
            <el-badge v-if="!p.isSee" is-dot class="item-icon"></el-badge>
            <span>{{p.title}}</span>
            <span>{{p.content}}</span>
            <div class="bottom clearfix">
              <time class="time">{{ p.sendTime }}</time>
              <el-button
                type="text"
                class="button"
                v-if="p.linkUrl"
                @click="gotoPage(p.linkUrl,p.msgId)"
              >查看详情</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from "@/api/index";
export default {
  name: "message",
  components: {},
  data() {
    return {
      list: []
    };
  },
  mounted() {},
  computed: {},
  created() {
    this.initData();
  },
  methods: {
    async initData() {
      let result = await api.getUserMessage();
      if (result.status == 1) {
        if (result.data) {
          this.list = result.data;
        }
      }
    },
    async gotoPage(url, msgId) {
      let result = await api.changeUserMessageStatus({
        id: msgId
      });
      this.$store.dispatch("ReadMsg");
      this.$router.push({
        path: url
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.message-container {
  .time {
    font-size: 13px;
    color: #999;
  }
  .nodata {
    text-align: center;
    font-size: 20px;
    padding-top: 10%;
    color: #333;
    i {
      margin-right: 10px;
    }
  }
  .el-badge__content.is-dot {
    width: 12px;
    height: 12px;
  }
  .item {
    position: relative;
    padding: 17px 17px 34px 17px;
    min-height: 125px;
    .item-icon {
      position: absolute;
      right: 10px;
      top: 10px;
      cursor: pointer;
    }
    span {
      display: block;
      font-size: 16px;
      line-height: 24px;
    }
    .time {
      float: left;
    }
  }
  .bottom {
    margin-top: 13px;
    position: absolute;
    bottom: 8px;
    left: 17px;
    width: 90%;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 100%;
    display: block;
  }
  .el-col-offset-2 {
    margin-left: 4.66667%;
    margin-bottom: 20px;
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }

  .clearfix:after {
    clear: both;
  }
}
</style>

