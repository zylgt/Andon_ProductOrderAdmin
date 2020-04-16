import request from '@/utils/request'

export function listAgent(query) {
  return request({
    url: '/agent/api/list',
    method: 'get',
    params: query
  })
}

export function createAgent(data) {
  return request({
    url: '/agent/api/create',
    method: 'post',
    data
  })
}

export function readAgent(data) {
  return request({
    url: '/agent/api/read',
    method: 'get',
    data
  })
}

export function updateAgent(data) {
  return request({
    url: '/agent/api/update',
    method: 'post',
    data
  })
}

export function deleteAgent(data) {
  return request({
    url: '/agent/api/delete',
    method: 'post',
    data
  })
}

export function listPrice(query) {
  return request({
    url: '/agent/api/listPrice',
    method: 'get',
    params: query
  })
}
export function createPrice(data) {
  return request({
    url: '/agent/api/createPrice',
    method: 'post',
    data
  })
}
export function updatePrice(data) {
  return request({
    url: '/agent/api/updatePrice',
    method: 'post',
    data
  })
}
export function deletePrice(data) {
  return request({
    url: '/agent/api/deletePrice',
    method: 'post',
    data
  })
}
