import request from '@/utils/request'

export function sendMessageCode(phone) {
  const data = {
    phone: phone,
    sc: '1w3edd4590p2ccf'
  }
  return request({
    url: '/user/api/getSmsCode',
    // url: '/auth/login',
    method: 'post',
    data
  })
}
export function verifySmsCode(phone, code) {
  const data = {
    phone,
    code
  }
  return request({
    url: '/user/api/verifySmsCode',
    // url: '/auth/login',
    method: 'post',
    data
  })
}
export function loginByUsername(phone, code) {
  const data = {
    phone,
    code
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

