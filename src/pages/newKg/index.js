import React from 'react'
import { Card, Spin, Select, Modal } from 'antd'
import { connect } from 'dva'
import _ from 'lodash'
import Script from 'react-load-script'
import { getUrlParams, makeOption } from '@/utils/common'
import { searchByKnowId } from '@/services/knowledge'
import subList from '@/constants/subject'
import Think from './think'
import Tree from './graphTree'
import Indis from './individuals'
import Styles from './style.less'

const { Option } = Select
const gradeList = {
  155: '小学',
  156: '初中',
  157: '高中',
}

function mapStateToProps(state) {
  const { locale } = state.global
  return {
    locale,
  }
}
@connect(mapStateToProps)
class FirstGraph extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      treeData: [],
      loadingChart: false,
      subject: getUrlParams().subject ? _.find(subList, { cmcc: getUrlParams().subject }).value : 'chinese',
      targetId: '',
      targetList: [],
      gradeLevel: getUrlParams().grade ? gradeList[getUrlParams().grade] : '高中',
      rawData: [],
      thinkData: {},
      selectId: getUrlParams().kgId ? getUrlParams().kgId : '',
      visible: false,
    }
  }

  UNSAFE_componentWillMount = () => {
    const { subject } = this.state
    this.setState({
      targetId: _.find(subList, { value: subject }).name,
    })
    if (getUrlParams().kgId) {
      this.setState({ visible: true })
    }
  }

  onhandleScript = async (sign) => {
    if (sign === 'load') {
      await this.setState({ rawData: window.sheet })
      const { subject, gradeLevel } = this.state
      this.handleThinkData(window.sheet, subject, gradeLevel)
    }
  }

  getNewInstance = async (knowId) => {
    this.setState({ loadingChart: true })
    const data = await searchByKnowId({
      knowId,
    })
    const { thinkData } = this.state
    if (data) {
      data.data.forEach((e, index) => {
        let divider = ''
        if (index < 9) {
          divider = '00'
        } else if (index < 99) {
          divider = '0'
        }
        if (!_.find(thinkData, { 知识点名称: e.entity_name })) {
          thinkData.push({
            知识点名称: e.entity_name,
            uri: e.entity_uri,
            层级节点: '6',
            知识点编码: knowId + divider + index,
            学科名称: this.state.subject,
          })
        }
      })
      this.setState({ thinkData })
    }
    this.setState({ loadingChart: false })
  }

  getSelectId = (id) => {
    return _.find(this.state.rawData, { 知识点编码: id }) ? _.find(this.state.rawData, { 知识点编码: id })['知识点名称'] : ''
  }

  handleThinkData = (data, subject, gradeLevel) => {
    this.setState({ subject, gradeLevel })
    const subjectName = _.find(subList, { value: subject }).name
    let rawList = data.filter((e) => {
      return e['学科名称'] === subjectName
    })
    if (gradeLevel === '小学') {
      rawList = rawList.filter((e) => {
        return e['学段名称'] === '小学'
      })
    } else if (gradeLevel === '初中') {
      rawList = rawList.filter((e) => {
        return e['学段名称'] !== '高中'
      })
    }
    const { thinkData, treeData } = this.handleCmcc(rawList, subjectName)
    this.setState({ treeData, thinkData })
  }

  handleCmcc = (list, subjectName) => {
    const result = []
    const map = {
      3: {},
      4: {},
      5: {},
      6: {},
    }
    list.forEach((e) => {
      if (!map[e['层级节点']][e['知识点编码']]) {
        map[e['层级节点']][e['知识点编码']] = {
          ...e,
          name: e['知识点名称'],
          title: e['知识点名称'],
          key: e['知识点编码'],
          children: [],
          level: e['层级节点'],
          collapsed: true,
        }
      }
    })
    for (const i in map['6']) { // eslint-disable-line
      const code = map['6'][i]['知识点编码']
      const father = code.substr(0, code.length - 3)
      if (map['5'][father]) {
        map['5'][father].children.push(map['6'][i])
      }
    }
    for (const i in map['5']) { // eslint-disable-line
      const code = map['5'][i]['知识点编码']
      const father = code.substr(0, code.length - 3)
      if (map['4'][father]) {
        map['4'][father].children.push(map['5'][i])
      }
    }
    for (const i in map['4']) { // eslint-disable-line
      const code = map['4'][i]['知识点编码']
      const father = code.substr(0, code.length - 3)
      if (map['3'][father]) {
        map['3'][father].children.push(map['4'][i])
      }
    }
    for (const i in map['3']) { // eslint-disable-line
      result.push(map['3'][i])
    }
    return {
      thinkData: {
        name: subjectName,
        key: subjectName,
        children: result,
        level: '2',
        label: {
          color: '#000000a6',
          fontSize: 16,
          fontFamily: 'SourceHanSansCN',
          position: 'inside',
          rotate: 0,
        },
      },
      treeData: [{
        title: subjectName,
        name: subjectName,
        key: subjectName,
        children: result,
      }],
    }
  }

  selectTarget = (targetId, targetList) => {
    this.setState({ targetId, targetList })
  }

  showModal = (params) => {
    this.setState(params)
  }

  render() {
    const {
      loadingChart, thinkData, subject, gradeLevel, targetId, treeData, rawData, targetList,
      visible, selectId,
    } = this.state
    const { locale } = this.props

    const extra = (
      <div style={{ paddingLeft: 10 }}>
        <span>选择学科：</span>
        <Select
          style={{ marginRight: 20, width: 120 }} value={subject}
          onChange={(value) => this.handleThinkData(rawData, value, gradeLevel)}
        >
          {makeOption(subList)}
        </Select>
        <span>选择学段：</span>
        <Select
          style={{ marginRight: 20, width: 120 }} value={gradeLevel}
          onChange={(value) => this.handleThinkData(rawData, subject, value)}
        >
          <Option value="小学" key="小学">小学</Option>
          <Option value="初中" key="初中">初中</Option>
          <Option value="高中" key="高中">高中</Option>
        </Select>
      </div>
    )

    return (
      <div style={{ padding: '20px 10px', minWidth: 1400 }}>
        <Modal
          title={`概念 ${this.getSelectId(selectId)} 所关联的知识点`}
          visible={visible}
          onCancel={() => this.setState({ visible: false })}
          footer={[null]}
          width="900px"
        >
          <div style={{ height: 480, width: 900 }}>
            <Indis select={this.getSelectId(selectId)} selectId={selectId} subject={subject} />
          </div>
        </Modal>
        <Script
          url="http://39.97.172.123:3000/cmcc/data.js"
          onCreate={() => this.onhandleScript('create')}
          onError={() => this.onhandleScript('error')}
          onLoad={() => this.onhandleScript('load')}
        />
        <div style={{ minHeight: 700 }}>
          <Card
            style={{ margin: '0 10px', minHeight: 700 }}
            title={(
              <span style={{ color: '#fff' }}>{locale === 'cn' ? '思维导图全图' : 'Relation Graph'}</span>
            )}
            className={Styles.myCard}
            extra={extra}
          >
            <Spin spinning={loadingChart}>
              <div style={{ height: 660 }}>
                <div
                  style={{
                    float: 'left',
                    width: 300,
                    borderRight: '1px solid #e8e8e8',
                    height: 660,
                    overflowY: 'scroll',
                    padding: '0 10px',
                  }}
                >
                  <Tree
                    treeData={treeData}
                    selectTarget={this.selectTarget}
                    target={targetId}
                  />
                </div>
                <div style={{ height: '100%', width: 1000, overflow: 'hidden' }}>
                  <Think
                    graph={thinkData}
                    subject={subject}
                    target={targetId}
                    targetList={targetList}
                    gradeLevel={gradeLevel}
                    getNewInstance={this.getNewInstance}
                    showModal={this.showModal}
                  />
                </div>
              </div>
            </Spin>
          </Card>
        </div>
      </div>
    )
  }
}

export default FirstGraph
