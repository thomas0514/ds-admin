import request from '@/utils/request'
const dev = process.env.dev

export function login(data) {
  return request({
    url: dev + '/auth/login',
    method: 'post',
    data
  })
}

export function getInfo(data) {
  return request({
    url: dev + '/user/info',
    method: 'get',
    data
  })
}

export function logout(data) {
  return request({
    url: dev + '/auth/logout',
    method: 'post',
    data
  })
}

export function getSms(data) {
  return request({
    url: dev + '/auth/sms',
    method: 'post',
    data
  })
}

export function getUserRoleMenu() {
  return request({
    url: dev + '/user/info/roleMenu/list',
    method: 'get'
  })
}

export function changePassword(data) {
  return request({
    url: dev + '/user/info/change/password',
    method: 'put',
    data
  })
}

//新消息总数
export function getUserMessageCount(data) {
  return request({
    url: dev + '/comm/message/count',
    method: 'get'
  })
}
