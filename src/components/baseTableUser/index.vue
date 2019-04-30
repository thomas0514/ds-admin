<!--
 * @Author: wuhao
 * @Date: 2018-12-20 09:47:02
 * @LastEditors: wuhao
 * @LastEditTime: 2019-02-21 14:30:53
 * @Description: 封装el-table
 * @Description: 在原来的上面做二次修改 2019年4月8日 09点29分
 -->

<template>
  <div class="base-table-container">
    <el-row>
      <el-col :span="24">
        <div class="table-title-head">
          <div v-if="tableTitle" class="table-title">
            {{tableTitle}}
            <span>（总记录 {{total}} ）</span>
          </div>
        </div>
        <el-table
          v-loading="loading"
          :data="list"
          border
          size="small"
          :header-row-style="{'font-size':'14px'}"
          @selection-change="handleSelectionChange"
          :max-height="tableHeight"
          ref="table"
          v-bind="$attrs"
        >
          <!--   -->
          <template v-for="(column, index) in columns">
            <slot name="front-slot"></slot>
            <!-- 序号 -->
            <el-table-column
              :key="index"
              v-if="column.type === 'selection'"
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
                  <!-- 操作按钮 当escape2存在时 表示按钮的点击权限需要从前台动态控制，escape2 返回值为Boolean，默认false  -->
                  <label v-if="column.type === 'operate'">
                    <el-button
                      v-for="(operate, index) in column.operates"
                      :key="index"
                      :disabled="operate.escape2 !== undefined?operate.escape2(scope.row):false"
                      @click="handleClick(operate, scope.row)"
                      type="text"
                      size="small"
                    >{{operate.escape !== undefined?operate.escape(scope.row):operate.name}}</el-button>
                  </label>
                  <!-- 文字内容 可转码 -->
                  <span
                    v-else
                  >{{column.escape !== undefined?column.escape(scope.row):scope.row[column.key]}}</span>
                </label>
                <!-- 使用slot的情况下 -->
                <label v-if="column.slot">
                  <!-- 具名slot -->
                  <slot v-if="!column.slot" :name="column.slot" :scope="scope"></slot>
                </label>
                <!--img-->
                <img
                  v-if="column.slot=='img' && !column.extra"
                  :src="scope.row[column.key]?scope.row[column.key]:'/static/avatar.png'"
                  style="width:50px;height:50px;border-radius:50%"
                >
                <!--img2为渠道页面专用-->
                <el-popover
                  trigger="hover"
                  placement="right"
                  v-if="column.slot=='img2' && !column.extra"
                >
                  <img
                    :src="scope.row[column.key]?scope.row[column.key]:'/static/noimg.png'"
                    style="width:200px;height:200px;"
                  >
                  <p style="text-align:center">{{scope.row.channelName}}</p>
                  <div>
                     <el-button size="small" @click="handleClickBtn('copyChannelUrl', scope.row)" type="primary">复制链接</el-button>
                     <el-button size="small" style="margin-left:20px" @click="handleClickBtn('loadewm', scope.row)"  type="primary">下载二维码</el-button>
                  </div>
                  <div slot="reference" class="name-wrapper">
                    <img
                      v-if="column.slot=='img2'"
                      :src="scope.row[column.key]?scope.row[column.key]:'/static/noimg.png'"
                      style="width:50px;height:50px;"
                    >
                    <!-- img+鼠标滑动展示大图  end -->
                  </div>
                </el-popover>
                <!-- img+鼠标滑动展示大图  图片地址及大图中的内容都是固定的 后期需要再优化 -->
                <el-popover trigger="hover" placement="right" v-if="column.extra">
                  <div style="display:flex; justify-content: space-between;">
                    <img
                      :src="scope.row.avatarUrl?scope.row.avatarUrl:'/static/avatar.png'"
                      style="width:150px;height:150px;border-radius:50%"
                    >
                    <div style="margin:auto 5px">
                      <p>姓名：{{scope.row.nickName}}</p>
                      <p>备注：{{scope.row.remarkName}}</p>
                      <p>性别：{{scope.row.gender == 1 ? "男" : scope.row.gender == 2 ? "女" : "未知"}}</p>
                      <!-- <p>column：{{column}}+'scope.row:'+{{scope.row}}</p> -->
                    </div>
                  </div>
                  <div slot="reference" class="name-wrapper">
                    <img
                      v-if="column.slot=='img'"
                      :src="scope.row[column.key]?scope.row[column.key]:'/static/avatar.png'"
                      style="width:50px;height:50px;border-radius:50%"
                    >
                    <!-- img+鼠标滑动展示大图  end -->
                  </div>
                </el-popover>
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
 * @todo 项目中基本使用表格分页
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
      default: 0
    },
    pageSize: {
      type: Number,
      default: 0
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
    // 页码变化触发获取数据
    getList(obj) {
      this.$emit("getList", obj);
    },
    // 处理点击事件
    handleClick(action, data) {
      // emit事件
      this.$emit(`${action.emitKey}`, data);
    },
    // 处理点击事件
    handleClickBtn(action, data) {
      // emit事件
      this.$emit(`${action}`, data);
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
  padding: 10px 0px 0;
  .table-title {
    display: flex;
    align-items: center;
    background: #d3dce6;
    height: 36px;
    padding: 0 20px;
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

.pagination-container {
  padding: 14px 0 0 0;
}
</style>