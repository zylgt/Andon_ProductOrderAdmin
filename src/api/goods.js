import request from '@/utils/request'

export function listGoods(query) {
  return request({
    url: '/product/api/list',
    method: 'get',
    params: query
  })
}

export function deleteGoods(data) {
  return request({
    url: '/product/api/delete',
    method: 'post',
    data
  })
}

export function publishGoods(data) {
  return request({
    url: '/product/api/create',
    method: 'post',
    data
  })
}

export function detailGoods(id) {
  return request({
    url: '/product/api/detail',
    method: 'get',
    params: { id }
  })
}

export function editGoods(data) {
  return request({
    url: '/product/api/edit',
    method: 'post',
    data
  })
}

export function listCatAndBrand() {
  return request({
    url: '/product/api/catAndBrand',
    method: 'get'
  })
}
