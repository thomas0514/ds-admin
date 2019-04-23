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
      tableTitle="组织管理列表"
      :loading="loading"
      :columns="headers"
      :list="list"
      :total="total"
      :pageNum.sync="tableParam.pageNum"
      :pageSize.sync="tableParam.pageSize"
      @viewOrg="viewOrg"
      @editOrg="editOrg"
      @deleteOrg="deleteOrg"
      @ableOrg="ableOrg"
      @getList="initData"
    ></base-table>
    <el-dialog :title="OrgTitle" :visible.sync="detailsVisible">
      <el-form :model="detailsData">
        <el-form-item label="组织名称" :label-width="formLabelWidth">
          <el-input v-model="detailsData.orgName" :disabled="iSdisabled"></el-input>
        </el-form-item>
        <el-form-item label="组织描述" :label-width="formLabelWidth">
          <el-input v-model="detailsData.note" type="textarea" :rows="3" :disabled="iSdisabled"></el-input>
        </el-form-item>
        <el-form-item label="关联角色" :label-width="formLabelWidth">
          <el-select v-model="detailsData.roleId" :disabled="iSdisabled" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="!iSdisabled">
        <el-button @click="detailsVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submitOrg" size="small">确 定</el-button>
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

export default {
  name: "organization",
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
          name: "新增组织",
          operation: "queryBtn",
          icon: "el-icon-plus"
        }
      ],
      queryFormList: [
        {
          type: "input",
          name: "orgName",
          label: "组织名称",
          placeholder: "请输入组织名称",
          value: ""
        },
        {
          name: "sort",
          value: "createTime"
        }
      ],
      headers: [
        {
          key: "orgId",
          title: "ID"
        },
        {
          key: "orgName",
          title: "组织"
        },
        {
          key: "note",
          title: "描述"
        },
        {
          key: "roleId",
          title: "关联的角色id"
        },
        {
          key: "roleName",
          title: "关联的角色名字"
        },
        {
          key: "userCount",
          title: "数量"
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
          width: "160",
          operates: [
            {
              name: "查看",
              emitKey: "viewOrg"
            },
            {
              name: "编辑",
              emitKey: "editOrg"
            },
            {
              name: "删除",
              emitKey: "deleteOrg"
            },
            {
              name: "禁用",
              emitKey: "ableOrg"
            }
          ]
        }
      ],
      detailsOptions: [],
      detailsData: {},
      detailsVisible: false,
      OrgTitle: "新增组织",
      formLabelWidth: "120px",
      iSdisabled: true,
      roleList: [],
      orgId: ""
    };
  },
  created() {
    this.initData();
    this.getOrgRoleList();
  },
  methods: {
    // 初始化数据
    initData(obj) {
      if (obj && obj.limit) {
        this.tableParam.pageSize = obj.limit;
      }
      this.listSuccessCb("getOrgList");
    },
    //重置搜索表单
    resetForm() {
      for (let i = 0; i < this.queryFormList.length; i++) {
        this.queryFormList[i].value = "";
      }
    },
    submitOrg() {
      let id = this.orgId;
      if (id != "" && id != undefined && id != null) {
        this.addEditOrg();
      } else {
        this.addOrg();
      }
    },
    // 获取关联的角色
    async getOrgRoleList() {
      let res = await api.getOrgRoleList();
      if (res.status == 1) {
        this.roleList = res.data;
        console.log(this.roleList);
      } else {
        this.$message.error(res.msg);
      }
    },
    //获取组织信息
    async getOrgOne(data) {
      let res = await api.getOrgOne(data);
      if (res.status == 1) {
        this.detailsData = res.data;
      } else {
        this.$message.error(res.msg);
      }
    },
    async addOrg() {
      let that = this;
      let data = {
        orgName: that.detailsData.orgName,
        note: that.detailsData.note,
        roleId: that.detailsData.roleId
      };
      console.log(data);
      let res = await api.addOrg(data);
      if (res.status == 1) {
        that.detailsVisible = false;
        that.$message.success("新建成功");
        this.initData();
      } else {
        that.$message.error(res.msg);
      }
    },
    async addEditOrg() {
      let that = this;
      let data = {
        roleName: that.detailsData.roleName,
        note: that.detailsData.note,
        roleId: that.detailsData.roleId,
        orgId: that.detailsData.orgId
      };
      let res = await api.addEditOrg(data);
      if (res.status == 1) {
        that.detailsVisible = false;
        that.$message.success("修改成功");
      } else {
        that.$message.error(res.msg);
      }
    },
    viewOrg(row) {
      let data = { id: row.orgId };
      this.iSdisabled = true;
      this.detailsVisible = true;
      this.getOrgOne(data);
    },
    editOrg(row) {
      this.OrgId = row.orgId;
      let data = { id: row.orgId };
      this.iSdisabled = false;
      this.detailsVisible = true;
      this.getOrgOne(data);
    },
    deleteOrg(row) {
      let data = {
        id: row.orgId
      };
      let that = this;
      that
        .$confirm("此操作将永久删除该该角色, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          api.deleteOrg(data).then(function(res) {
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
    ableOrg(row) {
      let title = "此操作将永久禁用该组织, 是否继续?",
        type = 1,
        msg = "禁用";
      if (row.isLock == 1) {
        title = "此操作将永久启用该组织, 是否继续?";
        type = 0;
        msg = "启用";
      }
      let data = {
        id: row.orgId,
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
          api.ableOrg(data).then(function(res) {
            that.initData();
            if (res.status == 1) {
              that.$message({
                type: "success",
                message: msg + "成功!"
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
    //新增组织
    queryBtn() {
      this.OrgTitle = "新增组织";
      this.detailsData = {};
      this.orgId = "";
      this.iSdisabled = false;
      this.detailsVisible = true;
    }
  }
};
</script>

<style lang="less">
.registered-users-page {
}
</style>