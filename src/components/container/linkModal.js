import React from 'react'
import { Modal } from 'antd'
import styles from './local.css'

export default class EpubModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
    }
  }

  epubimg = (content) => {
    const { htmlId, searchKey } = this.props
    const postUrl = 'http://39.100.31.203:8007/epubimg'
    const ExportForm = document.createElement('FORM')
    ExportForm.id = 'form'
    ExportForm.style.display = 'none'
    ExportForm.action = postUrl
    ExportForm.method = 'post'
    ExportForm.target = '_blank'
    const newElement = document.createElement('input')
    newElement.setAttribute('name', 'htmlId')
    newElement.value = htmlId
    newElement.setAttribute('type', 'hidden')
    const newElement1 = document.createElement('input')
    newElement1.setAttribute('name', 'content')
    newElement1.value = content
    newElement1.setAttribute('type', 'hidden')
    const newElement2 = document.createElement('input')
    newElement2.setAttribute('name', 'searchKey')
    newElement2.value = searchKey
    newElement2.setAttribute('type', 'hidden')
    ExportForm.appendChild(newElement)
    ExportForm.appendChild(newElement1)
    ExportForm.appendChild(newElement2)
    document.body.appendChild(ExportForm)
    ExportForm.submit()
    ExportForm.remove()
  }

  renderList = (dataSource) => {
    const result = []
    if (dataSource) {
      dataSource.forEach(
        (e, index) => {
          result.push(
            <span key={e} style={{ display: 'inline-block' }}>
              <a
                href="javascript:;"
                className={styles.aLink}
                onClick={() => this.epubimg(e)}
                dangerouslySetInnerHTML={{ __html: `${index + 1}.${e}` }} // eslint-disable-line
              />
              <br />
              <br />
            </span>,
          )
        },
      )
    }
    return result
  }

  render() {
    const { list } = this.props
    const { show } = this.state
    return (
      <div>
        <a
          href="javascript:;"
          onClick={() => this.setState({ show: !show })}
          style={{ color: '#b0b8b9', float: 'right' }}
        >
          {`查看全部${list.length}个相关结果>>`}
        </a>
        <Modal
          title="原文链接"
          visible={show}
          footer={[null]}
          onCancel={() => this.setState({ show: false })}
          width="900px"
        >
          {this.renderList(list)}
        </Modal>
      </div>
    )
  }
}