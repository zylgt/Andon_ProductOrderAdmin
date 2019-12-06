import request from '@/utils/request'

export function listAdmin(query) {
  return request({
    url: '/notice/api/list',
    method: 'get',
    params: query
  })
}

export function createAdmin(data) {
  return request({
    url: '/notice/api/create',
    method: 'post',
    data
  })
}

export function updateAdmin(data) {
  return request({
    url: '/notice/api/update',
    method: 'post',
    data
  })
}

export function deleteAdmin(data) {
  return request({
    url: '/notice/api/delete',
    method: 'post',
    data
  })
}
