import request from '@/router/axios'

export function fetchList(query) {
  return request({
    url: '/ad/adwordsinfo/page',
    method: 'get',
    params: query
  })
}

export function addObj(obj) {
  return request({
    url: '/ad/adwordsinfo/',
    method: 'post',
    data: obj
  })
}

export function getObj(id) {
  return request({
    url: '/ad/adwordsinfo/' + id,
    method: 'get'
  })
}

export function delObj(id) {
  return request({
    url: '/ad/adwordsinfo/' + id,
    method: 'delete'
  })
}

export function putObj(obj) {
  return request({
    url: '/ad/adwordsinfo/',
    method: 'put',
    data: obj
  })
}

export function fetchManagerCustomerByCustomerId(customerId) {
  return request({
    url: '/ad/adwordsinfo/managerTree/' + customerId,
    method: 'get'
  })
}