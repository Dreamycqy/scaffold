import React from 'react'
import { Modal, Button } from 'antd'
import _ from 'lodash'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import styles from './local.css'

export default class EpubModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      selectImg: {
        src: '',
        index: 0,
        title: '',
      },
    }
  }

  UNSAFE_componentWillReceiveProps = (nextProps) => {
    this.setState({
      selectImg: {
        src: nextProps.imgList[0].src,
        index: 0,
        title: nextProps.imgList[0].title,
      },
    })
  }

  chooseImg = (num) => {
    const { imgList } = this.props
    this.setState({
      show: true,
      selectImg: {
        index: num,
        src: imgList[num].src,
        title: imgList[num].title,
      },
    })
  }

  renderImg = (list) => {
    const result = []
    const { imgList } = this.props
    list.forEach((e) => {
      result.push(
        <div>
          <a href="javascript:;" onClick={() => this.chooseImg(_.findIndex(imgList, { src: e.src }))}>
            <img style={{ border: '1px solid #e8e8e8', margin: 20, objectFit: 'cover' }} src={`http://39.100.31.203:8001/api/wiki/getImage?path=${e.src}`} alt="" height="150px" width="150px" />
          </a>
        </div>,
      )
    })
    return result
  }

  render() {
    const { imgList } = this.props
    const { show, selectImg } = this.state
    return (
      <div>
        <a
          href="javascript:;"
          onClick={() => this.setState({ show: !show })}
          style={{ color: '#b0b8b9', float: 'right' }}
        >
          {`查看全部${imgList.length}个相关结果>>`}
        </a>
        <Modal
          title="原文图片"
          visible={show}
          footer={[null]}
          onCancel={() => this.setState({ show: false })}
          width="900px"
        >
          <div style={{ marginTop: 20 }}>
            <div style={{ textAlign: 'center', minHeight: 320 }}>
              <a href="javascript:;" onClick={() => { window.open(`http://39.100.31.203:8001/api/wiki/getImage?path=${selectImg.src}`) }}>
                <img src={`http://39.100.31.203:8001/api/wiki/getImage?path=${selectImg.src}`} alt="" style={{ maxHeight: 600 }} />
              </a>
            </div>
            <div style={{ textAlign: 'center' }}>
              <a
                href="javascript:;"
                className={styles.aLink}
                onClick={() => {}}
                style={{ margin: 10 }}
                dangerouslySetInnerHTML={{ __html: `${selectImg.index + 1}.${selectImg.title}` }}
              />
            </div>
            <div style={{ marginTop: 20, textAlign: 'center' }}>
              <Button type="primary" style={{ marginRight: 20 }} disabled={selectImg.index === 0} onClick={() => this.chooseImg(selectImg.index - 1)}>前一张</Button>
              <span>
                第&nbsp;
                {selectImg.index + 1}
                &nbsp;
                /
                &nbsp;
                {imgList.length}
                &nbsp;张
              </span>
              <Button type="primary" style={{ marginLeft: 20 }} disabled={selectImg.index === imgList.length - 1} onClick={() => this.chooseImg(selectImg.index + 1)}>后一张</Button>
            </div>
          </div>
          <Slider
            style={{ height: 180, border: '1px solid #e8e8e8', margin: '20px 0' }}
            dots slidesPerRow={5}
            autoplay autoplaySpeed={3000}
          >
            {this.renderImg(imgList)}
          </Slider>
        </Modal>
      </div>
    )
  }
}
