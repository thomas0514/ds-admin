<template>
  <div class="app-container registered-users-page">
    <toolbar :toolButtons="toolButtons" @queryBtn="queryBtn"></toolbar>
    <queryConditions
      :dialogFormVisible.sync="dialogFormVisible"
      :queryFormList.sync="queryFormList"
      :queryParams="queryParams"
      @search="initData"
      @resetForm="resetForm"
    ></queryConditions>
    <base-table
      tableTitle="系统用户列表"
      :loading="loading"
      :columns="headers"
      :list="list"
      :total="total"
      :pageNum.sync="tableParam.pageNum"
      :pageSize.sync="tableParam.pageSize"
      @editUser="editUser"
      @setUser="setUser"
      @deleteUser="deleteUser"
      @viewUser="viewUser"
      @ableUser="ableUser"
      @getList="initData"
    ></base-table>
    <el-dialog :title="userTitle" :visible.sync="detailsVisible">
      <el-form :model="detailsData">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="detailsData.userName" :disabled="iSdisabled"></el-input>
        </el-form-item>
        <el-form-item label="姓名" :label-width="formLabelWidth">
          <el-input v-model="detailsData.nickName" :disabled="iSdisabled"></el-input>
        </el-form-item>
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="detailsData.phoneNumber" :disabled="iSdisabled"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="detailsData.email" :disabled="iSdisabled"></el-input>
        </el-form-item>
        <el-form-item label="用户头像" :label-width="formLabelWidth">
          <el-upload
            class="upload-demo"
            :disabled="iSdisabled"
            :action="imgUrl"
            :headers="uploadHeaders"
            :on-success="handleSucess"
            :before-upload="handleBeforeUpload"
            :file-list="fileList"
            list-type="picture"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="关联组织" :label-width="formLabelWidth">
          <el-select 
            v-model="detailsData.orgId" 
            :disabled="iSdisabled" 
            placeholder="请选择" 
            @change="orgStatus"
            clearable >
            <el-option
              v-for="item in orgList"
              :key="item.orgId"
              :label="item.orgName"
              :value="item.orgId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成员类型" :label-width="formLabelWidth">
          <el-select 
            v-model="detailsData.orgType" 
            :disabled="iSdisabled" 
            placeholder="请选择"
            clearable >
            <el-option
              v-for="item in memberList"
              :key="item.orgType"
              :label="item.orgName"
              :value="item.orgType"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="成员等级" :label-width="formLabelWidth" v-if="detailsData.roleId=='role10513'">
          <el-select 
            v-model="detailsData.level" 
            :disabled="iSdisabled" 
            placeholder="请选择"
            clearable >
            <el-option
              v-for="item in levelList"
              :key="item.level"
              :label="item.levelName"
              :value="item.level"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="荣联Id" :label-width="formLabelWidth" v-if="detailsData.roleId =='role10513'|| detailsData.roleIdian =='role79958'">
          <el-select 
            v-model="detailsData.rlId" 
            :disabled="iSdisabled" 
            placeholder="请选择"
            clearable >
            <el-option
              v-for="item in ronglianList"
              :key="item.rlId"
              :label="item.rlUserName"
              :value="item.rlId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="!iSdisabled">
        <el-button @click="detailsVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitUser" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { devService } from "@/config/env";
import api from "@/api/index";
import listMixins from "@/mixins/tableList";
import baseTable from "@/components/baseTableOrg";
import queryConditions from "@/components/queryConditions";
import baseDetails from "@/components/baseDetails";
import { getToken } from "@/utils/auth";

