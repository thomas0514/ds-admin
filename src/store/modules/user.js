import {
    login,
    logout,
    getInfo,
    getUserRoleMenu
} from '@/api/login'
import {
    getToken,
    setToken,
    removeToken,
    getUserInfo,
    setUserInfo,
    removeUserInfo
} from '@/utils/auth'



const user = {
    state: {
        token: getToken(),
        name: '',
        avatar: '',
        userInfo: getUserInfo(),
        menus: []
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_USERINFO: (state, userInfo) => {
            state.userInfo = userInfo
            state.avatar = userInfo.headUrl
            state.name = userInfo.nickName
        },
        SET_MENUS: (state, menus) => {
            state.menus = menus
        }
    },

    actions: {
        // 登录
        Login({
            commit
        }, userInfo) {
            return new Promise((resolve, reject) => {
                login(userInfo).then(response => {
                    const data = response.data
                    setToken(data.accessToken)
                    commit('SET_TOKEN', data.accessToken)
                    resolve(data)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 获取用户信息
        GetInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                getInfo().then(function (res) {
                    const resData = res.data
                    if (resData) {
                        let obj = {
                            headUrl: resData.headUrl,
                            userName: resData.userName,
                            userId: resData.userId,
                            nickName: resData.nickName
                        }
                        setUserInfo(obj);
                        commit('SET_USERINFO', obj)
                        getUserRoleMenu().then(response => {
                            let data = response.data
                            if (data) { // 验证返回的roles是否是一个非空数组
                                let newMenus = filterUserMenus(data)
                                commit('SET_MENUS', newMenus)
                                let response = {
                                    data: {
                                        id: state.userInfo.userId,
                                        menus: newMenus
                                    }
                                }
                                resolve(response)
                            } else {
                                reject('getUserRoleMenu: menus must be a non-null array !')
                            }
                        }).catch(error => {
                            reject(error)
                        })
                    } else {
                        reject()
                    }
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 登出
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout({
                    accessToken: state.token,
                    tokenType: "Bearer"
                }).then(() => {
                    commit('SET_TOKEN', '')
                    commit('SET_USERINFO', {})
                    commit('SET_MENUS', [])
                    removeToken()
                    removeUserInfo()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '')
                removeToken()
                resolve()
            })
        }
    }
}

function filterUserMenus(menus) {
    let newMenus = []
    for (let i = 0; i < menus.length; i++) {
        //不是根目录
        var obj = {
            title: menus[i].title,
            name: menus[i].name
        }
        if (menus[i].roleMenuList.length > 0) {
            let roles = []
            for (let j = 0; j < menus[i].roleMenuList.length; j++) {
                let roleObj = {
                    title: menus[i].roleMenuList[j].title,
                    name: menus[i].roleMenuList[j].name
                }
                let auth = []
                for (let k = 0; k < menus[i].roleMenuList[j].roleMenuList.length; k++) {
                    auth.push(menus[i].roleMenuList[j].roleMenuList[k].name)
                }
                roleObj.auth = auth;
                if (menus[i].roleMenuList[j].name == 'process') {
                    let processRole = [
                        {
                            title: "录入客户需求",
                            name: "enterCustomer",
                            auth: auth
                        },
                        {
                            title: "客户保险咨询需求问卷记录",
                            name: "demandQuestionnaire",
                            auth: auth
                        },
                        {
                            title: "咨询服务进程管理",
                            name: "processManagement",
                            auth: auth
                        }
                    ]
                    roles = roles.concat(processRole)
                } else if (menus[i].roleMenuList[j].name == 'plan') {
                    let planRole = [
                        {
                            title: "配置方案",
                            name: "userPlanDetails",
                            auth: auth
                        },
                    ]
                    roles = roles.concat(planRole)
                } else if (menus[i].roleMenuList[j].name == 'insure') {
                    let insureRole = [
                        {
                            title: "投被保人资料问卷记录",
                            name: "insuranceQuestionnaire",
                            auth: auth
                        },
                    ]
                    roles = roles.concat(insureRole)
                } else if (menus[i].roleMenuList[j].name == 'service') {
                    let serviceRole = [
                        {
                            title: "客户申请退款管理",
                            name: "refund",
                            auth: auth
                        },
                    ]
                    roles = roles.concat(serviceRole)
                } else if (menus[i].roleMenuList[j].name == 'bind') {
                    let serviceRole = [
                        {
                            title: "绑定微信客户",
                            name: "wxcustomer",
                            auth: auth
                        },
                    ]
                    roles = roles.concat(serviceRole)
                }

                roles.push(roleObj)
            }
            obj.children = roles
        }
        newMenus.push(obj)
    }
    return newMenus
}

export default user
