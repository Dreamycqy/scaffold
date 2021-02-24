import React from 'react'
import { message, Spin, Empty } from 'antd'
import Masonry from 'react-masonry-component'
import { bookInfoBySearchKey } from '@/services/knowledge'
import Card from './bookCardNew'

export default class BookMasonry extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      current: 1,
      pageSize: 20,
      total: 0,
      loading: false,
      isEnd: false,
    }
  }

  UNSAFE_componentWillMount = () => {
    this.search()
  }

  onScroll = async (e) => {
    if (e.target.scrollTop === this.masonry.scrollHeight - 600) {
      const { isEnd } = this.state
      if (isEnd === true) {
        message.info('已经到底了')
        return
      }
      const { current } = this.state
      await this.setState({ current: current + 1 })
      this.search()
    }
  }

  search = async () => {
    this.setState({ loading: true })
    const { current, pageSize } = this.state
    const data = await bookInfoBySearchKey({
      searchKey: this.props.name,
      curPage: current,
      pageSize,
      subject: this.props.subject,
    })
    if (data.data) {
      const { dataSource } = this.state
      await this.setState({
        dataSource: dataSource.concat(data.data.book),
        current: data.data.page,
        total: data.data.allSize,
        isEnd: data.data.book.length < 1,
      })
    } else {
      message.error('请求失败！')
    }
    this.setState({ loading: false })
  }

  renderItem = (item) => {
    return <Card data={item} name={this.props.name} />
  }

  render() {
    const { dataSource, loading, total } = this.state
    return (
      <div
        style={{ minHeight: 200, maxHeight: 600, overflowY: 'scroll' }}
        onScroll={this.onScroll}
        ref={(c) => this.masonry = c}
      >
        <Spin spinning={loading}>
          <Empty
            style={{ display: loading === false && dataSource.length < 1 ? 'block' : 'none', paddingTop: 30 }}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无教材出处数据"
          />
          <Masonry>
            {dataSource.map(this.renderItem)}
          </Masonry>
        </Spin>
      </div>
    )
  }
}
