const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  msgNum: state => state.user.msgNum,
  userInfo: state => state.user.userInfo,
  menus: state => state.user.menus,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  permission_menus: state => state.permission.permission_menus,
}
export default getters
