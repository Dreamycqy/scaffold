import React from 'react'
import { Anchor, Spin, Icon, Tabs } from 'antd'
import _ from 'lodash'
import Script from 'react-load-script'
import { getUrlParams } from '@/utils/common'
import { infoByInstanceName, infoByCmccUrl } from '@/services/knowledge'
import { remakeGraphData } from '@/utils/graphData'
import GrapeImg from '@/assets/grape.png'
import edu10086 from '@/assets/edu10086.png'
import Chart from '@/components/charts/newGraph'
import Think from './think'
import GCard from './components/graphCard'
import NewCard from './components/localCard'
import KgTable from './components/kgTable'
import Gallery from './components/gallery'
import NewTree from './components/tree'
import BooksList from './components/bookList'
import BooksMasonry from './components/bookMasonry'
import Questions from './question'
import Styles from './style.less'

const { Link } = Anchor
const { TabPane } = Tabs
const deleteList = [
  '学术论文',
  '标注',
  '出处',
  '分类编号',
  '上位分类',
  '下位分类',
  '科普中国资源',
  '科普活动资源服务平台-科普资源',
  '科普活动资源服务平台-活动资源',
  '科学百科词条',
  '中国科普博览',
  '类型',
]

class KgContent extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      forcename: unescape(getUrlParams().name || ''),
      subject: getUrlParams().subject || 'chinese',
      dataSource: [],
      imgList: [],
      graph: {
        nodes: [],
        links: [],
      },
      thinkData: [],
      selectChart: 'relation',
      liveClassRoom: '',
      classRoomInfo: {},
      booksMode: 'masonry',
    }
  }

  UNSAFE_componentWillMount = async () => {
    await this.getChart()
  }

  onhandleScript = (sign) => {
    if (sign === 'load') {
      this.setState({ thinkData: window.sheet })
    }
  }

  getChart = async () => {
    this.setState({ loading: true })
    const { forcename, subject } = this.state
    if (forcename.length === 0) {
      this.setState({
        loading: false,
        forcename: '',
        dataSource: [],
        graph: {
          nodes: [],
          links: [],
        },
      })
      return
    }
    const data = await infoByInstanceName({
      name: forcename,
      subject,
    })
    if (data) {
      const { label, property, content } = data.data
      const params = remakeGraphData(content, label, 'instance')
      this.setState({
        dataSource: property ? this.handleData(property) : [],
        graph: params,
      })
    }
    this.setState({ loading: false })
  }

  handleData = (array) => {
    const result = []
    const imgList = []
    array.forEach((e) => {
      if (e.predicateLabel && deleteList.indexOf(e.predicateLabel) < 0) {
        if (e.predicateLabel.indexOf('中移动直播课网址') > -1) {
          this.setState({ liveClassRoom: e.object })
          this.handleVideoInfo(e.object)
          return
        }
        if (e.object.indexOf('getjpg') > 0 || e.object.indexOf('getpng') > 0) {
          imgList.push(e)
        } else {
          const target = _.find(result, { predicateLabel: e.predicateLabel })
          const text = e.objectLabel ? e.objectLabel : e.object
          if (!target) {
            result.push({
              ...e,
              labelList: [text],
            })
          } else if (target.labelList.indexOf(text) < 0) {
            target.labelList.push(text)
          }
        }
      }
    })
    this.setState({ imgList })
    return result
  }

  handleAnchor = (e) => {
    e.preventDefault()
  }

  handleTitle = (title) => {
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

  handleSelectChart = (selectChart) => {
    this.setState({ selectChart })
  }

  handleConcat = (list) => {
    const transSource = [{
      知识点: '',
      '': '',
      知识内容: '',
    }]
    const sheetDataFilter = ['知识点', '', '知识内容']
    const sheetDataHeader = ['知识点', '', '知识内容']
    list.forEach((e) => {
      if (e.labelList) {
        transSource.push({
          知识点: e.predicateLabel,
          '': '',
          知识内容: e.labelList.filter((j) => { return j.indexOf('http') < 0 }).join(', '),
        })
      } else {
        transSource.push({
          知识点: e.predicateLabel,
          '': '',
          知识内容: e.object,
        })
      }
    })
    return { transSource, sheetDataFilter, sheetDataHeader }
  }

  handleExpandGraph = async (target) => {
    await this.setState({ forcename: target.name })
    this.getChart()
  }

  handleVideoInfo = async (url) => {
    const data = await infoByCmccUrl({
      url,
    })
    if (data) {
      this.setState({
        classRoomInfo: data.data,
      })
    }
  }

  handleVideo = (url, classRoomInfo) => {
    return (
      <div style={{ padding: 10 }}>
        <a href={url.length === 0 ? 'http://edu.10086.cn/cloud/liveClassroom/redirectLive?type=live_Index' : url} target="_blank">
          <img src={classRoomInfo.coverImageUrl ? classRoomInfo.coverImageUrl : edu10086} height="240px" width="360px" alt="" />
          <div style={{ width: 360, textAlign: 'center', fontSize: 16, marginTop: 6 }}>
            {classRoomInfo.name ? classRoomInfo.name : '和教育直播课'}
          </div>
          <div style={{ width: 360, textAlign: 'center', fontSize: 14 }}>
            {classRoomInfo.teacherName ? `主讲：${classRoomInfo.teacherName}` : null}
          </div>
        </a>
      </div>
    )
  }

  handleRelation = (graph) => {
    const result = []
    _.uniqBy(graph.nodes, 'name').filter((e) => { return e.name.indexOf('实体') < 0 }).forEach((e, index) => {
      if (index > 20) {
        return
      }
      result.push(
        <div style={{ padding: 6 }}>
          <a
            href="javascript:;" style={{ margin: 10, color: '#24b0e6' }}
            onClick={() => this.handleExpandGraph(e)}
          >
            <Icon theme="filled" type="right-circle" style={{ marginRight: 10 }} />
            {e.name}
          </a>
        </div>,
      )
    })
    return result
  }

  renderAnchor = (list) => {
    const result = []
    for (const title of list) {
      result.push(<Link href={`#anchor_${title}`} style={{ margin: 10 }} title={this.handleTitle(title)} />)
    }
    return result
  }

  handleChangeBooksMode = (booksMode) => {
    this.setState({ booksMode })
  }

  clickDownload = () => {
    this.myTable.downLoad()
  }

  render() {
    const anchorList = ['graph', 'property', 'video']
    const {
      forcename, loading, graph, dataSource, imgList, booksMode,
      subject, thinkData, selectChart, liveClassRoom, classRoomInfo,
    } = this.state
    if (imgList.length > 0) {
      anchorList.push('picture')
    }
    anchorList.push('question')
    anchorList.push('books')
    const { transSource, sheetDataFilter, sheetDataHeader } = this.handleConcat(dataSource)
    const dataConfig = {
      title: forcename,
      dataSource: transSource,
      sheetDataFilter,
      sheetDataHeader,
    }
    return (
      <div style={{ minWidth: 1300, backgroundColor: '#f2f6f7e6' }}>
        <Script
          url="http://39.97.172.123:3000/cmcc/data.js"
          onCreate={() => this.onhandleScript('create')}
          onError={() => this.onhandleScript('error')}
          onLoad={() => this.onhandleScript('load')}
        />
        <div style={{ float: 'left', width: 250 }}>
          <div style={{ height: 60, marginLeft: 30, marginTop: 6 }}>
            <img style={{ float: 'left' }} src={GrapeImg} alt="" height="60px" />
            <div style={{ fontSize: 32, float: 'left', color: '#6e72df', fontWeight: 700, marginTop: 6 }}>知识维基</div>
          </div>
          <Anchor onClick={this.handleAnchor} className={Styles.anchor}>
            {this.renderAnchor(anchorList)}
          </Anchor>
        </div>
        <div style={{ overflow: 'hidden' }}>
          <Spin spinning={loading}>
            <GCard show title="graph" selectChart={selectChart} onSelect={this.handleSelectChart}>
              {selectChart === 'relation'
                ? (
                  <div style={{ height: 450 }}>
                    <div style={{ float: 'left', width: 210, borderRight: '1px solid #e8e8e8', height: '100%' }}>
                      <Tabs>
                        <TabPane tab="关联知识" key="1" style={{ height: 420 }}>
                          <div style={{ height: '100%', overflow: 'scroll' }}>
                            <NewTree
                              gData={graph.treeData}
                              handleExpandGraph={this.handleExpandGraph}
                            />
                          </div>
                        </TabPane>
                      </Tabs>
                    </div>
                    <div style={{ height: '100%', width: 'auto', overflow: 'hidden' }}>
                      <Chart
                        graph={graph} forcename={forcename}
                        handleExpandGraph={this.handleExpandGraph}
                      />
                    </div>
                  </div>
                ) : <div />}
              {
                selectChart === 'relation' ? <div /> : (
                  <Think
                    graph={thinkData}
                    forcename={forcename}
                    subject={subject}
                    select={graph.nodes}
                    dataSource={dataSource}
                  />
                )
              }
            </GCard>
            <NewCard show showExtra dataConfig={dataConfig} title="property" downLoadImg={this.clickDownload}>
              <KgTable
                dataSource={dataSource}
                ref={(e) => this.myTable = e}
                forcename={forcename}
              />
            </NewCard>
            <NewCard show title="video">
              <div style={{ height: 300 }}>
                {this.handleVideo(liveClassRoom, classRoomInfo)}
              </div>
            </NewCard>
            <NewCard show={imgList.length > 0} title="picture">
              <Gallery imgList={imgList} />
            </NewCard>
            <NewCard show title="question">
              <Questions uri={forcename} />
            </NewCard>
            <NewCard show title="books" booksMode={booksMode} handleChangeBooksMode={this.handleChangeBooksMode}>
              {booksMode === 'list' ? <BooksList name={forcename} /> : <BooksMasonry name={forcename} />}
            </NewCard>
          </Spin>
        </div>
      </div>
    )
  }
}
export default KgContent
