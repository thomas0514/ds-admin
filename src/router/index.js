import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'homePage',
    hidden: true,
    meta: {
      title: '首页'
    },
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  {
    path: '/sysSettings',
    component: Layout,
    redirect: '/sysSettings/editPassword',
    name: 'sysSettings',
    hidden: true,
    children: [{
      path: 'editPassword',
      name: 'editPassword',
      component: () => import('@/views/editPassword'),
      hidden: true,
      meta: {
        title: '修改密码',
        roles: []
      }
    }]
  },
  {
    path: '/message',
    component: Layout,
    redirect: '/message/list',
    name: 'message',
    hidden: true,
    children: [{
      path: 'list',
      name: 'list',
      component: () => import('@/views/message'),
      hidden: true,
      meta: {
        title: '消息中心',
        roles: []
      }
    }]
  }
]

export const asyncRouterMap = [
  {
    path: '/userManagement',
    component: Layout,
    redirect: '/userManagement/potentialUser',
    name: 'customer',
    meta: {
      title: '客户管理',
      icon: 'user',
      roles: []
    },
    children: [{
      path: 'potentialUser',
      name: 'temp',
      component: () => import('@/views/userManagement/potentialUser'),
      meta: {
        title: '潜在客户',
        roles: []
      }
    },
    {
      path: 'realUser',
      name: 'real',
      component: () => import('@/views/userManagement/realUser'),
      meta: {
        title: '真实客户',
        roles: []
      }
    }
    ]
  },
  {
    path: '/consultingService',
    component: Layout,
    redirect: '/consultingService/counseling',
    name: 'service',
    meta: {
      title: '咨询服务',
      icon: 'taskManagement',
      roles: []
    },
    children: [
      {
        path: 'userPlanDetails',
        name: 'userPlanDetails',
        hidden: true,
        component: () => import('@/views/consultingService/userPlanDetails'),
        meta: {
          title: '配置方案',
          roles: []
        }
      },
      {
        path: 'demandQuestionnaire',
        name: 'demandQuestionnaire',
        hidden: true,
        component: () => import('@/views/consultingService/demandQuestionnaire'),
        meta: {
          title: '客户保险咨询需求问卷记录',
          roles: []
        }
      },
      {
        path: 'insuranceQuestionnaire',
        name: 'insuranceQuestionnaire',
        hidden: true,
        component: () => import('@/views/consultingService/insuranceQuestionnaire'),
        meta: {
          title: '投被保人资料问卷记录',
          roles: []
        }
      },
      {
        path: 'counseling',
        name: 'process',
        component: () => import('@/views/consultingService/counseling'),
        meta: {
          title: '咨询服务进程',
          roles: []
        }
      },
      {
        path: 'processManagement',
        name: 'processManagement',
        hidden: true,
        component: () => import('@/views/consultingService/processManagement'),
        meta: {
          title: '咨询服务进程管理',
          roles: []
        }
      },
      {
        path: 'enterCustomer',
        name: 'enterCustomer',
        hidden: true,
        component: () => import('@/views/consultingService/enterCustomer'),
        meta: {
          title: '录入客户需求',
          roles: []
        }
      },
      {
        path: 'userPlans',
        name: 'plan',
        component: () => import('@/views/consultingService/userPlans'),
        meta: {
          title: '方案管理',
          roles: []
        }
      },
      {
        path: 'insureDemand',
        name: 'insure',
        component: () => import('@/views/consultingService/insureDemand'),
        meta: {
          title: '投保需求',
          roles: []
        }
      }
    ]
  },
  {
    path: '/orderManagement',
    component: Layout,
    redirect: '/orderManagement/service',
    name: 'order',
    meta: {
      title: '订单管理',
      icon: 'accountManagers',
      roles: []
    },
    children: [
      {
        path: 'service',
        name: 'service',
        component: () => import('@/views/orderManagement/service'),
        meta: {
          title: '咨询服务订单',
          roles: []
        }
      },
      {
        path: 'refund',
        name: 'refund',
        hidden: true,
        component: () => import('@/views/orderManagement/refundList'),
        meta: {
          title: '客户申请退款管理',
          roles: []
        }
      },
      {
        path: 'insuranceBind',
        name: 'bind',
        component: () => import('@/views/orderManagement/insuranceBind'),
        meta: {
          title: '保单绑定管理',
          roles: []
        }
      },
      {
        path: 'wxcustomer',
        name: 'wxcustomer',
        hidden: true,
        component: () => import('@/views/orderManagement/wxcustomer'),
        meta: {
          title: '绑定微信客户',
          roles: []
        }
      },
      {
        path: 'insuranceUnbind',
        name: 'unbind',
        component: () => import('@/views/orderManagement/insuranceUnbind'),
        meta: {
          title: '保单解绑管理',
          roles: []
        }
      },
      {
        path: 'insuranceCore',
        name: 'core',
        component: () => import('@/views/orderManagement/insuranceCore'),
        meta: {
          title: '核心售出保单',
          roles: []
        }
      },
      {
        path: 'insuranceKbao',
        name: 'kbao',
        component: () => import('@/views/orderManagement/insuranceKbao'),
        meta: {
          title: '快保售出保单',
          roles: []
        }
      }
    ]
  },
  {
    path: '/channel',
    component: Layout,
    name: 'channel',
    meta: {
      icon: 'example',
      roles: []
    }, children: [{
      path: 'channel',
      name: 'channel',
      component: () => import('@/views/channel/channel'),
      meta: {
        title: '渠道管理',
        roles: []
      }
    }]
  },
  {
    path: '/coupon',
    component: Layout,
    redirect: '/coupon/couponPost',
    name: 'coupon',
    meta: {
      title: '优惠券',
      icon: 'activity',
      roles: []
    },
    children: [{
      path: 'couponPost',
      name: 'give',
      component: () => import('@/views/coupon/couponPost'),
      meta: {
        title: '发送优惠券',
        roles: []
      }
    },
    {
      path: 'couponRecord',
      name: 'record',
      component: () => import('@/views/coupon/couponRecord'),
      meta: {
        title: '优惠券发送记录',
        roles: []
      }
    }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/org',
    name: 'system',
    meta: {
      title: '后台管理',
      icon: 'tree',
      roles: []
    },
    children: [{
      path: 'role',
      name: 'role',
      component: () => import('@/views/system/role'),
      meta: {
        title: '角色管理',
        roles: []
      }
    },
    {
      path: 'org',
      name: 'org',
      component: () => import('@/views/system/organization'),
      meta: {
        title: '组织管理',
        roles: []
      }
    },
    {
      path: 'user',
      name: 'user',
      component: () => import('@/views/system/systemUser'),
      meta: {
        title: '系统用户管理',
        roles: []
      }
    }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
