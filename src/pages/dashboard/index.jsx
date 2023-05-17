import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Tag } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { Liquid, Column, Pie } from '@ant-design/plots';
import { queryHomeData } from './server';
import { ProList } from '@ant-design/pro-components';

export default function Dashboard() {
  // 待审核员工数量
  const [waitAuditCount, setWaitAuditCount] = useState(0);
  const waitAuditCountConfig = {
    percent: 0.65,
    statistic: {
      title: {
        content: '待审核员工数量',
        style: {
          fontSize: 14,
        },
      },
      content: {
        content: waitAuditCount,
        offsetY: 10,
      },
    },
    outline: {
      border: 4,
      distance: 8,
    },
    wave: {
      length: 128,
    },
  };
  // 员工上班情况
  const [employeeWorkCount, setEmployeeWorkCount] = useState([]);

  const employeeWorkCountConfig = {
    data: employeeWorkCount,
    xField: 'type',
    yField: 'sales',
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle',
      // 'top', 'bottom', 'middle',
      // 配置样式
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: '等级',
      },
      sales: {
        alias: '人数',
      },
    },
  };
  // 等级分布
  const [levelData, setLevelData] = useState([]);

  const ColumnConfig = {
    data: levelData,
    xField: 'type',
    yField: 'sales',
    label: {
      // 可手动配置 label 数据标签位置
      position: 'middle',
      // 'top', 'bottom', 'middle',
      // 配置样式
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: {
        alias: '等级',
      },
      sales: {
        alias: '人数',
      },
    },
  };
  // 员工统计
  const employeeCount = [
    {
      type: '昨日启用员工',
      value: 27,
    },
    {
      type: '昨日新增员工',
      value: 25,
    },
    {
      type: '昨日停用员工',
      value: 18,
    },
  ];
  const employeeCountConfig = {
    appendPadding: 10,
    data: employeeCount,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  // 员工积分排名前十
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    queryHomeData().then((res) => {
      // 等级分布数据
      const level = Object.keys(res.levelDistribution || {}).map((key) => ({
        type: key,
        sales: res.levelDistribution[key],
      }));
      setLevelData(level || []);
      // 员工上班情况
      const work = Object.keys(res.employeeWorkCount || {}).map((key) => ({
        type: key,
        sales: res.employeeWorkCount[key],
      }));
      setEmployeeWorkCount(work || []);
      // 待审核员工数量
      setWaitAuditCount(res.waitAuditCount);
      // 员工积分排名前十
      const employeesData = res.employees.map((item, index) => ({
        title: item.name,
        actions: [<Tag color="#87d068">第{index + 1}名</Tag>],
        content: (
          <div
            style={{
              flex: 1,
            }}
          >
            <div
              style={{
                width: 200,
              }}
            >
              <div>积分：{item.points}</div>
            </div>
          </div>
        ),
      }));
      setEmployees(employeesData || []);
    });
  }, []);

  return (
    <div>
      <PageHeader onBack={() => null} title="数据大盘" backIcon={false} />

      <Row gutter={[24]}>
        <Col span={12}>
          <Card title="待审核员工数量" bordered={false}>
            <div style={{ width: '100%', height: 180 }}>
              <Liquid {...waitAuditCountConfig} />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="员工上班情况" bordered={false}>
            <div style={{ width: '100%', height: 180 }}>
              <Column {...employeeWorkCountConfig} />
            </div>
          </Card>
        </Col>

      </Row>
      <Row style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="等级分布" bordered={false}>
            <div style={{ width: '100%', height: 180 }}>
              <Column {...ColumnConfig} />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="员工统计" bordered={false}>
            <div style={{ height: 300 }}>
              <Pie {...employeeCountConfig} />
            </div>
          </Card>
        </Col>
      </Row>

      <Row style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="员工积分排名前十" bordered={false}>
            <ProList
              dataSource={employees}
              grid={{ gutter: 16, column: 2 }}
              metas={{
                title: {},
                actions: {},
                content: {} }
            }
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
