import request from '@/utils/request'

export function listRefund(data) {
  return request({
    url: '/orderFlow/api/listRefund',
    method: 'post',
    data
  })
}
