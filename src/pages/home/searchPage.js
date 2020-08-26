import React from 'react'
import { Button, AutoComplete, Input, List, Empty, Avatar } from 'antd'
import { connect } from 'dva'
// import { routerRedux } from 'dva/router'
import { getUrlParams } from '@/utils/common'
import { newSearch } from '@/services/edukg'
import NewGraph from '@/pages/graph/newGraph'

let localCounter = 0

@connect()
class ClusterBroker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      filter: getUrlParams().filter || '',
      loading: false,
      dataSource: [],
      uri: '',
    }
  }

  componentWillMount = () => {
    this.search(this.state.filter)
  }

  search = async (filter) => {
    this.setState({ loading: true, filter })
    const data = await newSearch({
      searchKey: filter,
    })
    if (data.data) {
      this.setState({ dataSource: data.data, uri: data.data[0] ? data.data[0].uri : '' })
    }
    this.setState({ loading: false })
  }

  handleHighlight = (str, filter) => {
    let lightStr = []
    const word = new RegExp(filter, 'ig')
    const arr = str.split(word)
    lightStr = [<span key={localCounter++} style={{ color: '#24b0e6' }}>{arr[0]}</span>]
    for (let i = 1; i < arr.length; i++) {
      const keyword = str.match(word)[i - 1]
      lightStr.push(<span key={localCounter++} style={{ color: 'red' }}>{keyword}</span>)
      lightStr.push(<span key={localCounter++} style={{ color: '#24b0e6' }}>{arr[i]}</span>)
    }
    return lightStr
  }

  handleInputChange = (value) => {
    this.setState({ filter: value })
  }

  render() {
    const {
      dataSource, filter, loading, uri,
    } = this.state
    return (
      <div style={{ padding: 20, minWidth: 1200 }}>
        <div style={{ float: 'left', width: 420, marginBottom: 20 }}>
          <div style={{ height: 60 }}>
            <AutoComplete
              size="large"
              style={{
                width: 340, float: 'left',
              }}
              dataSource={[]}
              value={filter}
              onChange={value => this.handleInputChange(value, 'search')}
              onSelect={value => this.setState({ filter: value })}
              backfill
              placeholder="请输入科学教育相关知识点"
              optionLabelProp="value"
              defaultActiveFirstOption={false}
            >
              <Input
                onPressEnter={e => this.search(e.target.value)}
                style={{ borderBottomRightRadius: 0, borderTopRightRadius: 0 }}
              />
            </AutoComplete>
            <Button style={{ float: 'left', borderBottomLeftRadius: 0, borderTopLeftRadius: 0 }} type="primary" size="large" onClick={() => this.search(filter)}>搜索</Button>
          </div>
          <List
            itemLayout="vertical"
            size="large"
            dataSource={dataSource}
            loading={loading}
            style={{
              width: 410,
              border: '1px solid #e8e8e8',
              display: dataSource.length > 0 ? 'block' : 'none',
              overflowY: 'scroll',
              backgroundColor: 'white',
              maxHeight: 1100,
              borderRadius: 4,
            }}
            renderItem={(item) => {
              return (
                <List.Item style={{ padding: '20px 20px 0 20px' }}>
                  <List.Item.Meta
                    avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                    title={(
                      <a
                        href="javascript:;"
                        onClick={() => {
                          this.setState({ uri: item.uri })
                        }}
                      >
                        {this.handleHighlight(item.label, filter)}
                      </a>
                    )}
                    description="Heres some descriptions."
                  />
                </List.Item>
              )
            }}
          />
        </div>
        <div
          style={{
            overflow: 'hidden',
            display: dataSource.length > 0 ? 'block' : 'none',
          }}
        >
          <NewGraph uri={uri} search={this.search} />
        </div>
        <Empty
          style={{ marginTop: 200, display: dataSource.length === 0 ? 'block' : 'none' }}
          description="没有结果"
        />
      </div>
    )
  }
}
export default ClusterBroker