export default {
  name: "registeredUsers",
  mixins: [listMixins],
  components: {
    queryConditions,
    baseTable,
    baseDetails
  },
  data() {
    return {
      toolButtons: [
        {
          name: "新增用户",
          operation: "queryBtn",
          icon: "el-icon-plus"
        }
      ],
      queryFormList: [
        {
          type: "input",
          name: "userName",
          label: "用户名",
          placeholder: "请输入用户名",
          value: ""
        },
        {
          type: "input",
          name: "nickName",
          label: "姓名",
          placeholder: "请输入姓名",
          value: ""
        },
        {
          name: "sort",
          value: "createTime"
        }
      ],
      headers: [
        {
          key: "userId",
          title: "ID"
        },
        {
          key: "userName",
          title: "用户名"
        },
        {
          key: "nickName",
          title: "姓名"
        },
        {
          key: "headUrl",
          title: "用户头像",
          type: "img"
        },
        {
          key: "roleName",
          title: "角色"
        },
        {
          key: "orgName",
          title: "组织"
        },
        {
          key: "phoneNumber",
          title: "用户手机号"
        },
        {
          key: "isLock",
          title: "状态",
          escape: row => {
            return row.isLock == 1 ? "已禁用" : "正常";
          }
        },
        {
          type: "operate",
          title: "操作",
          width: "220",
          operates: [
            {
              name: "查看",
              emitKey: "viewUser"
            },
            {
              name: "修改",
              emitKey: "editUser"
            },
            {
              name: "重置密码",
              emitKey: "setUser"
            },
            {
              name: "删除",
              emitKey: "deleteUser"
            },
            {
              name: "禁用",
              emitKey: "ableUser"
            }
          ]
        }
      ],
      detailsOptions: [],
      detailsData: {
        roleId:"role10513"
      },
      detailsVisible: false,
      userTitle: "新增用户",
      userId: "",
      formLabelWidth: "120px",
      iSdisabled: true,
      orgList: [],
      fileList: [],
      memberList: [
        {
          orgName: "成员",
          orgType: 0
        },
        {
          orgName: "主管",
          orgType: 1
        }
      ],
      levelList: [
        {
          levelName: "低",
          level: 1
        },
        {
          levelName: "中",
          level: 2
        },
        {
          levelName: "高",
          level: 3
        }
      ],
      imgUrl: `${devService}/system/user/upload/img`,
      ronglianList: [],
      uploadHeaders: { authorization: getToken() },
    };
  },
  created() {
    this.initData();
    this.getUserOrgList();
    this.getRonglian();
  },
  methods: {
    //重置搜索表单
    resetForm() {
      for (let i = 0; i < this.queryFormList.length; i++) {
        this.queryFormList[i].value = "";
      }
    },
    handleSucess(res, file) {
      //图片上传成功
      this.fileList = [];
      this.fileList.push(file);
      this.detailsData.headUrl = res.data;
    },
    handleBeforeUpload(file) {
      const isLt40k = file.size / 1024 < 10000;
      if (!isLt40k) {
        this.$message.error("上传缩略图大小不能超过 40kB");
      }
      const isSize = new Promise(function(resolve, reject) {
        let width = 10000;
        let height = 10000;
        let _URL = window.URL || window.webkitURL;
        let img = new Image();
        img.onload = function() {
          let valid = img.width <= width && img.height <= height;
          valid ? resolve() : reject();
        };
        img.src = _URL.createObjectURL(file);
      }).then(
        () => {
          return file;
        },
        () => {
          this.$message.error("上传的缩略图必须是等于或小于230*160");
          return Promise.reject();
        }
      );
      return isLt40k && isSize;
    },
    // 初始化数据
    initData(obj) {
      if (obj && obj.limit) {
        this.tableParam.pageSize = obj.limit;
      }
      this.listSuccessCb("getUserList");
    },
    submitUser() {
      let id = this.userId;
      if (id != "" && id != undefined && id != null) {
        this.addEditUser();
      } else {
        this.addUser();
      }
    },
    // 获取关联的组织
    async getUserOrgList() {
      let res = await api.getUserOrgList();
      if (res.status == 1) {
        this.orgList = res.data;
      } else {
        this.$message.error(res.msg);
      }
    },
    //获取用户信息
    async getUserOne(data) {
      let res = await api.getUserOne(data);
      if (res.status == 1) {
        this.detailsData = res.data;
        this.detailsData.rlId = this.detailsData.rlUserName; 
        this.fileList = [];
        this.fileList.push({ url: res.data.headUrl });
      } else {
        this.$message.error(res.msg);
      }
    },
    async addUser() {
      let that = this;
      let data = {
        email: that.detailsData.email,
        headUrl: that.detailsData.headUrl,
        nickName: that.detailsData.nickName,
        orgId: that.detailsData.orgId,
        orgType: that.detailsData.orgType,
        phoneNumber: that.detailsData.phoneNumber,
        rlId: that.detailsData.rlId,
        userName: that.detailsData.userName,
        level: that.detailsData.level
      };
      let res = await api.addUser(data);
      if (res.status == 1) {
        that.detailsVisible = false;
        that.$message.success("新建成功");
        that.initData();
      } else {
        that.$message.error(res.msg);
      }
    },
    async addEditUser() {
      let that = this;
      let data = {
        email: that.detailsData.email,
        headUrl: that.detailsData.headUrl,
        nickName: that.detailsData.nickName,
        orgId: that.detailsData.orgId,
        orgType: that.detailsData.orgType,
        phoneNumber: that.detailsData.phoneNumber,
        rlId: that.detailsData.rlId,
        userName: that.detailsData.userName,
        level: that.detailsData.level,
        userId: that.detailsData.userId
      };
      let res = await api.addEditUser(data);
      if (res.status == 1) {
        that.detailsVisible = false;
        that.$message.success("修改成功");
        that.initData();
      } else {
        that.$message.error(res.msg);
      }
    },
    viewUser(row) {
      let data = { id: row.userId };
      this.userTitle = "用户详情";
      this.iSdisabled = true;
      this.detailsVisible = true;
      this.getUserOne(data);
    },
    editUser(row) {
      if(!this.PermissionAuth("user", "put")){
        this.$message.error("该操作没有权限");
        return false;
      }
      this.userId = row.userId;
      let data = { id: row.userId };
      this.userTitle = "修改用户";
      this.iSdisabled = false;
      this.detailsVisible = true;
      this.getUserOne(data);
    },
    deleteUser(row) {
      if(!this.PermissionAuth("user", "delete")){
        this.$message.error("该操作没有权限");
        return false;
      }
      let data = {
        id: row.userId
      };
      let that = this;
      that
        .$confirm("此操作将永久删除该该用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          api.deleteUser(data).then(function(res) {
            that.initData();
            if (res.status == 1) {
              that.$message({
                type: "success",
                message: "删除成功"
              });
            } else {
              that.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    ableUser(row) {
      if(!this.PermissionAuth("user", "put")){
        this.$message.error("该操作没有权限");
        return false;
      }
      let title = "此操作将禁用该用户, 是否继续?",
        type = 1,
        msg = "禁用";
      if (row.isLock == 1) {
        title = "此操作将启用该用户, 是否继续?";
        type = 0;
        msg = "启用";
      }
      let data = {
        id: row.userId,
        type: type
      };
      let that = this;
      that
        .$confirm(title, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          api.ableUser(data).then(function(res) {
            that.initData();
            if (res.status == 1) {
              that.$message({
                type: "success",
                message: msg + "成功"
              });
            } else {
              that.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消"+msg
          });
        });
    },
    setUser(row) {
      if(!this.PermissionAuth("user", "put")){
        this.$message.error("该操作没有权限");
        return false;
      }
      let that = this;
      let data = {
        id: row.userId
      };
      that
        .$confirm('密码重置后，新密码会以短信方式发送到该用户手机上。', "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          api.setUser(data).then(function(res) {
            that.initData();
            if (res.status == 1) {
              that.$message({
                type: "success",
                message: "重置成功"
              });
            } else {
              that.$message.error(res.msg);
            }
          });
        })
        .catch(() => {
          that.$message({
            type: "info",
            message: "已取消重置"
          });
        });
    },
    //新增用户
    queryBtn() {
      if(!this.PermissionAuth("user", "post")){
        this.$message.error("该操作没有权限");
        return false;
      }
      this.userTitle = "新增用户";
      this.fileList = [];
      this.detailsData = {};
      this.detailsData.roleId = "role10513";
      this.userId = "";
      this.iSdisabled = false;
      this.detailsVisible = true;
    },
    async getRonglian() {
      let that = this;
      let res = await api.getRonglian();
      if (res.status == 1) {
        that.ronglianList = res.data;
      } else {
        that.$message.error(res.msg);
      }
    },
    orgStatus(){
        for(let i in this.orgList){
          if(this.detailsData.orgId == this.orgList[i].orgId){
            this.detailsData.roleId = this.orgList[i].roleId;
          }
        }
    }
  }
};
</script>

<style lang="less">
.registered-users-page {
}
.el-message-box{
  width:430px;
}
</style>