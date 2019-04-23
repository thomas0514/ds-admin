/*
 * @Author: wuhao
 * @Date: 2018-12-17 13:40:47
 * @LastEditors: wuhao
 * @LastEditTime: 2019-02-20 11:38:05
 * @Description: table列表页面中使用到多次复用的mixins
 */
import api from "@/api/index";

const listMixins = {
  data() {
    return {
      loading: false, // 伴随loading状态
      dialogFormVisible: false, // 查询条件dialog
      tableParam: {
        pageNum: 1, // 页码
        pageSize: 10, // 页长
      },
      total: 0, // 总个数
      list: []
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
      let params = Object.assign(this.tableParam, this.queryParams || {});
      let res = await api[apiName](params);
      let tableList = res.data
      var length = this.headers.length-1
      for(var i = 0; i<res.data.length;i++){
          if(res.data[i].isLock==0){
            this.headers[length].operates=[
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
          }else{
            debugger
            this.headers[length].operates=[
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
                    name: "启用",
                    emitKey: "ableOrg"
                }
            ]
          }
      }
      console.log(this.headers[length].operates,123345)
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
    exportExcelCb(path) {
      if (!this.list || this.list.length == 0) {
        this.$message({
          message: '暂无数据，无法导出哦',
          type: 'warning'
        });
        return;
      }

      let requestParams = "";
      for (let key in this.queryParams) {
        requestParams += `${key}=${this.queryParams[key]}&`
      }
      requestParams = requestParams.slice(0, requestParams.lastIndexOf('&'))
      window.location.href = `${path}?${requestParams}`;
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
      }
      return tempObj;
    }
  }
}
export default listMixins
