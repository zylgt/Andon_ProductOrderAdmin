import request from '@/utils/request'

export function info(query) {
  return request({
    url: '/dashboard/api/get',
    method: 'get',
    params: query
  })
}
