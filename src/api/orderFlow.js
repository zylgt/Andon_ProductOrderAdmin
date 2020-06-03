import request from '@/utils/request'

export function listRefund(data) {
  return request({
    url: '/orderFlow/api/listRefund',
    method: 'post',
    data
  })
}
export function listRefundExport(data) {
  return request({
    url: '/orderFlow/api/listRefundExport',
    method: 'post',
    data
  })
}
export function listFlow(data) {
  return request({
    url: '/orderFlow/api/listFlow',
    method: 'post',
    data
  })
}
export function listFlowExport(data) {
  return request({
    url: '/orderFlow/api/listFlowExport',
    method: 'post',
    data
  })
}
