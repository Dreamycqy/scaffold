import React from 'react'
import { Row, Col, Carousel } from 'antd'
import Hr from '@/components/items/hr'

const sliderList = [1, 2, 3, 4]

class Home extends React.Component {
  renderSlider = (list) => {
    return list.map((item, index) => {
      return (
        <div>
          <div style={{ backgroundColor: '#364d79', height: 300, lineHeight: '300px', textAlign: 'center', overflow: 'hidden' }}>
            <h1 style={{ color: '#fff' }}>
              第
              {index}
              个平台重点介绍
            </h1>
          </div>
        </div>
      )
    })
  }

  render() {
    return (
      <div>
        <div>
          <Carousel effect="fade" autoplay style={{ height: 290, marginBottom: 30 }}>
            {this.renderSlider(sliderList)}
          </Carousel>
        </div>
        <div style={{ textAlign: 'center', padding: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{ fontWeight: 700, fontSize: 30, color: '#fff' }}>系统简介</div>
            <Hr width={25} />
          </div>
          <div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'inline-block', margin: 10 }}>
                <img width="90px" height="90px" alt="" src={require('@/assets/knowledge.png')} />
                <br />
                <br />
                <p style={{ color: '#fff' }}>本体构建</p>
              </div>
              <div style={{ display: 'inline-block' }}>
                <img width="50px" height="50px" style={{ marginBottom: 150 }} alt="" src={require('@/assets/j.png')} />
              </div>
              <div style={{ display: 'inline-block', margin: 10 }}>
                <img width="90px" height="90px" alt="" src={require('@/assets/labelpic.png')} />
                <br />
                <br />
                <p style={{ color: '#fff' }}>语义标注</p>
              </div>
              <div style={{ display: 'inline-block' }}>
                <img width="50px" height="50px" style={{ marginBottom: 150 }} alt="" src={require('@/assets/j.png')} />
              </div>
              <div style={{ display: 'inline-block', margin: 10 }}>
                <img style={{ width: 100, height: 100 }} alt="" src={require('@/assets/completion.png')} />
                <br />
                <br />
                <p style={{ color: '#fff' }}>数据抽取</p>
              </div>
              <div style={{ display: 'inline-block' }}>
                <img width="50px" height="50px" style={{ marginBottom: 150 }} alt="" src={require('@/assets/j.png')} />
              </div>
              <div style={{ display: 'inline-block', margin: 10 }}>
                <img style={{ width: 80, height: 80, marginBottom: 10 }} alt="" src={require('@/assets/extract.png')} />
                <br />
                <br />
                <p style={{ color: '#fff' }}>数据对齐</p>
              </div>
              <div style={{ display: 'inline-block' }}>
                <img width="50px" height="50px" style={{ marginBottom: 150 }} alt="" src={require('@/assets/j.png')} />
              </div>
              <div style={{ display: 'inline-block', margin: 10 }}>
                <img width="90px" height="90px" alt="" src={require('@/assets/fuse.png')} />
                <br />
                <br />
                <p style={{ color: '#fff' }}>数据融合</p>
              </div>
            </div>
            <div style={{ border: '1px dashed #a6dff4', borderRadius: 10, padding: 40, fontSize: 20, width: 1000, display: 'inline-block' }}>
              <span style={{ color: '#fbe07a' }}>
                ★关于基础教育知识图谱开放应用平台
              </span>
              <br />
              <br />
              <p style={{ color: '#fff' }}>
                基础教育知识图谱开放应用平台，致力于为基础教育领域的知识工程提供服务，给研究人员提供了从数据标准、图谱构建、智能服务再到具体应用场景的一系列参考。
                <br />
                平台以大规模的基础教育领域知识图谱为基础，涵盖了图谱展示、图谱智能应用、落地应用情景等多元内容。
                其核心的知识图谱本体库由先进的自然语言处理和知识聚合对齐技术构建，包含3100多万条三元组、530万多个实例、700多个概念、4000多个属性。
              </p>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', minHeight: 450, padding: 40, backgroundColor: '#fff' }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{ fontWeight: 700, fontSize: 30 }}>功能介绍</div>
            <Hr width={25} />
          </div>
          <div>
            <Row gutter={16} style={{ marginTop: 30, width: 1000, display: 'inline-block' }}>
              <Col style={{ height: 180 }} span={8}>
                <div style={{ border: '1px solid #e8e8e8', height: 180, textAlign: 'center', padding: 20 }}>
                  <h1>
                    知识图谱可视化展示
                  </h1>
                  <p style={{ fontSize: 16 }}>
                    本平台提供了对基础教育知识图谱内容的搜索与浏览功能。
                    涵盖概念体系，实体关联，实体属性等各方面的可视化展示。
                  </p>
                </div>
              </Col>
              <Col style={{ height: 180 }} span={8}>
                <div style={{ border: '1px solid #e8e8e8', height: 180, textAlign: 'center', padding: 20 }}>
                  <h1>
                    记忆类问题智能问答
                  </h1>
                  <p style={{ fontSize: 16 }}>
                    问答系统针对中小学基础教育中的知识记忆类问题，采用先进技术识别自然语言提问，用准确、简洁的语言回答用户提出的问题。
                  </p>
                </div>
              </Col>
              <Col style={{ height: 180 }} span={8}>
                <div style={{ border: '1px solid #e8e8e8', height: 180, textAlign: 'center', padding: 20 }}>
                  <h1>
                    知识图谱服务API
                  </h1>
                  <p style={{ fontSize: 16 }}>
                    提供了平台关于知识图谱的主要服务的API开放调用。
                  </p>
                </div>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 20, width: 1000, display: 'inline-block' }}>
              <Col style={{ height: 180 }} span={8}>
                <div style={{ border: '1px solid #e8e8e8', height: 180, textAlign: 'center', padding: 20 }}>
                  <h1>
                    知识点多媒体资源关联
                  </h1>
                  <p style={{ fontSize: 16 }}>
                    内置电子文档处理模块和主流知识网站爬虫管理系统，基于先进的自然语言处理技术，由爬虫或人工快速从数据源获取结构化数据。
                  </p>
                </div>
              </Col>
              <Col style={{ height: 180 }} span={8}>
                <div style={{ border: '1px solid #e8e8e8', height: 180, textAlign: 'center', padding: 20 }}>
                  <h1>
                    多渠道数据对齐
                  </h1>
                  <p style={{ fontSize: 16 }}>
                    基于默认或自定义算法，将实体文件或网络来源的多渠道结构化数据，与图谱数据对齐
                  </p>
                </div>
              </Col>
              <Col style={{ height: 180 }} span={8}>
                <div style={{ border: '1px solid #e8e8e8', height: 180, textAlign: 'center', padding: 20 }}>
                  <h1>
                    冲突数据融合
                  </h1>
                  <p style={{ fontSize: 16 }}>
                    多来源、多版本图谱数据融合时，平台能智能识别数据冲突，并整理为审核工作流，交由管理人员进行进一步处理。
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div style={{ textAlign: 'center', minHeight: 450, padding: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{ fontWeight: 700, fontSize: 30, color: '#fff' }}>应用场景</div>
            <Hr width={25} />
          </div>
        </div>
      </div>
    )
  }
}
export default Home
