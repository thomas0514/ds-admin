<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />
    <breadcrumb/>
    <div @click="gotoMessage" class="message-icon">
      <el-badge class="mark" :max="10" v-if="msgNum>0" :value="msgNum" />
      <svg-icon icon-class="message"/>
    </div>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img :src="avatar?avatar:'/static/avatar.png'" width="40" class="user-avatar" height="40" alt>
        <i class="el-icon-caret-bottom"/>
        <span class="user-name">{{ name || '' }}</span>
      </div>
      <el-dropdown-menu slot="dropdown" placement='bottom' class="user-dropdown">
        <router-link class="inlineBlock" to="/sysSettings/editPassword">
          <el-dropdown-item>修改密码</el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span style="display:block;" @click="logout">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import api from "@/api/index";
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(["sidebar", "userInfo", "avatar", "name","msgNum"])
  },
  created() {
    this.initData();
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        location.reload(); // 为了重新实例化vue-router对象 避免bug
      });
    },
    gotoMessage(){
      this.$router.push({
        path: "/message/list"
      });
    },
    async initData(){
      let $this = this;
      this.$store.dispatch("ReadMsg");
      setInterval(function(){
        $this.$store.dispatch("ReadMsg");
      },100000)
       
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .message-icon{
    position: absolute;
    top:0px;
    right: 140px;
    width: 30px;
    height: 30px;
    font-size: 25px;
    color: #303133;
    cursor: pointer;
    .el-badge{
      position: absolute;
      top:-10px;
      right:-5px;
    }
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    width: 90px;
    right: 30px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1px #ccc solid;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: 10px;
        top: 25px;
        font-size: 12px;
      }
      .user-name {
        position: absolute;
        right: -24px;
        top: -10px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 70px;
      }
    }
  }
}
</style>

