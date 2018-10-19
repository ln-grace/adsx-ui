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

import Vue from 'vue'
import store from './store'
Vue.config.errorHandler = function(err, vm, info) {
  Vue.nextTick(() => {
      store.dispatch('ADD_LOGS', {
          type: 'error',
          message: err.message,
          stack: err.stack,
          info
        })
      if (process.env.NODE_ENV === 'development') {
          console.group('>>>>>> 错误信息 >>>>>>')
          console.log(info)
          console.groupEnd()
          console.group('>>>>>> Vue 实例 >>>>>>')
          console.log(vm)
          console.groupEnd()
          console.group('>>>>>> Error >>>>>>')
          console.log(err)
          console.groupEnd()
        }
    })
}
