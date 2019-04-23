<!--
 * @Author: wuhao
 * @Date: 2018-12-17 16:47:14
 * @LastEditors: wuhao
 * @LastEditTime: 2019-01-08 16:43:57
 * @Description: 封装 详情页
 -->
<template>
  <div :class="{'hidden':hidden}" class="base-details-container">
    <el-dialog width="700px" :title="title" :visible.sync="detailsVisibleSync">
      <div class="userDetails">
        <template v-for="(item,index) in detailsOptions">
          <div v-if="!item.hidden" :key="index" class="user-item">
            <div class="user-tit">{{item.label}}</div>
            <div class="user-text">
              <!-- 可写处理字符串函数 @param: Object   @return: Sring -->
              {{item.escape !== undefined?item.escape(detailsObj):detailsObj[item.key]}}
            </div>
          </div>
          <div v-if="item.slot" :key="index" class="user-item">
            <div class="user-tit">{{item.label}}</div>
            <!-- 具名slot -->
            <slot class="user-text" v-if="item.slot" :name="item.slot" :scope="item.key"></slot>
          </div>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "baseDetails",
  props: {
    hidden: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: "详情"
    },
    detailsVisible: {
      type: Boolean,
      default: false
    },
    detailsOptions: {
      type: Array,
      default: () => []
    },
    detailsObj: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    detailsVisibleSync: {
      get() {
        return this.detailsVisible;
      },
      set(val) {
        this.$emit("update:detailsVisible", val);
      }
    }
  },
  methods: {}
};
</script>

<style scoped lang="less">
.base-details-container {
  .userDetails {
    .user-item {
      padding-top: 10px;
      border-bottom: 1px #ccc solid;
      padding-bottom: 10px;
    }
    .user-tit {
      display: inline-block;
      font-weight: bold;
      width: 120px;
    }
    .user-text {
      width: 530px;
      display: inline-block;
      vertical-align: top;
    }
  }
}
.base-details-container.hidden {
  display: none;
}
</style>
