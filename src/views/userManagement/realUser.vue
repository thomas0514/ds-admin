<template>
  <div class="app-container registered-users-page">
    <toolbar :toolButtons="toolButtons" @exportExcel="exportExcel"></toolbar>
    <queryConditions
      :dialogFormVisible.sync="dialogFormVisible"
      :queryFormList.sync="queryFormList"
      :queryParams="queryParams"
      @search="initData"
      @resetForm="resetForm"
    ></queryConditions>
    <base-table
      tableTitle="真实客户列表"
      :loading="loading"
      :columns="headers"
      :list="list"
      :total="total"
      :pageNum.sync="tableParam.pageNum"
      :pageSize.sync="tableParam.pageSize"
      @detailsClick="detailsClick"
      @changeAdviser="changeAdviser"
      @changeWechat="changeWechat"
      @toOrder="toOrder"
      @getList="initData"
    ></base-table>
    <el-dialog :visible.sync="detailsVisible" :title="title" width="30%">
      <el-form label-width="100px">
        <el-form-item>
          <el-input v-model="inputInfo" clearable v-if="type=='Wechat'"></el-input>
        </el-form-item>
        <el-form-item label="选择顾问" v-if="type=='Adviser'">
          <el-select v-model="select" placeholder="请选择顾问">
            <el-option
              v-for="(item,index) in adviserList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detailsVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="submit" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { devService } from "@/config/env";
import api from "@/api/index";
import listMixins from "@/mixins/tableList";
import baseTable from "@/components/baseTableUser";
import queryConditions from "@/components/queryConditions";
import toolbar from "@/components/toolbar";

