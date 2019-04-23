import request from '@/utils/request'
import { formatQueryData } from '@/utils/tool';
const dev = process.env.dev

export default {
  // 获取险种的产品
  getPlanProductList: (data) => {
    return request({
      url: dev + '/service/plan/product/list?areaId=' + data.areaId + '&productType=' + data.productType,
      method: 'get',
      data
    })
  },
  //可销售区域列表
  getAreaList: (data) => {
    return request({
      url: dev + '/area/areaList',
      method: 'get',
      data
    })
  },
  //根据订单Id查询客户需求
  getCustomerInfoByOrderId: (data) => {
    return request({
      url: dev + '/service/plan/require?orderId=' + data.orderId,
      method: 'get',
      data
    })
  },
  //暂存原始计划
  saveCustomerPlan: (data) => {
    return request({
      url: dev + "/service/plan/temp",
      method: 'post',
      data
    })
  },
  //发送方案给客户(订单Id)
  updateCustomerPlan: (data) => {
    return request({
      url: dev + "/service/plan/sendPlan",
      method: 'post',
      data
    })
  },
  //根据订单Id查询原始方案
  getCustomerPlan: (data) => {
    return request({
      url: dev + "/service/plan/temp?orderId=" + data.orderId,
      method: 'get',
      data
    })
  },
  //方案订单列表
  getCustomerOrderList: (data) => {
    return request({
      url: dev + "/service/plan/page" + formatQueryData(data),
      method: 'get'
    })
  },
  //专家列表
  getExperList: (data) => {
    return request({
      url: dev + "/user/info/expert/list",
      method: 'get',
      data
    })
  },
  //获取产品Url
  getProductUrl: (data) => {
    return request({
      url: dev + "/comm/productUrl" + formatQueryData(data),
      method: 'get',
      data
    })
  }


}
