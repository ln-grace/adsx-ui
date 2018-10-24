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

export const tableOption = {
  'border': true,
  'index': true,
  'stripe': true,
  'menuAlign': "center",
  'align': "center",
  'editBtn': false,
  'delBtn': false,
  'addBtn': false,
  'dic': [],
  'column': [
	  {
      label: 'adwords账号ID',
      prop: 'customerId'
    },
	  {
      label: 'adwords账号名称',
      prop: 'customerName'
    },
	  {
      label: '是否为经理账户(0：客户，1：经理)',
      prop: 'canManageClients'
    },
	  {
      label: '币种',
      prop: 'currencyCode'
    },
	  {
      label: '时区',
      prop: 'dateTimeZone'
    },
	  {
      label: '上级adwords账号ID',
      prop: 'parentId'
    },
  ]
}