export default {
  name: "realUser",
  mixins: [listMixins],
  components: {
    queryConditions,
    baseTable,
    toolbar
  },
  data() {
    return {
      toolButtons: [
        {
          name: "导出数据",
          operation: "exportExcel",
          icon: "el-icon-download"
        }
      ],
      queryFormList: [
        {
          type: "input",
          name: "nickName",
          label: "微信昵称",
          placeholder: "请输入微信昵称",
          value: ""
        },
        {
          type: "input",
          name: "wxName",
          label: "微信号",
          placeholder: "请输入微信号",
          value: ""
        },
        {
          type: "input",
          name: "phoneNumber",
          label: "手机号",
          placeholder: "请输入手机号",
          value: ""
        },
        {
          type: "input",
          name: "channelName",
          label: "渠道来源",
          placeholder: "请输入渠道来源",
          value: "",
          clearable: true,
          options: []
        },
        {
          type: "input",
          name: "adviserName",
          label: "负责顾问",
          placeholder: "请输入负责顾问",
          value: "",
          clearable: true,
          options: []
        },
        {
          type: "select",
          name: "isInsure",
          label: "是否投保",
          placeholder: "请选择是否投保",
          value: "",
          clearable: true,
          options: [
            {
              label: "是",
              value: "1"
            },
            {
              label: "否",
              value: "0"
            }
          ]
        }
      ],
      headers: [
        {
          key: "avatarUrl",
          title: "微信头像",
          slot: "img",
          hidden: true
        },
        {
          key: "agentId",
          title: "客户ID"
        },
        {
          key: "wxName",
          title: "微信号"
        },
        {
          key: "nickName",
          title: "微信昵称"
        },
        {
          key: "phoneNumber",
          title: "用户手机号"
        },
        {
          key: "channelName",
          title: "渠道来源"
        },
        {
          key: "adviserName",
          title: "负责顾问",
          escape: obj => {
            return obj.adviserName;
          }
        },
        {
          key: "isInsure",
          title: "是否投保",
          escape: obj => {
            return obj.isInsure == 1 ? "是" : "否";
          }
        },
        {
          type: "operate",
          title: "下单数据",
          operates: [
            {
              name: "查看",
              emitKey: "toOrder",
              escape2: obj => {
                return obj.wxId == null || obj.wxId == undefined;
              }
            }
          ]
        },
        {
          type: "operate",
          key: "操作",
          title: "操作",
          width: 200,
          operates: [
            {
              name: "更换顾问",
              key: "adviserName",
              emitKey: "changeAdviser",
              escape: obj => {
                return obj.adviserId == null || obj.adviserId == undefined
                  ? "添加顾问"
                  : "更换顾问";
              }
            },
            {
              name: "更换微信",
              emitKey: "changeWechat",
              escape: obj => {
                return obj.wxId == null || obj.wxId == undefined
                  ? "添加微信"
                  : "更换微信";
              }
            }
          ]
        }
      ],
      detailsData: {},
      detailsVisible: false,
      title: "",

      inputInfo: "",
      select: "",
      type: "",
      adviserList: []
    };
  },
  created() {
    this.initData();
    this.getAdviserList();
  },
  methods: {
    // 初始化数据
    initData(obj) {
      let a = this.$route.query;
      console.log(this.queryParams);
      if (this.$route.query.wxId) {
        this.queryParams.wxId = this.$route.query.wxId;
      } else {
        delete this.queryParams.wxId;
      }
      if (obj && obj.limit) {
        this.tableParam.pageSize = obj.limit;
      }
      this.listSuccessCb("getRealList");
      delete this.queryParams.wxId;
      delete this.$route.query.wxId;
    },
    //重置搜索表单
    resetForm() {
      for (let i = 0; i < this.queryFormList.length; i++) {
        this.queryFormList[i].value = "";
      }
      delete this.queryParams.wxId;
      delete this.$route.query.wxId;

      console.log(this.queryParams, "reseted");
    },
    // 获取顾问列表
    async getAdviserList() {
      let res = await api.getAdviserList();
      res.data.map((item, index) => {
        this.adviserList.push({
          label: item.adviserName,
          value: item.adviserId
        });
      });
    },

    // 详情
    detailsClick(row) {
      this.detailsData = row;
      this.detailsVisible = true;
    },
    // 更换顾问
    changeAdviser(row) {
      this.title = row.adviserId == null ? "添加顾问" : "更换顾问";
      this.type = "Adviser";
      this.detailsData = row;
      this.detailsVisible = true;
      this.select = this.detailsData.adviserName;
    },
    // 更换微信
    changeWechat(row) {
      this.detailsVisible = true;
      this.title = row.wxId == null ? "添加微信" : "更换微信";
      this.inputInfo = row.wxName;
      this.type = "Wechat";
      this.detailsData = row;
      console.log(row.wxName);
      console.log(this.inputInfo);
    },
    //跳转至咨询服务订单页，显示这个人对应的下单数据
    toOrder(row) {
      let unionId = row.unionId;
      this.$router.push({
        path: "/orderManagement/service",
        query: {
          unionId
        }
      });
    },
    async submit() {
      let result = "";
      let _this = this;
      if (this.type == "Wechat") {
        console.log(this.detailsData.wxName);
        console.log(_this.inputInfo);
        console.log(_this.detailsData.wxId);

        // debugger;
        if (_this.detailsData.wxId) {
          //更换
          // if (_this.detailsData.wxName == _this.input) {
          //   alert("未修改");
          //   return;
          // }
          result = await api.changeWxName({
            oldWxName: _this.detailsData.wxName,
            newWxName: _this.inputInfo
          });
        } else {
          //新增
          result = await api.addWxName({
            unionId: _this.detailsData.unionId,
            wxName: _this.inputInfo
          });
        }
      } else {
        console.log(this.detailsData.adviserName, 3333);

        console.log(this.adviserList, 222);
        console.log(this.select, 222);
        let name = "";
        for (const item of this.adviserList) {
          // debugger;
          if (_this.select == item.value) {
            name = item.label;
            break;
          }
        }
        let data = {
          adviserId: _this.select,
          adviserName: name,
          unionId: _this.detailsData.unionId
        };
        //更换
        //新增
        if (this.detailsData.adviserId) {
          result = await api.changeAdviser(data);
        } else {
          result = await api.addAdviser(data);
        }
      }

      this.$message.success("操作成功");
      this.detailsVisible = false;
      this.initData();
    },
    // 导出数据
    exportExcel() {
      // this.exportExcelCb(`${devService}/customer/real/excel`);
      this.exportExcelCb("exportExcelRealUser");
    }
  }
};
</script>

<style lang="less">
</style>