import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUserInfo() {
  if (Cookies.get('userInfo')) {
    return JSON.parse(Cookies.get('userInfo'))
  }
}

export function setUserInfo(userInfo) {
  return Cookies.set('userInfo', userInfo)
}

export function removeUserInfo() {
  return Cookies.remove('userInfo')
}
