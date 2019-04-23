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
      tableTitle="角色管理列表"
      :loading="loading"
      :columns="headers"
      :list="list"
      :total="total"
      :pageNum.sync="tableParam.pageNum"
      :pageSize.sync="tableParam.pageSize"
      @viewRole="viewRole"
      @editRole="editRole"
      @deleteRole="deleteRole"
      @getList="initData"
    ></base-table>
    <el-dialog :title="roleTitle" :visible.sync="detailsVisible">
      <el-form :model="detailsData">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="detailsData.roleName" :disabled="iSdisabled"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" :label-width="formLabelWidth">
          <el-input v-model="detailsData.note" type="textarea" :rows="3" :disabled="iSdisabled"></el-input>
        </el-form-item>
        <el-form-item label="权限" :label-width="formLabelWidth">
          <el-radio v-model="radio" label="1" @change="radioChange" :disabled="iSdisabled">全选</el-radio>
          <el-radio v-model="radio" label="2" @change="radioChange" :disabled="iSdisabled">全部取消</el-radio>
          <el-tree
            :data="authData"
            @check-change="nodeChange"
            show-checkbox
            node-key="seq"
            ref="tree"
            :default-expanded-keys="seqList"
            :default-checked-keys="seqList"
            :props="defaultProps"
          ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="!iSdisabled">
        <el-button @click="detailsVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitRole" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { devService } from "@/config/env";
import api from "@/api/index";
import listMixins from "@/mixins/tableList";
import baseTable from "@/components/baseTable";
import queryConditions from "@/components/queryConditions";
import baseDetails from "@/components/baseDetails";
import toolbar from "@/components/toolbar";

export default {
  name: "role",
  mixins: [listMixins],
  components: {
    queryConditions,
    baseTable,
    baseDetails,
    toolbar
  },
  data() {
    return {
      toolButtons: [
        {
          name: "新增角色",
          operation: "queryBtn",
          icon: "el-icon-plus"
        }
      ],
      queryFormList: [
        {
          type: "input",
          name: "roleName",
          label: "角色名称",
          placeholder: "请输入角色名称",
          value: ""
        },
        {
          name: "sort",
          value: "createTime"
        }
      ],
      headers: [
        {
          key: "roleId",
          title: "ID"
        },
        {
          key: "roleName",
          title: "名称"
        },
        {
          key: "note",
          title: "描述"
        },
        {
          type: "operate",
          title: "操作",
          width: "200",
          operates: [
            {
              name: "查看",
              emitKey: "viewRole"
            },
            {
              name: "编辑",
              emitKey: "editRole"
            },
            {
              name: "删除",
              emitKey: "deleteRole"
            }
          ]
        }
      ],
      detailsOptions: [
        {
          label: "id",
          key: "roleId"
        },
        {
          label: "名称",
          key: "roleName"
        },
        {
          label: "名称",
          key: "roleName"
        }
      ],
      detailsData: {},
      detailsVisible: false,
      roleTitle: "角色详情",
      formLabelWidth: "120px",
      authData: [],
      defaultProps: {
        children: "childrenMenuList",
        label: "title"
      },
      radio: "",
      iSdisabled: true,
      seqList: []
    };
  },
  created() {
    this.initData();
  },
  methods: {
    // 初始化数据
    initData(obj) {
      let data = {
        pageNum: "",
        pageSize: "",
        roleName: ""
      };
      if (obj && obj.limit) {
        this.tableParam.pageSize = obj.limit;
      }
      this.listSuccessCb("getRoleList");
    },
    //重置搜索表单
    resetForm() {
      for (let i = 0; i < this.queryFormList.length; i++) {
        this.queryFormList[i].value = "";
      }
    },
    radioChange() {
      if (this.radio == 1) {
        this.$refs.tree.setCheckedNodes(this.authData);
      } else {
        this.$refs.tree.setCheckedKeys([]);
      }
    },
    nodeChange() {
      this.seqList = this.$refs.tree.getCheckedKeys();
    },
    submitRole() {
      let id = this.roleId;
      if (id != "" && id != undefined && id != null) {
        this.addEditRole();
      } else {
        this.addRole();
      }
    },
    // 获取权限菜单
    async getRoleMenu() {
      let res = await api.getRoleMenu();
      if (res.status == 1) {
        this.authData = res.data;
        if (this.iSdisabled) {
          this.autharr(this.authData);
        }
      } else {
        this.$message.error(res.msg);
      }
    },
    // 获取当前信息
    async getRoleOne(data) {
      let res = await api.getRoleOne(data);
      if (res.status == 1) {
        this.detailsData = res.data;
        this.seqList = res.data.seqList;
      } else {
        this.$message.error(res.msg);
      }
    },
    async addRole() {
      let that = this;
      let data = {
        roleName: that.detailsData.roleName,
        note: that.detailsData.note,
        seqList: that.seqList
      };
      let res = await api.addRole(data);
      if (res.status == 1) {
        that.detailsVisible = false;
        that.$message.success("新建成功");
        this.initData();
      } else {
        that.$message.error(res.msg);
      }
    },
    async addEditRole() {
      let that = this;
      let data = {
        roleName: that.detailsData.roleName,
        note: that.detailsData.note,
        seqList: that.seqList,
        roleId: that.detailsData.roleId
      };
      let res = await api.addEditRole(data);
      if (res.status == 1) {
        that.detailsVisible = false;
        that.$message.success("修改成功");
      } else {
        that.$message.error(res.msg);
      }
    },
    autharr(arr) {
      if (!!arr && arr.length != 0) {
        for (let i = 0; i < arr.length; i++) {
          arr[i].disabled = true;
          if (
            !!arr[i].childrenMenuList &&
            arr[i].childrenMenuList.length != 0
          ) {
            this.autharr(arr[i].childrenMenuList);
          }
        }
      }
    },
    viewRole(row) {
      let data = { id: row.roleId };
      this.iSdisabled = true;
      this.detailsVisible = true;
      this.getRoleOne(data);
      this.getRoleMenu();
    },
    editRole(row) {
      this.roleId = row.roleId;
      let data = { id: row.roleId };
      this.iSdisabled = false;
      this.detailsVisible = true;
      this.getRoleOne(data);
      this.getRoleMenu();
    },
    deleteRole(row) {
      let data = {
        id: row.roleId
      };
      let that = this;
      that
        .$confirm("此操作将永久删除该该角色, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          api.deleteRole(data).then(function(res) {
            that.initData();
            if (res.status == 1) {
              that.$message({
                type: "success",
                message: "删除成功!"
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
    //新增角色
    queryBtn() {
      this.roleTitle = "新增角色";
      this.roleId = "";
      this.seqList = [];
      this.detailsData = {};
      this.radio = "";
      this.iSdisabled = false;
      this.detailsVisible = true;
      this.getRoleMenu();
    }
  }
};
</script>

<style lang="less">
</style>