import React from 'react'
import { Card, Icon, Popover, Button } from 'antd'
import moment from 'moment'
import ExportJsonExcel from 'js-export-excel'
import { handleIcon, handleTitle } from '@/utils/common'
import edulogo from '@/assets/edulogo.png'
import Styles from '../style.less'

const ButtonGroup = Button.Group

export default class LocalCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  handleOutput = () => {
    const option = {}
    if (this.props.dataConfig) {
      option.fileName = `${this.props.dataConfig.title}_知识卡片_${moment().format('YYYY-MM-DD_HH-mm-ss')}`
      option.datas = [
        {
          sheetData: this.props.dataConfig.dataSource,
          sheetName: '知识卡片',
          sheetFilter: this.props.dataConfig.sheetDataFilter,
          sheetHeader: this.props.dataConfig.sheetDataHeader,
        },
      ]
    }
    const exportExcel = new ExportJsonExcel(option)
    exportExcel.saveExcel()
  }

  renderChildren = (value) => {
    return React.Children.map(this.props.children, (child) => {
      return React.cloneElement(child, {
        data: value,
      })
    })
  }

  render() {
    const { value, show, title, showExtra, booksMode } = this.props
    return (
      <div>
        <div id={`anchor_${title}`} style={{ height: 10 }} />
        <Card
          className={Styles.myCard}
          bordered={false}
          style={{ display: show === true ? 'block' : 'none', margin: '10px 20px' }}
          title={(
            <span style={{ color: '#fff' }}>
              <Icon type={handleIcon(title)} style={{ color: '#fff', marginRight: 10 }} />
              {handleTitle(title)}
            </span>
        )}
          extra={showExtra ? (
            <div>
              <Popover
                content={(
                  <div style={{ width: 400 }}>
                    表格展示了词条关联的各知识点，下载文件时输出excel
                  </div>
              )}
                title="说明"
              >
                <a style={{ marginRight: 20, fontSize: 18 }} href="javascript:;"><Icon type="question-circle" /></a>
              </Popover>
              <Button style={{ marginRight: 10 }} onClick={() => this.handleOutput()}>
                下载为表格
              </Button>
              <Button onClick={() => this.props.downLoadImg()}>
                下载为图片
              </Button>
            </div>
          ) : title === 'video' ? (
            <a href="javascript:;" onClick={() => window.open('http://edu.10086.cn/cloud/liveClassroom/redirectLive?type=live_Index')}>
              <img src={edulogo} alt="" height="30px" />
            </a>
          ) : title === 'books' ? (
            <ButtonGroup style={{ marginRight: 20 }}>
              <Button
                type={booksMode === 'masonry' ? 'primary' : 'none'}
                onClick={() => this.props.handleChangeBooksMode('masonry')}
              >
                瀑布流
              </Button>
              <Button
                type={booksMode === 'list' ? 'primary' : 'none'}
                onClick={() => this.props.handleChangeBooksMode('list')}
              >
                列表
              </Button>
            </ButtonGroup>
          ) : null}
        >
          {this.renderChildren(value)}
        </Card>
      </div>
    )
  }
}
