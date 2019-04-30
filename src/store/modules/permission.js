import {
  asyncRouterMap,
  constantRouterMap
} from '@/router'

//把菜单结构树换成数组
function changeUserMenus(newMenus, menus) {
  for (let i = 0; i < menus.length; i++) {
    let obj = {
      name: menus[i].name,
      title: menus[i].title,
    }
    if (menus[i].auth) {
      obj.auth = menus[i].auth
    }
    newMenus.push(obj)
    if (menus[i].children) {
      changeUserMenus(newMenus, menus[i].children)
    }
  }
  return newMenus
}


/**
 * 获取用户的菜单，遍历权限
 * @param {*} roles 
 * @param {*} route 
 */

function filterUserMenus(routes, menus, roles) {
  for (let i = 0; i < routes.length; i++) {
    for (let j = 0; j < menus.length; j++) {
      if (routes[i].name == 'service' && routes[i].meta.title == '咨询服务') {
        let status = false
        for (let k = 0; k < menus.length; k++) {
          if (menus[k].name == 'userPlanDetails' ||
            menus[k].name == 'demandQuestionnaire' ||
            menus[k].name == 'insuranceQuestionnaire' ||
            menus[k].name == 'process' ||
            menus[k].name == 'processManagement' ||
            menus[k].name == 'enterCustomer' ||
            menus[k].name == 'plan' ||
            menus[k].name == 'insure') {
            status = true
            break
          }
        }
        if (status) {
          if (routes[i].meta && routes[i].meta.roles) {
            routes[i].meta.roles = roles
          }
          if (routes[i].children) {
            routes[i].children = filterUserMenus(routes[i].children, menus, roles)
          }
        } else {
          routes[i].hidden = true
        }
      } else {
        if (routes[i].name == menus[j].name) {
          if (routes[i].meta && routes[i].meta.roles) {
            routes[i].meta.roles = roles
          }
          if (routes[i].children) {
            routes[i].children = filterUserMenus(routes[i].children, menus, roles)
          }
        }

      }
    }
  }
  return routes
}

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRouterMap
 * @param roles
 */
function filterAsyncRouter(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = {
      ...route
    }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: constantRouterMap,
    permission_menus: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    },
    SET_PERMISSION: (state, newMenus) => {
      state.permission_menus = newMenus
    }
  },
  actions: {
    GenerateRoutes({
      commit
    }, data) {
      return new Promise(resolve => {
        const {
          id,
          menus
        } = data
        const roles = [id]
        let newMenus = []
        changeUserMenus(newMenus, menus)
        filterUserMenus(asyncRouterMap, newMenus, roles)
        commit('SET_PERMISSION', newMenus)
        let accessedRouters = filterAsyncRouter(asyncRouterMap, roles)
        console.log(accessedRouters)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
