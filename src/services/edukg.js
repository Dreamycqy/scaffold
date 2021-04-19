import qs from 'qs'
import request from '../utils/request'

export function newSearch(body, rSymbol) {
  return request.get({
    url: '/scaffold/api/science/search',
    data: body,
    rSymbol,
  })
}

export function newResult(body, rSymbol) {
  return request.get({
    url: '/scaffold/api/science/querygraphByUri',
    data: body,
    rSymbol,
  })
}

export function getClassTree(body, rSymbol) {
  return request.get({
    url: '/scaffold/api/science/classList',
    data: body,
    rSymbol,
  })
}

export function querygraph(body, rSymbol) {
  return request.post({
    url: '/scaffold/api/typeNew/res_lib/querygraph',
    data: qs.stringify(body),
    rSymbol,
  })
}

export function search(body, rSymbol) {
  return request.get({
    url: '/scaffold/api/totalsearch',
    data: body,
    rSymbol,
  })
}
