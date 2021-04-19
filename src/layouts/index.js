import React from 'react'
import { Layout, ConfigProvider, Menu } from 'antd'
import { connect } from 'dva'
import zh_CN from 'antd/lib/locale-provider/zh_CN'
import en_GB from 'antd/lib/locale-provider/en_GB'
import menuList from '@/constants/menuList'
import banner from '@/assets/banner.jpg'
import NewHeader from './header'

const {
  Footer, Content,
} = Layout

function mapStateToProps(state) {
  const { locale } = state.global
  return {
    locale,
  }
}
@connect(mapStateToProps)
class MainLayout extends React.Component {
  handleLocaleChange = () => {
    this.props.dispatch({
      type: 'global/updateState',
      payload: {
        locale: this.props.locale === 'cn' ? 'en' : 'cn',
      },
    })
  }

  makeMenu = () => {
    const result = []
    for (const i in menuList) { // eslint-disable-line
      result.push(<Menu.Item key={i}>{menuList[i][this.props.locale]}</Menu.Item>)
    }
    return result
  }

  render() {
    return (
      <Layout>
        <ConfigProvider locale={this.props.locale === 'cn' ? zh_CN : en_GB}>
          <NewHeader />
          <Content style={{ minHeight: 800, marginTop: 40, backgroundImage: `url(${banner})` }}>
            {this.props.children}
          </Content>
          <Footer
            style={{ backgroundColor: '#001529', padding: 30 }}
          >
            <div style={{ padding: '0 30px' }}>
              <div style={{ textAlign: 'center', color: 'white' }}>
                <div style={{ display: 'inline-block' }}>
                  <div style={{ fontSize: 10 }}>Copyright© 2021 KEG</div>
                  <div style={{ fontSize: 10 }}>
                    清华大学知识工程研究室&nbsp;&nbsp;&nbsp;&nbsp;京ICP备19056327号-1
                  </div>
                  <div style={{ fontSize: 10 }}>
                    互联网教育智能技术及应用国家工程实验室
                  </div>
                </div>
              </div>
            </div>
          </Footer>
        </ConfigProvider>
      </Layout>
    )
  }
}

export default MainLayout
