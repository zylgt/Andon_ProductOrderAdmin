import request from '@/utils/request'

export function loginByUsername(username, password) {
  const data = {
    username,
    password
  }
  return request({
    url: '/user/api/login',
    // url: '/auth/login',
    method: 'post',
    data
  })
}

export function logout() {
  return request({
    url: '/user/api/logout',
    method: 'post'
  })
}

export function getUserInfo(token) {
  return request({
    url: '/user/api/info',
    // url: '/auth/info',
    method: 'get',
    params: { token }
  })
}

