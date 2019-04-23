import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import table from './modules/table'
import user from './modules/user'
import permission from './modules/permission'
import getters from './getters'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    table,
    user,
    permission
  },
  getters
})
Vue.prototype['PermissionAuth'] = function (pageName, operation) {
  let permission_menus = permission.state.permission_menus
  for (let i = 0; i < permission_menus.length; i++) {
    if (permission_menus[i].name == pageName) {
      if (permission_menus[i].auth) {
        for (let j = 0; j < permission_menus[i].auth.length; j++) {
          if (permission_menus[i].auth[j] == operation) {
            return true
          }
        }
      }
    }
  }
  return false
}
export default store
