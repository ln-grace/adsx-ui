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

export default {
  menu: false,
  addBtn: false,
  page: false,
  border: true,
  expand: true,
  refreshBtn: false,
  headerAlign: 'center',
  column: [{
      label: '类型',
      prop: 'type',
      width: 80,
      align: 'center',
      solt: true,
      dicData: [{
          label: 'bug',
          value: 'error'
        }]
    }, {
      label: '地址',
      width: 200,
      prop: 'url',
      overHidden: true
    }, {
      label: '内容',
      prop: 'message',
      overHidden: true
    }, {
      label: '错误堆栈',
      prop: 'stack',
      hide: true
    }, {
      label: '时间',
      align: 'center',
      prop: 'time',
      width: 200
    }]
}
