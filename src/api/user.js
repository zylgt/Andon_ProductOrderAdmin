import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user/api/list',
    method: 'get',
    params: query
  })
}
export function createAdmin(data) {
  return request({
    url: '/user/api/create',
    method: 'post',
    data
  })
}
export function updateAdmin(data) {
  return request({
    url: '/user/api/update',
    method: 'post',
    data
  })
}

export function deleteAdmin(data) {
  return request({
    url: '/user/api/delete',
    method: 'post',
    data
  })
}

export function listAddress(query) {
  return request({
    url: '/address/list',
    method: 'get',
    params: query
  })
}

export function listCollect(query) {
  return request({
    url: '/collect/list',
    method: 'get',
    params: query
  })
}

export function listFeedback(query) {
  return request({
    url: '/feedback/list',
    method: 'get',
    params: query
  })
}

export function listFootprint(query) {
  return request({
    url: '/footprint/list',
    method: 'get',
    params: query
  })
}

export function listHistory(query) {
  return request({
    url: '/history/list',
    method: 'get',
    params: query
  })
}

