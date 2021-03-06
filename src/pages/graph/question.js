import React from 'react'
import { Radio, Spin, Empty } from 'antd'
import { questionListByUriName } from '@/services/knowledge'

class StudentPersona extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      test: [],
      answerValue: {
      },
      loading: false,
    }
  }

  UNSAFE_componentWillMount = () => {
    this.getQs(this.props.uri)
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    if (nextProps.uri !== this.props.uri) {
      this.getQs(nextProps.uri)
    }
  }

  getQs = async (uri) => {
    this.setState({ loading: true })
    this.setState({
      test: [],
      answerValue: {},
    })
    if (uri === undefined || uri === '') {
      return
    }
    const data = await questionListByUriName({
      uriName: uri,
    })
    if (data) {
      const test = []
      let temp1 = []
      let temp2 = []
      let temp3 = []
      let temp4 = []
      data.data.forEach((e) => {
        if (!e.qAnswer || !e.qBody) {
          return
        }
        if (e.qAnswer.length > 1 && e.qAnswer !== '答案A' && e.qAnswer !== '答案B' && e.qAnswer !== '答案C' && e.qAnswer !== '答案D') {
          return
        }
        if (e.qBody.indexOf('．') > -1) {
          temp1 = e.qBody.split('A．')
          if (!temp1[1]) {
            return
          }
          temp2 = temp1[1].split('B．')
          if (!temp2[1]) {
            return
          }
          temp3 = temp2[1].split('C．')
          if (!temp3[1]) {
            return
          }
          temp4 = temp3[1].split('D．')
        } else {
          temp1 = e.qBody.split('A.')
          if (!temp1[1]) {
            return
          }
          temp2 = temp1[1].split('B.')
          if (!temp2[1]) {
            return
          }
          temp3 = temp2[1].split('C.')
          if (!temp3[1]) {
            return
          }
          temp4 = temp3[1].split('D.')
        }
        test.push({
          title: temp1[0],
          a: temp2[0],
          b: temp3[0],
          c: temp4[0],
          d: temp4[1],
          id: e.id,
          correctAnswer: e.qAnswer.length > 1 ? e.qAnswer.split('答案')[1] : e.qAnswer,
        })
      })
      this.setState({
        test,
      })
    }
    this.setState({ loading: false })
  }

  handleQuestion = (value, id) => {
    const { answerValue } = this.state
    answerValue[id] = value
    this.setState({ answerValue })
  }

  renderQuestions = (arr) => {
    if (!arr) {
      return
    }
    const { answerValue } = this.state
    const result = []
    arr.forEach((item) => {
      const { title, a, b, c, d } = item
      result.push(
        <div style={{ padding: 10 }}>
          <h3>
            {title}
            &nbsp;&nbsp;&nbsp;&nbsp;
            {answerValue[item.id] ? `当前选择：${answerValue[item.id]}` : ''}
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span style={{ display: answerValue[item.id] ? 'inline-block' : 'none' }}>
              <span style={{ color: 'green' }}>
                {item.correctAnswer.indexOf(answerValue[item.id]) > -1 ? '正确' : ''}
              </span>
              <span style={{ color: 'red' }}>
                {item.correctAnswer.indexOf(answerValue[item.id]) < 0 ? `正确答案：${item.correctAnswer}` : ''}
              </span>
            </span>
          </h3>
          <Radio.Group
            value={answerValue[item.id]}
            onChange={(e) => this.handleQuestion(e.target.value, item.id)}
          >
            <Radio value="A">
              A.
              {a}
            </Radio>
            <br />
            <Radio value="B">
              B.
              {b}
            </Radio>
            <br />
            <Radio value="C">
              C.
              {c}
            </Radio>
            <br />
            <Radio value="D">
              D.
              {d}
            </Radio>
          </Radio.Group>
        </div>,
      )
    })
    return result
  }

  render() {
    const { test, loading } = this.state
    return (
      <div>
        <Spin
          spinning={loading}
        >
          <div
            style={{ minHeight: 100 }}
          >
            <Empty
              style={{ display: loading === false && test.length < 1 ? 'block' : 'none' }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无习题数据"
            />
            {this.renderQuestions(test)}
          </div>
        </Spin>
      </div>
    )
  }
}

export default StudentPersona
