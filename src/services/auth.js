import request from '@/utils/request'

export function fetchUserInfo(data) {
  return request.get({
    url: '/scaffold/api/typeAuth/user/getUserInfo',
    data,
    showError: false,
  })
}

export function logout(data) {
  return request.post({
    url: '/scaffold/api/typeAuth/user/logout',
    data,
    failed: () => { return null },
  })
}

export function login(data) {
  return request.post({
    url: '/scaffold/api/typeAuth/user/login',
    data,
  })
}

export function register(data) {
  return request.post({
    url: '/scaffold/api/typeAuth/user/register',
    data,
  })
}

export function getUserList(body, rSymbol) {
  return request.get({
    url: '/scaffold/api/typeAuth/method/getUserInfo',
    data: body,
    rSymbol,
  })
}
