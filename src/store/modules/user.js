import {
    setToken,
    removeToken
} from '@/util/auth'
import {
    setStore,
    getStore
} from '@/util/store'
import {
    validatenull
} from '@/util/validate'

import {
    loginByUsername,
    loginBySocial,
    getUserInfo,
    logout
} from '@/api/login'
import {
    GetMenu
} from '@/api/menu'
import { encryption } from '@/util/util'

function addPath(ele) {
    ele.children.forEach(child => {
        const isChild = ele.children.length !== 0;
        if (isChild) {
            if (!child.path.includes('http') && !child.path.includes('https')) {
                child.path = `${ele.path}/${child.path?child.path:'index'}`
            }
            addPath(child);
        }
    })
}
const user = {
    state: {
        userInfo: getStore({
            name: 'userInfo'
        }) || {},
        adWordsInfo: getStore({
            name: 'adWordsInfo'
        }) || {},
        permissions: getStore({
            name: 'permissions'
        }) || {},
        roles: getStore({
            name: 'roles'
        }) || [],
        menu: getStore({
            name: 'menu'
        }) || [],
        isInitMenu: getStore({
            name: 'isInitMenu'
        }) || false,
        access_token: getStore({
            name: 'access_token'
        }) || '',
        refresh_token: getStore({
            name: 'refresh_token'
        }) || ''
    },
    actions: {
        // 根据用户名登录
        LoginByUsername({
            commit,
            state,
            dispatch
        }, userInfo) {
            return new Promise((resolve, reject) => {
                const user = encryption({
                    data: userInfo,
                    key: 'huaqiutongadsads',
                    param: ['password']
                })

                loginByUsername(user.username, user.password, user.code, user.randomStr).then(response => {
                    const data = response.data
                    setToken(data.access_token)
                    commit('SET_ACCESS_TOKEN', data.access_token)
                    commit('SET_REFRESH_TOKEN', data.refresh_token)
                    commit('CLEAR_LOCK')
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 根据OpenId登录
        LoginBySocial({ commit, state, dispatch }, param) {
            return new Promise((resolve, reject) => {
                loginBySocial(param.state, param.code).then(response => {
                    const data = response.data
                    setToken(data.access_token)
                    commit('SET_ACCESS_TOKEN', data.access_token)
                    commit('SET_REFRESH_TOKEN', data.refresh_token)
                    commit('CLEAR_LOCK')
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetUserInfo({
            commit,
            state,
            dispatch
        }) {
            return new Promise((resolve, reject) => {
                getUserInfo().then(response => {
                    const data = response.data.data
                    commit('SET_ROLES', data.roles)
                    commit('SET_USER_INFO', data.sysUser)
                    commit('SET_PERMISSIONS', data.permissions)
                    commit('SET_ADWORDS_INFO', data.adWordsInfo)
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 登出
        LogOut({
            commit,
            state
        }) {
            return new Promise((resolve, reject) => {
                logout().then(() => {
                    // 清除菜单
                    commit('SET_MENU', [])
                        // 清除权限
                    commit('SET_PERMISSIONS', [])
                        // 清除用户信息
                    commit('SET_USER_INFO', {})
                    commit('SET_ACCESS_TOKEN', '')
                    commit('SET_REFRESH_TOKEN', '')
                    commit('SET_ROLES', [])
                    commit('SET_ADWORDS_INFO',[])
                    commit('DEL_ALL_TAG')
                    removeToken()
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 注销session
        FedLogOut({
            commit
        }) {
            return new Promise(resolve => {
                // 清除菜单
                commit('SET_MENU', [])
                    // 清除权限
                commit('SET_PERMISSIONS', [])
                    // 清除用户信息
                commit('SET_USER_INFO', {})
                commit('SET_ADWORDS_INFO',{})
                commit('SET_ACCESS_TOKEN', '')
                commit('SET_REFRESH_TOKEN', '')
                commit('SET_ROLES', [])
                commit('DEL_ALL_TAG')
                removeToken()
                resolve()
            })
        },
        // 获取系统菜单
        GetMenu({
            commit
        }) {
            return new Promise(resolve => {
                GetMenu().then((res) => {
                    const data = res.data
                    data.forEach(ele => {
                        addPath(ele);
                    })
                    commit('SET_MENU', data)
                    resolve(data)
                })
            })
        }
    },
    mutations: {
        SET_ACCESS_TOKEN: (state, access_token) => {
            state.access_token = access_token
            setStore({
                name: 'access_token',
                content: state.access_token,
                type: 'session'
            })
        },
        SET_MENU: (state, menu) => {
            state.menu = menu
            setStore({
                name: 'menu',
                content: state.menu,
                type: 'session'
            })
        },
        SET_USER_INFO: (state, userInfo) => {
            state.userInfo = userInfo
            setStore({
                name: 'userInfo',
                content: state.userInfo,
                type: 'session'
            })
        },
        SET_ADWORDS_INFO: (state, adWordsInfo) => {
            state.adWordsInfo = adWordsInfo
            setStore({
                name: 'adWordsInfo',
                content: state.adWordsInfo,
                type: 'session'
            })
        },
        SET_REFRESH_TOKEN: (state, rfToken) => {
            state.refresh_token = rfToken
            setStore({
                name: 'refresh_token',
                content: state.refresh_token,
                type: 'session'
            })
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles
            setStore({
                name: 'roles',
                content: state.roles,
                type: 'session'
            })
        },
        SET_PERMISSIONS: (state, permissions) => {
            const list = {}
            for (let i = 0; i < permissions.length; i++) {
                list[permissions[i]] = true
            }
            state.permissions = list
            setStore({
                name: 'permissions',
                content: state.permissions,
                type: 'session'
            })
        }
    }
}
export default user