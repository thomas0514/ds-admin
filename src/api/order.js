import request from '@/utils/request'
import { formatQueryData } from '@/utils/tool';
const dev = process.env.dev
export default {
  //咨询保单
  getOrderList: (data) => {
    return request({
      url: dev + '/order/service/order/list' + formatQueryData(data),
      method: 'get',
      data
    })
  },
  delayedPeriod: (data) => {
    return request({
      url: dev + '/order/service/days/update',
      method: 'put',
      data
    })
  },
  changeResumer: (data) => {
    return request({
      url: dev + '/order/service/update/expert',
      method: 'put',
      data
    })
  },
  //导出咨询服务订单
  exportServiceExcel: (data) => {
    return request({
      url: dev + '/order/service/excel/service' + formatQueryData(data),
      method: 'get',
      data
    })
  },
  //导出退款订单
  exportRefundExcel: (data) => {
    return request({
      url: dev + '/order/service/excel/refund' + formatQueryData(data),
      method: 'get',
      data
    })
  },
  //退款
  getRefundList: (data) => {
    return request({
      url: dev + '/order/service/refund/list' + formatQueryData(data),
      method: 'get',
      data
    })
  },
  postRefund: (data) => {
    return request({
      url: dev + '/order/service/refund/update',
      method: 'put',
      data
    })
  },
  //保单绑定列表
  getBindList: (data) => {
    return request({
      url: dev + '/order/bind' + formatQueryData(data),
      method: 'get',
      data
    })
  },
  orderRefund: (data) => {
    return request({
      url: dev + '/order/service/refund/add',
      method: 'post',
      data
    })
  },
  //微信客户
  getWxcustomerList: (data) => {
    return request({
      url: dev + '/order/bind/order' + formatQueryData(data),
      method: 'get',
      data
    })
  },
  //保单解绑列表
  getUnBindList: (data) => {
    return request({
      url: dev + '/order/unbind' + formatQueryData(data),
      method: 'get',
      data
    })
  },
  //保单绑定
  orderBind: (data) => {
    return request({
      url: dev + '/order/bind',
      method: 'put',
      data
    })
  },
  //保单解绑
  orderUnBind: (data) => {
    return request({
      url: dev + '/order/unbind',
      method: 'put',
      data
    })
  },
  /** 快保售出保单记录 start*/
  /** 获取列表 */
  getKBaoList: (data) => {
    return request({
      url: dev + '/order/kbao' + formatQueryData(data),
      method: 'get',
      data
    })
  },
  /** 快保售出保单记录 end*/

  /** 核心结算售出保单记录 start*/
  /** 获取列表 */
  getCorePolicyList: (data) => {
    return request({
      url: dev + '/order/core' + formatQueryData(data),
      method: 'get',
      data
    })
  },
  uploadFile: (data) => {
    return request({
      url: dev + '/order/core/upload',
      method: 'post'
    })
  },
  /** 核心结算售出保单记录 end*/


  // 快报导出数据
  exportExcelKbao: (data) => {
    return request({
      url: dev + '/admin/agent/excel' + formatQueryData(data),
      method: 'get'
    })
  },
  // 核心导出数据
  exportExcelCore: (data) => {
    return request({
      url: dev + '/order/core/excel' + formatQueryData(data),
      method: 'get'
    })
  },
  //获得区域
  getHeadAreaList: (data) => {
    return request({
      url: dev + '/comm/policyareas' + formatQueryData(data),
      method: 'get'
    })
  }
}
