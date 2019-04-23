import request from '@/utils/request'
import { formatQueryData } from '@/utils/tool';
const dev = process.env.dev

export default {
  //客户保险咨询需求问卷
  getConsultingAnswer: (data) => {
    return request({
      url: dev + '/service/process/question/answer?serviceOrderId=' + data.serviceOrderId,
      method: 'get',
      data
    })
  },
  //投被保人资料问卷记录
  getInsureAnswer: (data) => {
    return request({
      url: dev + '/service/insure/question/answer?serviceOrderId=' + data.serviceOrderId,
      method: 'get',
      data
    })
  },
  //查询投保需求单
  getInsureList: (data) => {
    return request({
      url: dev + '/service/insure/page' + formatQueryData(data),
      method: 'get',
      data
    })
  },
  //咨询服务进程管理快捷入口
  getProcessManger: (data) => {
    return request({
      url: dev + '/service/process/manger?serviceOrderId=' + data.serviceOrderId,
      method: 'get',
      data
    })
  },
  //分页查询进程订单
  getProcessOrderList: (data) => {
    return request({
      url: dev + '/service/process/order' + formatQueryData(data),
      method: 'get',
      data
    })
  },
  //查询日历
  getdayslist: (data) => {
    return request({
      url: dev + '/service/aideselect/days/list',
      method: 'get',
      data
    })
  },
  //根据dayId查询当天小助手情况
  getAideworklist: (data) => {
    return request({
      url: dev + '/service/aideselect/aidework/list?dayId=' + data.dayId,
      method: 'get',
      data
    })
  },
  //录入修改保险需求单
  changeInsuranceDemand: (data) => {
    return request({
      url: dev + '/service/insure/require',
      method: 'post',
      data
    })
  },
  //咨询服务沟通进度
  getProcessTime: (data) => {
    return request({
      url: dev + '/service/process/history/remarks?serviceOrderId=' + data.serviceOrderId,
      method: 'get',
      data
    })
  },
  //录入客户需求单
  createProcessRequire: (data) => {
    return request({
      url: dev + '/service/process/require',
      method: 'post',
      data
    })
  },
  //修改客户需求单
  editProcessRequire: (data) => {
    return request({
      url: dev + '/service/process/require',
      method: 'put',
      data
    })
  },
  //查询客户需求单
  getProcessRequire: (data) => {
    return request({
      url: dev + '/service/process/require?serviceOrderId=' + data.serviceOrderId,
      method: 'get',
      data
    })
  },
  //生成方案二维码
  createQrcode: (data) => {
    return request({
      url: dev + '/service/plan/qrcode?orderId=' + data.orderId,
      method: 'get',
      data
    })
  },
  //投被保人资料问卷二维码
  createInsureQrcode: (data) => {
    return request({
      url: dev + '/service/insure/qrcode',
      method: 'get',
      data
    })
  },
  //查询全部流程
  getAllProcess: (data) => {
    return request({
      url: dev + '/service/process/all?serviceOrderId=' + data.serviceOrderId,
      method: 'get',
      data
    })
  },
  //根据订单id投保需求信息
  getInsureOne: (data) => {
    return request({
      url: dev + '/service/insure/one?serviceOrderId=' + data.serviceOrderId,
      method: 'get',
      data
    })
  },
  //查询专家讲解方案工作日
  getExpertWorkday: (data) => {
    return request({
      url: dev + '/service/process/expert/workday/day?serviceOrderId=' + data.serviceOrderId,
      method: 'get',
      data
    })
  },
  //查询专家讲解方案工作时间
  getExpertWorkTime: (data) => {
    return request({
      url: dev + '/service/process/expert/workday/time?dayId=' + data.dayId + '&serviceOrderId=' + data.serviceOrderId,
      method: 'get',
      data
    })
  },
  //添加专家讲解工作时间
  addExpertWorkDay: (data) => {
    return request({
      url: dev + '/service/process/expert/workday',
      method: 'post',
      data
    })
  },
  //修改专家讲解工作时间
  editExpertWorkDay: (data) => {
    return request({
      url: dev + '/service/process/expert/workday',
      method: 'put',
      data
    })
  },
  //查询专家的方案讲解工作时间基本信息
  getExpertWorkDayInfo: (data) => {
    return request({
      url: dev + '/service/process/expert/workday/info?serviceOrderId=' + data.serviceOrderId,
      method: 'get',
      data
    })
  },
  //添加初次沟通时间
  addAppointmentWorkDay: (data) => {
    return request({
      url: dev + '/service/process/appointment/workday',
      method: 'post',
      data
    })
  },
  //修改初次沟通时间
  editAppointmentWorkDay: (data) => {
    return request({
      url: dev + '/service/process/appointment/workday',
      method: 'put',
      data
    })
  },
  //获取初次沟通的日期
  getAppointmentWorkday: (data) => {
    return request({
      url: dev + '/service/process/appointment/workday/day?serviceOrderId=' + data.serviceOrderId,
      method: 'get',
      data
    })
  },
  //获取初次沟通的时间
  getAppointmentWorkTime: (data) => {
    return request({
      url: dev + '/service/process/appointment/workday/time?dayId=' + data.dayId + '&serviceOrderId=' + data.serviceOrderId,
      method: 'get',
      data
    })
  },
  //待修改方案
  updatePlanStatus: (data) => {
    return request({
      url: dev + '/service/process/update/plan',
      method: 'put',
      data
    })
  },
  //情况记录
  processRecord: (data) => {
    return request({
      url: dev + '/service/process/situation/record',
      method: 'put',
      data
    })
  },
  //方案满意
  planSatisfied: (data) => {
    return request({
      url: dev + '/service/process/satisfied/plan',
      method: 'put',
      data
    })
  },
  //回访完成
  completeVisit: (data) => {
    return request({
      url: dev + '/service/process/complete/visit',
      method: 'put',
      data
    })
  },
  //拨打电话
  callConsulting: (data) => {
    return request({
      url: dev + '/service/process/call',
      method: 'put',
      data
    })
  }
}
