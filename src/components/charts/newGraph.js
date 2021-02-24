import React from 'react'
import * as echarts from 'echarts'
import _ from 'lodash'
import resizeListener, { unbind } from 'element-resize-event'

export default class GraphChart extends React.Component {
  constructor(props) {
    super(props)
    this.dom = null
    this.instance = null
    this.state = {
    }
  }

  componentDidMount() {
    const { graph, forcename } = this.props
    try {
      this.instance = this.renderChart(this.dom, graph, forcename, this.instance)
      resizeListener(this.dom, () => {
        this.instance = this.renderChart(this.dom, graph, forcename, this.instance, true)
      })
    } catch (e) {
      console.log(e); // eslint-disable-line
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      graph, forcename, resize,
    } = nextProps
    if (!_.isEqual(nextState, this.nextState)) {
      return true
    }
    return !_.isEqual(graph, this.props.graph)
      || forcename !== this.props.forcename
      || !_.isEqual(resize, this.props.resize)
  }

  componentDidUpdate() {
    const { graph, forcename } = this.props
    this.instance = this.renderChart(this.dom, graph, forcename, this.instance)
  }

  componentWillUnmount() {
    unbind(this.dom)
    this.instance && this.instance.dispose()  //  eslint-disable-line
  }

  jumpToGraph = (param) => {
    const { data } = param
    const { category, uri, name } = data
    if (category === '0') {
      return
    }
    if (category !== '1') {
      this.props.handleExpandGraph({
        uri,
        name,
      })
    }
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
        if (e.colle && !_.find(categories, { name: e.colle })) {
          categories.push({
            name: e.colle,
          })
        }
      })
      graph.links.forEach((e) => {
        const countList = _.uniqBy(graph.links.filter((j) => {
          return j.target === e.target
        }), 'colle')
        const count = countList.length
        const number = _.findIndex(countList, { target: e.target, colle: e.colle })
        const evencheck = (number % 2) > 0 ? -1 : 1
        e.lineStyle = {
          color: 'target',
          curveness: evencheck * ((number - evencheck > 0 ? 1 : 0) / count),
        }
      })
      if (this.props.newClassGraph) {
        nodes.forEach((e) => {
          if (e.name === forcename) {
            e.symbolSize = 60
            e.category = '2'
            e.label.normal.textStyle = {
              color: '#000000',
              fontWeight: '700',
              fontSize: '16',
            }
          } else {
            e.symbolSize = 20
            e.category = '2'
            e.label.normal.textStyle = {
              color: '#000000',
              fontWeight: 'normal',
              fontSize: '12',
            }
          }
        })
      }
      options = {
        title: {
          text: `${this.props.forcename} 的关系图`,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
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
          emphasis: {
            lineStyle: {
              width: 5,
            },
          },
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
    return (
      <div style={{ height: '100%', width: '100%' }}>
        <div className="e-charts-graph" ref={(t) => this.dom = t} style={{ height: '100%', width: '100%' }} />
      </div>
    )
  }
}
