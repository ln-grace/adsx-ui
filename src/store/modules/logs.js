/*
 *    Copyright (c) 2018-2025, lengleng All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 * Neither the name of the pig4cloud.com developer nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 * Author: lengleng (wangiegie@gmail.com)
 */

import { setStore, getStore } from '@/util/store'
import { dateFormat } from '@/filters/'
import { sendLogs } from '@/api/log'
const logs = {
  state: {
      logsList: getStore({ name: 'logsList' }) || []
    },
  actions: {
        // 发送错误日志
      SendLogs({ state, commit }) {
          return new Promise((resolve, reject) => {
              sendLogs(state.logsList).then(() => {
                  commit('CLEAR_LOGS')
                  resolve()
                }).catch(error => {
                  reject(error)
                })
            })
        },
      ADD_LOGS: ({ state, rootState }, { type, message, stack, info }) => {
          state.logsList.push(Object.assign({
              url: window.location.href,
              time: dateFormat(new Date()),
              user: rootState.user.userInfo ? rootState.user.userInfo.username : ''
            }, {
              type,
              message,
              stack,
              info: info.toString()
            }))
          setStore({ name: 'logsList', content: state.logsList })
        }
    },
  mutations: {
      CLEAR_LOGS: (state) => {
          state.logsList = []
          setStore({ name: 'logsList', content: state.logsList })
        }
    }

}

export default logs
