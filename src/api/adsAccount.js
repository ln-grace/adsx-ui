import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/ad/adsAccount/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/ad/adsAccount/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/ad/adsAccount/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/ad/adsAccount/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/ad/adsAccount/',
    method: 'put',
    data: obj
  })
}


export function fetchChildrenManagerTree(customerId) {
  return request({
    url: '/ad/adsAccount/tree/' + customerId,
    method: 'get',
    params: {
      "isManager": true
    }
  })
}

export function fetchChildrenTree(customerId) {
  return request({
    url: '/ad/adsAccount/tree/' + customerId,
    method: 'get',
  })
}


export function refreshAccount(customerId) {
  return request({
    url: '/ad/adsAccount/refresh/' + customerId,
    method: 'get',
  })
}