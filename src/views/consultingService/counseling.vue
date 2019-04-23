<template>
  <div class="app-container user-feedback-page">
    <queryConditions
      :dialogFormVisible.sync="dialogFormVisible"
      :queryFormList.sync="queryFormList"
      :queryParams="queryParams"
      @search="initData"
      @resetForm="resetForm"
    ></queryConditions>
    <base-table
      tableTitle="咨询服务列表"
      :loading="loading"
      :columns="headers"
      :list="list"
      :total="total"
      :pageNum.sync="tableParam.pageNum"
      :pageSize.sync="tableParam.pageSize"
      @detailsClick="detailsClick"
      @getList="initData"
    ></base-table>
  </div>
</template>

<script>
import api from "@/api/index";
import listMixins from "@/mixins/tableList";
import baseTable from "@/components/baseTable";
import queryConditions from "@/components/queryConditions";
import toolButtons from "@/components/toolbar";

export default {
  name: "counseling",
  mixins: [listMixins],
  components: {
    queryConditions,
    baseTable
  },
  data() {
    return {
      experList: [],
      queryFormList: [
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
          name: "customerName",
          label: "姓名",
          placeholder: "请输入姓名",
          value: ""
        },
        {
          type: "select",
          name: "isInsure",
          label: "是否投保",
          placeholder: "请选择状态",
          value: "",
          options: [
            {
              label: "是",
              value: 1
            },
            {
              label: "否",
              value: 0
            }
          ]
        },
        {
          type: "select",
          name: "expertId",
          label: "专家",
          placeholder: "请输入专家",
          value: "",
          options: []
        },
        {
          type: "cascader",
          name: "subProcessCode",
          label: "流程阶段",
          placeholder: "请选择流程阶段",
          value: [],
          options: [
            {
              value: "100",
              label: "购买服务",
              children: [
                {
                  value: "101",
                  label: "购买服务"
                }
              ]
            },
            {
              value: "200",
              label: "填写问卷",
              children: [
                {
                  value: "201",
                  label: "待填写问卷"
                },
                {
                  value: "202",
                  label: "待选择时间"
                }
              ]
            },
            {
              value: "300",
              label: "匹配专家",
              children: [
                {
                  value: "301",
                  label: "已匹配专家"
                }
              ]
            },
            {
              value: "400",
              label: "初次沟通",
              children: [
                {
                  value: "401",
                  label: "待初次沟通"
                },
                {
                  value: "403",
                  label: "初次沟通环节"
                }
              ]
            },
            {
              value: "500",
              label: "方案设计",
              children: [
                {
                  value: "501",
                  label: "待出具方案"
                },
                {
                  value: "502",
                  label: "待发送方案"
                },
                {
                  value: "503",
                  label: "待沟通方案"
                },
                {
                  value: "504",
                  label: "方案沟通环节"
                },
                {
                  value: "506",
                  label: "待修改方案"
                },
                {
                  value: "507",
                  label: "待发送方案"
                }
              ]
            },
            {
              value: "600",
              label: "完成评价",
              children: [
                {
                  value: "601",
                  label: "方案满意"
                }
              ]
            },
            {
              value: "700",
              label: "品质回访",
              children: [
                {
                  value: "701",
                  label: "电话回访环节"
                },
                {
                  value: "704",
                  label: "已完成回访"
                }
              ]
            }
          ]
        },
        {
          type: "datetimerange",
          name: "startTime",
          label: "请选择日期",
          placeholder: "请选择日期",
          value: "",
          clearable: true,
          options: []
        }
      ],
      headers: [
        {
          key: "serviceOrderId",
          title: "订单ID"
        },
        {
          key: "orderDate",
          title: "订单时间"
        },
        {
          key: "wxName",
          title: "微信号"
        },
        {
          key: "customerName",
          title: "客户姓名"
        },
        {
          key: "phoneNumber",
          title: "手机号"
        },
        {
          key: "adviserName",
          title: "顾问"
        },
        {
          key: "expertName",
          title: "专家"
        },
        {
          key: "aideName",
          title: "小助手"
        },
        {
          key: "communicateTime",
          title: "下次沟通时间"
        },
        {
          key: "insureStatus",
          title: "是否投保",
          escape: row => {
            return row.isInsure == 0 ? "未" : "已投保";
          }
        },
        {
          key: "mainProcessCodeText",
          title: "主流程阶段"
        },
        {
          key: "subProcessCodeText",
          title: "子流程阶段"
        },
        {
          type: "operate",
          title: "操作",
          operates: [
            {
              name: "详情",
              key: "configure",
              emitKey: "detailsClick"
            }
          ]
        }
      ]
    };
  },
  created() {
    this.initData();
    this.getExperList();
  },
  methods: {
    // 初始化数据
    async initData(obj) {
      if (obj && obj.limit) {
        this.tableParam.pageSize = obj.limit;
      }
      this.listSuccessCb("getProcessOrderList");
    },
    //重置搜索表单
    resetForm() {
      for (let i = 0; i < this.queryFormList.length; i++) {
        if (this.queryFormList[i].name == "subProcessCode") {
          this.queryFormList[i].value = [];
        } else {
          this.queryFormList[i].value = "";
        }
      }
    },
    async getExperList() {
      let queryFormList = this.queryFormList;
      let newList = [];
      let result = await api.getExperList();
      if (result.data) {
        let list = result.data;
        for (let i = 0; i < list.length; i++) {
          newList.push({
            label: list[i].expertName,
            value: list[i].expertId
          });
        }
        this.experList = newList;
      }
      for (let i = 0; i < queryFormList.length; i++) {
        if (queryFormList[i].name == "expertId") {
          queryFormList[i].options = newList;
        }
      }
    },
    async detailsClick(row) {
      this.$router.push({
        path: "processManagement",
        query: {
          id: row.serviceOrderId
        }
      });
    }
  }
};
</script>

<style lang="less">
.user-feedback-page {
  .img-box {
    width: 500px;
    display: inline-block;
    vertical-align: top;
    img {
      margin-right: 10px;
    }
  }
}
</style>