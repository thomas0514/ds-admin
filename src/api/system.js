import request from '@/utils/request'
import { formatQueryData } from '@/utils/tool';
const dev = process.env.dev
export default {
    //角色
    getRoleList: (data) => {
        return request({
            url: dev + '/system/role/page' + formatQueryData(data),
            method: 'get',
            data
        })
    },
    getRoleMenu: (data) => {
        return request({
            url: dev + '/system/role/menu',
            method: 'get',
            data
        })
    },
    getRoleOne: (data) => {
        return request({
            url: dev + '/system/role/one' + formatQueryData(data),
            method: 'get',
            data
        })
    },
    addRole: (data) => {
        return request({
            url: dev + '/system/role',
            method: 'post',
            data
        })
    },
    addEditRole: (data) => {
        return request({
            url: dev + '/system/role',
            method: 'put',
            data
        })
    },
    deleteRole: (data) => {
        return request({
            url: dev + '/system/role' + formatQueryData(data),
            method: 'delete',
            data
        })
    },
    //组织
    getOrgList: (data) => {
        return request({
            url: dev + '/system/org/page' + formatQueryData(data),
            method: 'get',
            data
        })
    },
    getOrgRoleList: (data) => {
        return request({
            url: dev + '/system/org/role/all',
            method: 'get',
            data
        })
    },
    getOrgOne: (data) => {
        return request({
            url: dev + '/system/org/one' + formatQueryData(data),
            method: 'get',
            data
        })
    },
    addOrg: (data) => {
        return request({
            url: dev + '/system/org',
            method: 'post',
            data
        })
    },
    addEditOrg: (data) => {
        return request({
            url: dev + '/system/org',
            method: 'put',
            data
        })
    },
    deleteOrg: (data) => {
        return request({
            url: dev + '/system/org' + formatQueryData(data),
            method: 'delete',
            data
        })
    },
    ableOrg: (data) => {
        return request({
            url: dev + '/system/org/lock',
            method: 'put',
            data
        })
    },
    //用户
    getUserList: (data) => {
        return request({
            url: dev + '/system/user/page' + formatQueryData(data),
            method: 'get',
            data
        })
    },
    getUserOne: (data) => {
        return request({
            url: dev + '/system/user/one' + formatQueryData(data),
            method: 'get',
            data
        })
    },
    addUser: (data) => {
        return request({
            url: dev + '/system/user',
            method: 'post',
            data
        })
    },
    addEditUser: (data) => {
        return request({
            url: dev + '/system/user',
            method: 'put',
            data
        })
    },
    deleteUser: (data) => {
        return request({
            url: dev + '/system/user' + formatQueryData(data),
            method: 'delete',
            data
        })
    },
    ableUser: (data) => {
        return request({
            url: dev + '/system/user/lock',
            method: 'put',
            data
        })
    },
    getUserOrgList: (data) => {
        return request({
            url: dev + '/system/user/org/all',
            method: 'get',
            data
        })
    },
    setUser: (data) => {
        return request({
            url: dev + '/system/user/reset',
            method: 'put',
            data
        })
    },
    getRonglian: (data) => {
        return request({
            url: dev + '/comm/ronglian/users',
            method: 'get',
            data
        })
    },
}
