import React from 'react'
import { Row, Col } from 'antd'
import Hr from '@/components/items/hr'
import Bg from '@/assets/bg.jpg'

class Home extends React.Component {
  render() {
    return (
      <div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ textAlign: 'center', marginTop: 30 }}>
            <div style={{ fontWeight: 700, fontSize: 36, color: '#4abcc5' }}>KG-BUILDER</div>
            <div style={{ fontWeight: 700, fontSize: 30, marginTop: 16, color: '#4abcc5' }}>一站式知识图谱构建平台</div>
          </div>
          <div style={{ backgroundImage: `url(${Bg})`, textAlign: 'center', padding: '40px 0', marginTop: 30 }}>
            <div style={{ textAlign: 'center', marginTop: 30 }}>
              <div style={{ fontWeight: 700, fontSize: 30, color: '#fff' }}>系统简介</div>
              <Hr width={25} />
            </div>
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
            <div style={{ border: '1px dashed #a6dff4', borderRadius: 10, padding: 40, fontSize: 20, width: 800, display: 'inline-block' }}>
              <span style={{ color: '#fbe07a' }}>
                ★关于一站式知识图谱构建平台KG-BUILDER
              </span>
              <br />
              <br />
              <p style={{ color: '#fff' }}>
                KG-BUILDER一站式知识图谱构建平台，提供了针对知识图谱构建全生命周期常见需求的各项服务。
                涵盖图谱创建，本体构建，知识获取，知识融合等阶段，并对各类工作流进行管理。
                系统提供用户友好的操作界面，完整的图谱构建引导教程，支持千万级数据量的知识图谱管理。
              </p>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 30 }}>
            <div style={{ fontWeight: 700, fontSize: 30, color: '#4abcc5' }}>功能亮点</div>
            <Hr width={25} />
          </div>
          <Row gutter={16} style={{ marginTop: 30, width: 1400, display: 'inline-block' }}>
            <Col style={{ height: 180 }} span={8}>
              <div style={{ border: '1px solid #e8e8e8', height: 180, textAlign: 'center', padding: 20 }}>
                <h1>
                  一站式图谱管理
                </h1>
                <p style={{ fontSize: 16 }}>
                  本平台提供了对知识图谱全生命周期的编辑与管理操作功能。
                  涵盖图谱创建，本体构建，知识获取，知识融合等阶段，并提供对应的工作流管理服务。
                </p>
              </div>
            </Col>
            <Col style={{ height: 180 }} span={8}>
              <div style={{ border: '1px solid #e8e8e8', height: 180, textAlign: 'center', padding: 20 }}>
                <h1>
                  更好的本体编辑
                </h1>
                <p style={{ fontSize: 16 }}>
                  对比主流知识图谱编辑系统，KG-BUILDER自带的本体编辑器同时满足了简单易用和功能强大完善两方面。
                </p>
              </div>
            </Col>
            <Col style={{ height: 180 }} span={8}>
              <div style={{ border: '1px solid #e8e8e8', height: 180, textAlign: 'center', padding: 20 }}>
                <h1>
                  任务与人员管理
                </h1>
                <p style={{ fontSize: 16 }}>
                  提供了针对知识图谱各阶段任务的特征，分类优化的任务与人员发布和管理功能。
                </p>
              </div>
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 20, width: 1400, display: 'inline-block' }}>
            <Col style={{ height: 180 }} span={8}>
              <div style={{ border: '1px solid #e8e8e8', height: 180, textAlign: 'center', padding: 20 }}>
                <h1>
                  多维度数据抽取
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
        <div style={{ marginTop: 40 }}>x</div>
      </div>
    )
  }
}
export default Home
