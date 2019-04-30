import request from '@/utils/request'
import { formatQueryData } from '@/utils/tool';
export const dev = process.env.dev

//上传用户
export default {

  uploadTempUser: (data) => {
    return request({
      url: dev + '/customer/temp/uploadData',
      method: 'post',
      data
    })
  },

  //渠道列表
  getChannelList: (data) => {
    return request({
      url: dev + '/channel/getChannelNames' + formatQueryData(data),
      method: 'get',
      data
    })
  },

  //真实用户
  /** 获取真实客户列表*/
  getRealList: (data) => {
    return request({
      url: dev + '/customer/real/page' + formatQueryData(data),
      method: 'get',
      data
    })
  },

  /** 更换顾问接口*/
  changeAdviser: (data) => {
    return request({
      url: dev + '/customer/real/changeAdviser' + formatQueryData(data),
      method: 'put',
      data
    })
  },

  /** 新增顾问接口*/
  addAdviser: (data) => {
    return request({
      url: dev + '/customer/real/changeAdviser' + formatQueryData(data),
      method: 'put',
      data
    })
  },

  /** 更换微信接口*/
  changeWxName: (data) => {
    return request({
      url: dev + '/customer/real/changeWxName' + formatQueryData(data),
      method: 'put',
      data
    })
  },

  /** 新增微信接口*/
  addWxName: (data) => {
    return request({
      url: dev + '/customer/real/addWxName' + formatQueryData(data),
      method: 'put',
      data
    })
  },

  /** 获取顾问列表   与下面的获取顾问重复 不用 2019年4月11日17点38分
   * 下面的重复获取顾问的不用
  */
  getAdviserList: (data) => {
    return request({
      url: dev + '/user/info/adviser/list' + formatQueryData(data),
      method: 'get',
      data
    })
  },

  /** 获取真实客户下单数据*/
  getUserPolicyInfo: (data) => {
    return request({
      url: dev + '/customer/real/showOne' + formatQueryData(data),
      method: 'get',
      data
    })
  },

  /** 公共信息 */
  //专家列表
  getExpertList: (data) => {
    return request({
      url: dev + '/user/info/expert/list',
      method: 'get'
    })
  },
  //小助手列表
  getAideList: (data) => {
    return request({
      url: dev + '/user/info/aide/list',
      method: 'get'
    })
  },
  //顾问列表
  getAdviserList2: (data) => {
    return request({
      url: dev + '/user/info/adviser/list',
      method: 'get'
    })
  },

  //代理人列表
  getAgentList: (data) => {
    return request({
      url: dev + '/comm/agentlist',
      method: 'get'
    })
  },
  // 潜在用户查询
  potentialUsers: (data) => {
    return request({
      url: dev + '/customer/temp/page' + formatQueryData(data),
      method: 'get'
    })
  },
  exportExcel: (data) => {
    return request({
      url: dev + '/customer/temp/excel' + formatQueryData(data),
      method: 'get'
    })
  },
  exportExcelRealUser: (data) => {
    return request({
      url: dev + '/customer/real/excel' + formatQueryData(data),
      method: 'get'
    })
  },
  // 潜在用户上传错误导出数据
  exportExceltempUser: (data) => {
    return request({
      url: dev + '/customer/temp/getFailDataExcel' + formatQueryData(data),
      method: 'get'
    })
  },
  //近期消息列表
  getUserMessage: (data) => {
    return request({
      url: dev + '/comm/message/list',
      method: 'get'
    })
  },
  //修改消息状态
  changeUserMessageStatus: (data) => {
    return request({
      url: dev + '/comm/message/see',
      method: 'put',
      data
    })
  }

}
