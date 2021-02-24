import React from 'react'
import { Card, Spin, Select } from 'antd'
import { connect } from 'dva'
import _ from 'lodash'
import Script from 'react-load-script'
import { getUrlParams, makeOption } from '@/utils/common'
import { searchByKnowId } from '@/services/knowledge'
import subjectList from '@/constants/subject'
import Think from './think'
import Tree from './graphTree'
import Styles from './style.less'

const { Option } = Select

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
      subject: getUrlParams().subject ? getUrlParams().subject : 'chinese',
      targetId: '',
      targetList: [],
      gradeLevel: getUrlParams().grade ? getUrlParams().grade : '小学',
      rawData: [],
      thinkData: {},
    }
  }

  UNSAFE_componentWillMount = () => {
    const { subject } = this.state
    this.setState({
      targetId: _.find(subjectList, { value: subject }).name,
    })
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

  handleThinkData = (data, subject, gradeLevel) => {
    this.setState({ subject, gradeLevel })
    const subjectName = _.find(subjectList, { value: subject }).name
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

  render() {
    const {
      loadingChart, thinkData, subject, gradeLevel, targetId, treeData, rawData, targetList,
    } = this.state
    const { locale } = this.props

    const extra = (
      <div style={{ paddingLeft: 10 }}>
        <span>选择学科：</span>
        <Select
          style={{ marginRight: 20, width: 120 }} value={subject}
          onChange={(value) => this.handleThinkData(rawData, value, gradeLevel)}
        >
          {makeOption(subjectList)}
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
      <div style={{ padding: '20px 10px', minWidth: 1300 }}>
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
                <div style={{ float: 'left', height: '100%', width: 'calc(100% - 300px)', overflow: 'hidden' }}>
                  <Think
                    graph={thinkData}
                    subject={subject}
                    target={targetId}
                    targetList={targetList}
                    gradeLevel={gradeLevel}
                    getNewInstance={this.getNewInstance}
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
