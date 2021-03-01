import React from 'react'
import { Spin } from 'antd'
import * as echarts from 'echarts'
import _ from 'lodash'
import resizeListener, { unbind } from 'element-resize-event'
import subList from '@/constants/subject'
import { searchByKnowIdV3 } from '@/services/knowledge'

export default class GraphChart extends React.Component {
  constructor(props) {
    super(props)
    this.dom = null
    this.instance = null
    this.state = {
      loading: false,
    }
  }

  async componentDidMount() {
    const { select } = this.props
    const { graph } = await this.getData(this.props)
    try {
      this.instance = this.renderChart(this.dom, graph, select, this.instance)
      resizeListener(this.dom, () => {
        this.instance = this.renderChart(this.dom, graph, select, this.instance, true)
      })
    } catch (e) {
      console.log(e); // eslint-disable-line
    }
  }

  UNSAFE_componentWillReceiveProps = async (nextProps) => {
    if (!_.isEqual(nextProps, this.props)) {
      const { graph } = await this.getData(nextProps)
      this.instance = this.renderChart(this.dom, graph, nextProps.select, this.instance)
    }
  }

  componentWillUnmount() {
    unbind(this.dom)
    this.instance && this.instance.dispose()  //  eslint-disable-line
  }

  getData = async (props) => {
    this.setState({ loading: true })
    const { select, selectId } = props
    const nodes = [{
      name: select,
      category: '0',
    }]
    const links = []
    const data = await searchByKnowIdV3({
      knowId: selectId,
    })
    if (data.data) {
      data.data.forEach((e) => {
        const newName = e.entity_name === select ? `${e.entity_name} (知识点)` : e.entity_name
        nodes.push({
          name: newName,
          category: newName,
        })
        links.push({
          source: select,
          target: newName,
        })
      })
    }
    this.setState({ loading: false })
    return { graph: { nodes, links } }
  }

  jumpToGraph = (param) => {
    const { data } = param
    const { subject } = this.props
    const { category, name } = data
    if (category === '0') {
      return
    }
    window.open(`/knowledgeWiki/knowledge?name=${name.split(' (知识点)')[0]}&subject=${_.find(subList, { value: subject }).cmcc}`)
  }

  renderChart = (dom, graph, forcename, instance, forceUpdate = false) => {
    let options
    const that = this
    if (!graph.nodes || graph.nodes.length < 1) {
      options = {
        ...options,
        title: {
          // text: '暂无数据',
          x: '56%',
          y: 'center',
        },
      }
    } else {
      const { nodes } = graph
      const categories = []
      nodes.forEach((e) => {
        if (!e.categories) {
          categories.push({
            name: e.name,
          })
        }
      })
      options = {
        title: {
          text: '鼠标单击关联知识点，跳转到该知识点详情页',
          textStyle: {
            fontSize: 14,
            color: '#000000a6',
          },
        },
        toolbox: {
          feature: {
            saveAsImage: {
              name: `概念 ${this.props.select} 的相关知识点`,
            },
          },
        },
        series: [{
          type: 'graph',
          layout: 'force',
          focusNodeAdjacency: true,
          edgeSymbol: ['circle', 'arrow'],
          edgeSymbolSize: [4, 10],
          name: forcename,
          roam: true,
          gravity: 1,
          tooltip: {
            trigger: 'item',
            textStyle: {
              fontSize: 12,
            },
          },
          force: {
            initLayout: 'circular',
            repulsion: 50,
            gravity: 0.01,
            edgeLength: 200,
            layoutAnimation: true,
          },
          linkSymbol: 'arrow',
          categories: [
            {
              name: '0',
              symbolSize: 30,
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                    offset: 0,
                    color: '#ca1001',
                  }, {
                    offset: 1,
                    color: '#ff8980',
                  }]),
                },
              },
            },
            ...categories,
          ],
          lineStyle: {
            color: 'target',
          },
          emphasis: {
            lineStyle: {
              width: 5,
            },
          },
          label: {
            normal: {
              show: true,
              position: 'bottom',
            },
          },
          symbolSize: 20,
          minRadius: 1,
          maxRadius: 5,
          coolDown: 0.995,
          steps: 10,
          nodes,
          links: graph.links,
        }],
      }
    }
    let myChart = null
    if (forceUpdate === true) {
      myChart = instance
      myChart.resize()
      myChart.setOption(options)
      return myChart
    }
    if (instance) myChart = instance
    else myChart = echarts.init(dom, 'light')
    myChart.clear()
    myChart.resize()
    myChart.setOption(options)
    myChart.off('click')
    myChart.on('click', (params) => {
      that.jumpToGraph(params)
    })
    myChart.setOption(options)
    return myChart
  }

  render() {
    const { loading } = this.state
    return (
      <Spin style={{ width: '100%' }} spinning={loading} size="large">
        <div style={{ height: 480, width: 860 }}>
          <div className="e-charts-graph" ref={(t) => this.dom = t} style={{ height: '100%', width: '100%' }} />
        </div>
      </Spin>
    )
  }
}
