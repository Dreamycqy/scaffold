import request from '../utils/request'

export function questionListByUriName(body, rSymbol) {
  return request.get({
    url: '/scaffold/api/knowledgeUri/wiki/questionListByUriName',
    data: body,
    rSymbol,
  })
}

export function searchResult(body, rSymbol) {
  return request.get({
    url: '/scaffold/api/knowledgeUri/wiki/search',
    data: body,
    rSymbol,
  })
}

export function searchResultV3(body, rSymbol) {
  return request.get({
    url: '/scaffold/api/knowledgeUri/wiki/searchV3',
    data: body,
    rSymbol,
  })
}

export function infoByInstanceUri(body, rSymbol) {
  return request.get({
    url: '/scaffold/api/knowledgeUri/wiki/infoByInstanceUri',
    data: body,
    rSymbol,
  })
}

export function infoByInstanceName(body, rSymbol) {
  return request.get({
    url: '/scaffold/api/knowledgeUri/wiki/infoByInstanceName',
    data: body,
    rSymbol,
  })
}

export function searchByKnowName(body, rSymbol) {
  return request.get({
    url: '/scaffold/api/knowledgeUri/wiki/searchByKnowName',
    data: body,
    rSymbol,
  })
}

export function searchByKnowId(body, rSymbol) {
  return request.get({
    url: '/scaffold/api/knowledgeUri/wiki/searchByKnowId',
    data: body,
    rSymbol,
  })
}

export function infoByCmccUrl(body, rSymbol) {
  return request.get({
    url: '/scaffold/api/knowledgeUri/wiki/infoByCmccUrl',
    data: body,
    rSymbol,
  })
}

export function searchByKnowIdV3(body, rSymbol) {
  return request.get({
    url: '/scaffold/api/knowledgeUri/wiki/searchByKnowIdV3',
    data: body,
    rSymbol,
  })
}

export function bookInfoBySearchKey(body, rSymbol) {
  return request.get({
    url: '/scaffold/api/knowledgeUri/wiki/bookInfoBySearchKey',
    data: body,
    rSymbol,
  })
}
