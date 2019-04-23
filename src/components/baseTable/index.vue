<!--
 * @Author: wuhao
 * @Date: 2018-12-20 09:47:02
 * @LastEditors: wuhao
 * @LastEditTime: 2018-12-27 16:08:11
 * @Description: 封装el-table
 -->

<template>
  <div class="base-table-container">
    <el-row>
      <el-col :span="24">
        <slot name="button-slot"></slot>
        <el-button
          v-if="showExportBtn"
          icon="el-icon-download"
          size="small"
          @click.native="exportExcel"
          class="btn"
          type="primary"
        >导出数据</el-button>
        <div v-if="tableTitle" class="table-title">
          {{tableTitle}}
          <span>（总记录 {{total}} ）</span>
        </div>
        <el-table
          v-loading="loading"
          :data="list"
          border=""
          size="small"
          @selection-change="handleSelectionChange"
          :max-height="tableHeight"
          v-bind="$attrs"
        >
          <!--   -->
          <template v-for="(column, index) in columns">
            <slot name="front-slot"></slot>
            <!-- 序号 -->
            <el-table-column
              :key="index"
              v-if="column.type === 'selection'"
              label="全选"
              type="selection"
              width="55"
              align="center"
            ></el-table-column>
            <!-- 复选框 -->
            <el-table-column
              :key="index"
              v-else-if="column.type === 'index'"
              type="index"
              :index="continuousIndex"
              width="60"
              label="序号"
              align="center"
            ></el-table-column>
            <!-- 具体内容 -->
            <el-table-column
              :key="index"
              v-else
              align="center"
              :label="column.title"
              :width="column.width"
              :show-overflow-tooltip="column.showOverflowTooltip"
            >
              <template slot-scope="scope">
                <!-- 仅仅显示文字 -->
                <label v-if="!column.hidden">
                  <!-- 如果hidden为true的时候 那么当前格可以不显示，可以选择显示自定义的slot-->
                  <!-- 操作按钮 -->
                  <label v-if="column.type === 'operate'">
                    <el-button
                      v-for="(operate, index) in column.operates"
                      :key="index"
                      :disabled="operate.escape !== undefined?operate.escape(scope.row).disabled:false"
                      @click="handleClick(operate, scope.row)"
                      type="text"
                      size="small"
                    >{{operate.escape !== undefined?operate.escape(scope.row).text:operate.name}}</el-button>
                  </label>
                  <!-- 文字内容 可转码 -->
                  <span
                    v-else
                  >{{column.escape !== undefined?column.escape(scope.row):scope.row[column.key]}}</span>
                </label>
                <!-- 使用slot的情况下 -->
                <label v-if="column.slot">
                  <!-- 具名slot -->
                  <slot v-if="column.slot" :name="column.slot" :scope="scope"></slot>
                </label>
              </template>
            </el-table-column>
          </template>
          <!--默认的slot -->
          <slot></slot>
        </el-table>
        <pagination
          v-if="paginationShow"
          :total="total"
          :page.sync="currentPage"
          :limit.sync="pageSizes"
          :auto-scroll="false"
          @pagination="getList"
        ></pagination>
      </el-col>
    </el-row>
  </div>
</template>


<script>
/**
 * @author wuhao
 * @todo 项目中基本使用表格
 * @property
 * list => 表格数据
 * columns: [ ==> 配置表格头
 *  key: => 渲染字段名称
 *  title: => 表头名称
 *  operates： => 操作数组 [
 *      name: 名称
 *      emitKey: 要emit出去的事件
 *  ]
 * ]
 * demo columns
 * headers: [
        { type: 'selection'},
        { type: 'index'},
        { key: 'loginName', title: 'XXX'，escape: row => { return row.state == 0? "发送": "已领取"} },   <!-- escape字段可写转码函数 -->
        { key: 'userName', title: 'XXX' },
        { key: 'roleName', title: 'XXX', hidden: true, slot: 'roleSlot' },
        { key: 'createDate', title: 'XXX' },
        // operate 这一行可以选择直接使用slot或者是使用配置项
        { type: 'operate', title: 'XXX',
          operates: [
            { name: 'XXX', emitKey: 'reset' },
            { name: 'XXX', emitKey: 'edit' },
            { name: 'XXX', emitKey: 'delete' }
        ] }
      ]
 */

import Pagination from "@/components/Pagination";
import { getClientHeight } from "@/utils";

export default {
  name: "base-table",
  components: { Pagination },
  props: {
    // 核心数据
    list: {
      type: Array,
      default: () => []
    },
    // columns
    columns: {
      type: Array,
      required: true,
      default: () => []
    },
    tableTitle: {
      type: String,
      default: ""
    },
    showExportBtn: {
      type: Boolean,
      default: false
    },
    paginationShow: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: true
    },
    total: {
      type: Number,
      default: 0
    },
    pageNum: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      tableHeight: 400
    };
  },
  computed: {
    currentPage: {
      get() {
        return this.pageNum;
      },
      set(val) {
        this.$emit("update:pageNum", val);
      }
    },
    pageSizes: {
      get() {
        return this.pageSize;
      },
      set(val) {
        this.$emit("update:pageSize", val);
      }
    }
  },
  methods: {
    // 让index序号连续
    continuousIndex(index) {
      return index + (this.currentPage - 1) * this.pageSizes + 1;
    },
    // 导出excel
    exportExcel() {
      this.$emit("exportExcel");
    },
    // 页码变化触发获取数据
    getList(obj) {
      this.$emit("getList", obj);
    },
    // 处理点击事件
    handleClick(action, data) {
      // emit事件
      this.$emit(`${action.emitKey}`, data);
    },
    // 选中变化
    handleSelectionChange(val) {
      this.$emit("changeSelect", val);
    }
  }
};
</script>

<style scoped lang="less">
.base-table-container {
  background: #fff;
  padding: 18px 0px 0;
  .table-title {
    display: flex;
    align-items: center;
    background: #d3dce6;
    height: 36px;
    padding-left: 20px;
    font-size: 14px;
    span {
      margin-left: 20px;
      font-size: 12px;
      color: #666;
    }
  }
}
.base-table-container.hidden {
  display: none;
}

.btn {
  margin: 0 0 20px 100%;
  transform: translateX(-100%);
}

.pagination-container {
  padding: 14px 0 0 0;
}
</style>