/*
 * @Author: wuhao
 * @Date: 2018-12-17 13:40:47
 * @LastEditors: wuhao
 * @LastEditTime: 2019-02-20 11:38:05
 * @Description: table列表页面中使用到多次复用的mixins
 */
import api from "@/api/index";
import { parseTime } from "@/utils";

let listMixins = {
  data() {
    return {
      loading: false, // 伴随loading状态
      dialogFormVisible: false, // 查询条件dialog
      tableParam: {
        pageNum: 1, // 页码
        pageSize: 10 // 页长
      },
      total: 0, // 总个数
      list: [],
      isFirst: true // 是否第一次执行搜索或者需要对时间字段进行再次处理
    }
  },
  methods: {
    /**
     * 表格数据请求成功的回调
     * @param apiName {string}
     * @returns {*}
     */
    async listSuccessCb(apiName) {
      this.dialogFormVisible = false;
      this.loading = true;
      // 主流程和子流程的处理
      for (var p in this.queryParams) {
        if (p == 'subProcessCode' && this.queryParams[p] != '') {
          let subProcessCodeArray = this.queryParams[p]
          console.log(typeof subProcessCodeArray)
          if (typeof subProcessCodeArray == 'object') {
            if (subProcessCodeArray.length > 1) {
              this.queryParams[p] = this.queryParams[p].slice(',')[1]
            } else {
              this.queryParams[p] = this.queryParams[p].slice(',')[0]
            }
          }
        } else if (p == 'startTime' && this.queryParams[p] != '' && this.queryParams[p] != null) {
          if (this.queryParams['endTime'] == '' || this.queryParams['endTime'] == undefined) {
            let times = this.queryParams[p];
            this.queryParams[p] = parseTime(times[0])
            this.queryParams['endTime'] = parseTime(times[1])
          }
        } else if (p == 'startTime') {
          if (this.queryParams[p] && this.isFirst) {
            this.isFirst = false;
            let times = this.queryParams[p]
            this.queryParams[p] = parseTime(times[0])
            this.queryParams['endTime'] = parseTime(times[1])
          }
          if (this.queryParams['startTime'] == '' || this.queryParams['startTime'] == undefined) {
            this.queryParams['startTime'] = '';
            this.queryParams['endTime'] = '';
          }
        } else if (p == 'insureStartDate' || p == 'insureEndDate') { // 快保售出保单专用
          if (this.queryParams[p] && this.isFirst) {
            let time = [];
            time[0] = parseTime(this.queryParams[p][0], "{y}-{m}-{d}");
            time[1] = parseTime(this.queryParams[p][1], "{y}-{m}-{d}");
            this.queryParams[p] = time;
          }
          if (p == 'insureEndDate' || this.queryParams['insureEndDate'] == '') {
            this.isFirst = false;
          }
        } else if (p == "startDay") {
          for (let j in this.queryFormList) {
            if (this.queryFormList[j].type == "doubleinput") {
              this.queryParams['startDay'] = this.queryFormList[j].options[0] || ""
              this.queryParams['endDay'] = this.queryFormList[j].options[1] || ""
            }
          }
        }
      }
      let unionId = this.$route.query.unionId;
      if (unionId != "" && unionId != undefined && unionId != null) {
        this.queryParams['unionId'] = unionId;
      }
      let params = Object.assign(this.queryParams || {}, this.tableParam)
      let res = await api[apiName](params);
      let tableList = res.data
      this.list = tableList
      this.total = res.page.total;
      this.loading = false;
    },
    /**
     * 处理异常情况
     * ==> 简单处理  仅仅是对表格处理为空以及取消loading
     */
    listExceptionCb(error) {
      this.loading = false
      console.error(error)
    },

    /**
     * @msg: 导出数据excel
     * @param path {string}
     * @return:
     */
    async exportExcelCb(apiName) {
      if (!this.list || this.list.length == 0) {
        this.$message({
          message: '暂无数据，无法导出哦',
          type: 'warning'
        });
        return;
      }

      let params = Object.assign(this.tableParam, this.queryParams || {})
      let res = await api[apiName](params);
      if (res.status == 1) {
        window.location.href = res.data.strData;
      } else {
        this.$message.error(res.msg)
      }
    },

    /**
     * @msg: 无分页时数据处理
     * @param apiName {string}
     * @return:
     */
    async notPageListSuccessCb(apiName) {
      this.dialogFormVisible = false;
      this.loading = true;
      let params = this.queryParams;
      let res = await api[apiName](params);
      this.list = res.data.list;
      this.loading = false;
    },

    // 查询条件
    queryBtn() {
      this.dialogFormVisible = true;
    },
    // 重置搜索表单
    resetForm(obj) {
      for (let key in obj) {
        for (let item of this.queryFormList) {
          if (item.name == key) {
            item.value = obj[key];
          }
        }
      }
    }

  },
  created() {
    console.log(`list mixin creatd`)
  },
  computed: {
    queryParams() {
      let tempObj = {};
      for (let item of this.queryFormList) {
        tempObj[item.name] = item.value;
        let timeKeyArr = ['insureStartDate', 'insureEndDate'];
        if (timeKeyArr.indexOf(item.name) > -1) {
          this.isFirst = true;
        }
      }
      return tempObj;
    }
  }
}
export default listMixins
