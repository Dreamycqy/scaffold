import React from 'react'
import LinkModal from './linkModal'
import styles from './local.css'

export default class Epub extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
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
          if (index < 2) {
            result.push(
              <span key={e.title} style={{ display: 'inline-block' }}>
                <a
                  href="javascript:;"
                  className={styles.aLink}
                  onClick={() => {}}
                  dangerouslySetInnerHTML={{ __html: `${index + 1}.${e.title}` }} // eslint-disable-line
                />
                <br />
              </span>,
            )
          }
        },
      )
    }
    return result
  }

  render() {
    const { list } = this.props
    return (
      <div
        style={{
          overflow: 'hidden', fontSize: 12, position: 'relative', paddingTop: 10,
        }}
      >
        <h3>原文链接</h3>
        {this.renderList(list)}
        <div style={{ marginTop: 10, height: 16 }}>
          <LinkModal imgList={list} />
        </div>
      </div>
    )
  }
}
