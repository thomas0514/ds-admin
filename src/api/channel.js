import request from '@/utils/request'
import { formatQueryData } from '@/utils/tool';
const dev = process.env.dev

export default {
  //渠道更新
  channelUpdate: (data) => {
    return request({
      url: dev + '/channel/update' + formatQueryData(data),
      method: 'put',
      data
    })
  },

  //渠道添加
  channelAdd: (data) => {
    return request({
      url: dev + '/channel/save',
      method: 'post',
      data
    })
  },

  //渠道链接明细列表
  getChannelDetail: (data) => {
    return request({
      url: dev + '/channel/page' + formatQueryData(data),
      method: 'get',
      data
    })
  },

  //渠道状态
  getChannelStatus: (data) => {
    return request({
      url: dev + '/channel/getChannelStatus' + formatQueryData(data),
      method: 'get',
      data
    })
  },

  // 用户名称列表
  getChannelList: (data) => {
    return request({
      url: dev + '/channel/getChannelNames' + formatQueryData(data),
      method: 'get',
      data
    })
  },

  // 更换微信
  changeWechat: (data) => {
    return request({
      url: dev + '//channel/changeWx' + formatQueryData(data),
      method: 'put',
      data
    })
  }
}
