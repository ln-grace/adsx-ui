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

const baseUrl = ''
const iconfontVersion = ['567566_r22zi6t8noas8aor', '567566_qo5lxgtishg',
 '599693_dfa50fge714', '667895_2ek3wqcg8w1', '667895_bywepfixwj8', '781089_g23uj7gb7pf']
const iconfontUrl = `//at.alicdn.com/t/font_$key.css`
const codeUrl = `/code`
if (process.env.NODE_ENV == 'development') {

} else if (process.env.NODE_ENV == 'production') {

}

export {
    baseUrl,
    iconfontUrl,
    iconfontVersion,
    codeUrl
}
