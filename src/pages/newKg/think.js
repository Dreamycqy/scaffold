import React from 'react'
import * as echarts from 'echarts'
import resizeListener, { unbind } from 'element-resize-event'

const colors = ['#32C5E9', '#67E0E3', '#9FE6B8', '#FFDB5C', '#ff9f7f', '#fb7293', '#E062AE', '#E690D1', '#e7bcf3', '#9d96f5', '#8378EA', '#96BFFF']

export default class GraphChart extends React.Component {
  constructor(...props) {
    super(...props)
    this.dom = null
    this.instance = null
  }

  componentDidMount() {
    const { graph } = this.props
    try {
      this.instance = this.renderChart(this.dom, graph, this.instance)
      resizeListener(this.dom, () => {
        this.instance = this.renderChart(this.dom, graph, this.instance, true)
      })
    } catch (e) {
      console.log(e); // eslint-disable-line
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { graph } = nextProps
    this.instance = this.renderChart(this.dom, graph, this.instance)
  }

  componentWillUnmount() {
    unbind(this.dom)
    this.instance && this.instance.dispose()  //  eslint-disable-line
  }

  handleData = (data, color) => {
    return data.map((item, index) => {
      if (item.level === '3') {
        color = colors[index % 10]
      }
      switch (item.level) {
        case '2':
          item.symbolSize = 70
          break
        case '3':
          item.symbolSize = 50
          break
        case '4':
          item.symbolSize = 30
          break
        case '5':
          item.symbolSize = 10
          break
        default:
          item.symbolSize = 10
          break
      }
      // 设置线条颜色
      item.lineStyle = { color }
      if (item.children) { // 存在子节点
        item.itemStyle = {
          borderColor: color,
          color,
        }
        item.children = this.handleData(item.children, color)
      } else { // 不存在
        item.itemStyle = {
          color: 'transparent',
          borderColor: color,
        }
      }
      return item
    })
  }

  renderChart = (dom, graph, instance, forceUpdate = false) => {
    let options
    if (!graph) {
      options = {
        ...options,
        title: {
          // text: '暂无数据',
          x: '56%',
          y: 'center',
        },
      }
    } else {
      const result = graph
      options = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
        },
        series: [
          {
            type: 'tree',
            hoverAnimation: true,
            data: result.children ? this.handleData([result], '#37A2DA') : [],
            bottom: 0,
            left: 0,
            right: 0,
            layout: 'radial',
            symbol: 'circle',
            symbolSize: 10,
            nodePadding: 20,
            animationDurationUpdate: 750,
            expandAndCollapse: true,
            initialTreeDepth: 2,
            roam: true,
            focusNodeAdjacency: true,
            itemStyle: {
              borderWidth: 1,
            },
            label: {
              color: '#000000a6',
              fontSize: 16,
              fontFamily: 'SourceHanSansCN',
              position: 'inside',
              rotate: 0,
            },
            lineStyle: {
              width: 1,
              curveness: 0,
            },
            emphasis: {
              focus: 'ancestor',
              lineStyle: {
                width: 6,
              },
            },
          },
        ],
      }
    }
    let myChart = null
    if (forceUpdate === true) {
      myChart = instance
      myChart.resize()
      myChart.setOption(options)
      return myChart
    }
    if (instance) {
      myChart = instance
    } else myChart = echarts.init(dom)
    myChart.clear()
    myChart.resize()
    myChart.setOption(options)
    // if (myChart._$handlers.click) { // eslint-disable-line
    //   myChart._$handlers.click.length = 0 // eslint-disable-line
    // }
    // myChart.on('click', (params) => {
    //   that.props.getNewInstance(params.data['知识点编码'])
    // })
    return myChart
  }

  render() {
    return (
      <div className="e-charts-graph" ref={(t) => this.dom = t} style={{ height: '100%', width: '100%' }} />
    )
  }
}
