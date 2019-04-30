import request from '@/utils/request'
import {
  formatQueryData
} from '@/utils/tool';
const dev = process.env.dev
export default {
  /**
   * 优惠券发放记录查询
   */
  getCouponRecordList: (data) => {
    return request({
      url: dev + '/coupon/record/list' + formatQueryData(data),
      method: 'get',
      data
    })
  },
  /**
   * 优惠券发放
   */
  postCoupon: (data) => {
      return request({
        url:dev+'/coupon/give/add',
        method:'post',
        data
      })
  },

  /**
   * 优惠券excel导出
   */
  exportCouponExcel:(data) =>{
      return request({
        url:dev+'/coupon/record/excel'+formatQueryData(data),
        method:'get',
        data
      })
  }
}