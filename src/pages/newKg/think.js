import React from 'react'
import { Modal } from 'antd'
import * as echarts from 'echarts'
import resizeListener, { unbind } from 'element-resize-event'
import Indis from './individuals'

const colors = ['#32C5E9', '#67E0E3', '#9FE6B8', '#FFDB5C', '#ff9f7f', '#fb7293', '#E062AE', '#E690D1', '#e7bcf3', '#9d96f5', '#8378EA', '#96BFFF']

export default class GraphChart extends React.Component {
  constructor(...props) {
    super(...props)
    this.dom = null
    this.instance = null
    this.state = {
      select: '',
      selectId: '',
    }
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
          item.label = {
            fontSize: 16,
          }
          break
        case '3':
          item.symbolSize = 50
          item.label = {
            fontSize: 14,
          }
          break
        case '4':
          item.symbolSize = 30
          item.label = {
            fontSize: 12,
          }
          break
        case '5':
          item.symbolSize = 10
          item.label = {
            fontSize: 12,
          }
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

  handleModal = (params) => {
    this.setState({
      visible: true,
      select: params.data.name,
      selectId: params.data.key,
    })
  }

  renderChart = (dom, graph, instance, forceUpdate = false) => {
    let options
    const that = this
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
        title: {
          text: '鼠标单击节点，展开下层知识概念\n鼠标双击节点，查看与概念相关的知识点',
          textStyle: {
            fontSize: 14,
            color: '#000000a6',
          },
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
            animationDurationUpdate: 1200,
            expandAndCollapse: true,
            initialTreeDepth: 2,
            roam: true,
            focusNodeAdjacency: true,
            itemStyle: {
              borderWidth: 1,
            },
            label: {
              color: '#000000a6',
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
    myChart.off('dblclick')
    myChart.on('dblclick', (params) => {
      that.handleModal(params)
    })
    return myChart
  }

  render() {
    const { visible, select, selectId } = this.state
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <Modal
          title={`概念 ${select} 所关联的知识点`}
          visible={visible}
          onCancel={() => this.setState({ visible: false })}
          footer={[null]}
          width="900px"
        >
          <div style={{ height: 480, width: 900 }}>
            <Indis select={select} selectId={selectId} subject={this.props.subject} />
          </div>
        </Modal>
        <div className="e-charts-graph" ref={(t) => this.dom = t} style={{ height: '100%', width: '100%' }} />
      </div>
    )
  }
}
