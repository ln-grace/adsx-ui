import request from '@/router/axios'

//查询
export function fetchList(query) {
  return request({
    url: '/ad/adsCampaign/page',
    method: 'get',
    params: query
  })
}

//添加
export function addObj(obj) {
  return request({
    url: '/ad/adsCampaign/',
    method: 'post',
    data: obj
  })
}

//搜索
export function getObj(id) {
  return request({
    url: '/ad/adsCampaign/' + id,
    method: 'get'
  })
}

//删除
export function delObj(campaignId) {
  return request({
    url: '/ad/adsCampaign/' + campaignId,
    method: 'delete'
  })
}

//修改
export function putObj(obj) {
  return request({
    url: '/ad/adsCampaign/',
    method: 'put',
    data: obj
  })  
}

//广告系列管理--->状态
export function changeStatus(val,campaignId){
  return request({
    url: '/ad/adsCampaign/changeStatus',
    method: 'put',
    params: {
      "status": val,
      "campaignId":campaignId
    }
  })  
}

//客户账号
export function fetchChildrenManagerTree(customerId) {
  return request({
    url: '/ad/adsAccount/children/' + customerId,
    method: 'get',
    params: {
      "isManager":false
    }
  })
}

//MC帐号
export function fetchChildrenMcTree(customerId){
  return request({
    url: '/ad/merchantCenterAccount/linkAccount/' + customerId,
    method: 'get',
  })
}

