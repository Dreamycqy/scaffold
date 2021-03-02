import React from 'react'
import { Card } from 'antd'
import Epub from '@/components/container/epubLinkM'

export default class BookMasonry extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  render() {
    const {
      bookInfo, images,
    } = this.props.data
    const {
      name, subject, edition, grade, editionTime, isbn, id,
    } = bookInfo
    const imgList = []
    for (const j in images) { // eslint-disable-line
      for (const i in images[j]) { // eslint-disable-line
        imgList.push({
          title: i,
          src: images[j][i],
        })
      }
    }
    return (
      <Card
        style={{ width: '30%', margin: '1%', borderRadius: 4, boxShadow: '4px 4px 4px #00000049', padding: 10 }}
      >
        <h4>
          资源出处：《
          {name}
          》
        </h4>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ fontSize: 12, color: '#b0b8b9', float: 'left', paddingTop: 10 }}>
            <div>
              应用学科：
              {subject}
            &nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <div>
              版本：
              {edition}
            &nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <div>
              适用年级：
              {grade}
              年级&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <div>
              出版时间：
              {editionTime}
            &nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <div>
              ISBN：
              {isbn}
            </div>
          </div>
          <div style={{ float: 'right', marginRight: 10 }}>
            <img
              src={`http://39.100.31.203:8080/res_lib/apiresourceinfo/getcoverimg?resId=${id}`}
              alt="" height="112px"
              width="84px"
            />
          </div>
        </div>
        <Epub list={imgList} searchKey={this.props.name} />
      </Card>
    )
  }
}
