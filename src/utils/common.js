import React from 'react'
import queryString from 'query-string'
import { Select } from 'antd'

const { Option } = Select

export const getUrlParams = (type) => {
  const parsed = queryString.parse(window.location.search)
  return (type ? parsed[type] : parsed)
}

export const changeUrlQuery = (newQuery) => {
  const query = {
    ...queryString.parse(window.location.search),
    ...newQuery,
  }
  const queryStr = queryString.stringify(query)
  window.history.pushState(null, null, `?${queryStr}`)
}

export const makeOption = (array) => {
  const children = []
  for (const i of array) {
    children.push(<Option key={i.value} value={i.value}>{i.name}</Option>)
  }
  return children
}

export const isInArray = (arr, value) => {
  for (let i = 0; i < arr.length; i++) {
    if (value === arr[i]) {
      return true
    }
  }
  return false
}

// 找出重名不重学科的节点
export const theSameLabel = (other) => {
  const samelabel = []
  for (let h = 0; h < other.length; h++) {
    const each = other[h]
    const lab = each.label
    const cor = each.course
    for (let g = 0; g < other.length; g++) {
      const obj = other[g]
      const { label } = obj
      const { course } = obj

      if (label === lab && cor !== course) {
        samelabel.push(each)
      }
    }
  }
  return samelabel
}
export const handleIcon = (title) => {
  switch (title) {
    case 'graph':
      return 'dot-chart'
    case 'property':
      return 'file'
    case 'picture':
      return 'picture'
    case 'video':
      return 'play-circle'
    case 'question':
      return 'edit'
    case 'books':
      return 'read'
    default:
      return ''
  }
}

export const handleTitle = (title) => {
  switch (title) {
    case 'graph':
      return '知识地图'
    case 'property':
      return '知识卡片'
    case 'picture':
      return '相关图片'
    case 'video':
      return '教学视频'
    case 'question':
      return '相关习题'
    case 'books':
      return '教材出处'
    default:
      return ''
  }
}
