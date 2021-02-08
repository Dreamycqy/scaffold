import React from 'react'
import { Icon, Input, Tree } from 'antd'
import _ from 'lodash'

const { TreeNode } = Tree
const { Search } = Input
let dataList = []
let parentKey = []

class GraphTree extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      expandedKeys: [],
      selectKey: '',
      searchValue: '',
      autoExpandParent: true,
    }
  }

  UNSAFE_componentWillMount = () => {
    this.generateList(this.props.treeData)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.treeData, this.props.treeData)) {
      dataList = []
      this.generateList(nextProps.treeData)
    }
    // if (nextProps.target !== '') {
    //   this.setState({ selectKey: nextProps.target })
    //   const target = _.find(dataList, { key: nextProps.target })
    //   if (target) {
    //     this.onTreeSearch({ target: { value: target.name } })
    //   }
    // }
  }

  onExpand = (expandedKeys) => {
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    })
  }

  onTreeSearch = (e) => {
    const { value } = e.target
    parentKey = []
    dataList.forEach((item) => {
      if (!item.key) {
        return
      }
      if (item.name.indexOf(value) > -1) {
        this.getParentKey(item.key, this.props.treeData)
      }
    })
    const expandedKeys = parentKey
    this.setState({
      expandedKeys: _.uniq(expandedKeys),
      searchValue: value,
      autoExpandParent: true,
    })
  }

  onSelect = async (keys) => {
    if (keys.length === 0) {
      return
    }
    await this.setState({
      selectKey: keys[0],
    })
    this.props.selectTarget(keys[0])
  }

  getParentKey = (key, tree) => {
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i]
      if (node.children && node.children !== undefined) {
        if (node.children.some((item) => item.key === key)) {
          parentKey.push(node.key)
        } else {
          this.getParentKey(key, node.children)
        }
      }
    }
  }

  generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i]
      const { name, key } = node
      dataList.push({ name, key })
      if (node.children) {
        this.generateList(node.children)
      }
    }
  }

  renderTreeNodes = (data) => {
    const { searchValue } = this.state
    const result = []
    data.forEach((item) => {
      if (!item.name) {
        return
      }
      const index = item.name.indexOf(searchValue)
      const beforeStr = item.name.substr(0, index)
      const afterStr = item.name.substr(index + searchValue.length)
      const titleText = index > -1
        ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.name}</span>
        )
      const title = (
        <span>
          <Icon
            style={{ color: '#24b0e6', marginRight: 6 }} type="right-circle"
          />
          {titleText}
        </span>
      )
      if (item.children) {
        result.push(
          <TreeNode
            title={title} key={item.key}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>,
        )
      } else {
        result.push(<TreeNode
          title={title} key={item.key}
        />)
      }
    })
    return result
  }

  render() {
    const { searchValue, autoExpandParent, selectKey, expandedKeys } = this.state
    return (
      <div style={{ overflowY: 'scroll' }}>
        <Search
          style={{ marginBottom: 8, width: 270 }}
          placeholder="请输入概念名称，模糊搜索"
          onChange={this.onTreeSearch} size="small"
          value={searchValue}
        />
        <Tree
          blockNode
          autoExpandParent={autoExpandParent}
          onSelect={this.onSelect}
          selectedKeys={[selectKey]}
          onExpand={this.onExpand}
          expandedKeys={expandedKeys}
        >
          {this.renderTreeNodes(this.props.treeData)}
        </Tree>
      </div>
    )
  }
}
export default GraphTree
