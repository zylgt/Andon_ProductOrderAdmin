import request from '@/utils/request'

export function info(query) {
  return request({
    url: '/dashboard/api',
    method: 'get',
    params: query
  })
}
