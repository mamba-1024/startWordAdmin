import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { Column } from '@ant-design/plots';
import { queryHomeData } from './server';

const employeeCountMap = {
  disableCount: '昨日停用',
  enableCount: '昨日启用',
  lastDayAdd: '昨日新增',
};

export default function Dashboard() {
  // 待审核员工数量
  const [waitAuditCount, setWaitAuditCount] = useState(0);
  // 员工工作状态
  const [employeeWorkCount, setEmployeeWorkCount] = useState({});
  // 员工统计
  const [employeeCount, setEmployeeCount] = useState({});

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
      title: {
        text: '等级',
        position: 'end',
        autoRotate: true,
      },
    },
    yAxis: {
      title: {
        text: '人数',
        position: 'end',
        autoRotate: true,
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

  // 员工积分排名前十
  const [employees, setEmployees] = useState([]);

  const employeeDataConfig = {
    data: employees,
    xField: 'name',
    yField: 'points',
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
      title: {
        text: '姓名',
        position: 'end',
        autoRotate: true,
      },
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    yAxis: {
      title: {
        text: '积分',
        position: 'end',
        autoRotate: true,
        offset: 30,
      },
    },
    meta: {
      name: {
        alias: '姓名',
      },
      points: {
        alias: '积分',
      },
    },
  };

  useEffect(() => {
    queryHomeData().then((res) => {
      // 等级分布数据
      const level = Object.keys(res.levelDistribution || {}).map((key) => ({
        type: key,
        sales: res.levelDistribution[key],
      }));
      setLevelData(level || []);
      setEmployeeWorkCount(res.employeeWorkCount || {});
      // 员工统计

      setEmployeeCount(res.employeeCount);
      // 待审核员工数量
      setWaitAuditCount(res.waitAuditCount);
      // 员工积分排名前十
      const employeesData = res.employees.map((item) => ({
        name: item.name,
        points: item.points,
      }));
      setEmployees(employeesData || []);
    });
  }, []);

  return (
    <div>
      <PageHeader onBack={() => null} title="数据大盘" backIcon={false} />
      <Row gutter={[24, 24]}>
        <Col span={8}>
          <Card title="待审核员工人数" bordered={false}>
            <Statistic value={waitAuditCount} />
          </Card>
        </Col>
        {
          Object.keys(employeeWorkCount).map((key) => (
            <Col span={8}>
              <Card title={`${key}人数`} bordered={false}>
                <Statistic value={employeeWorkCount[key]} />
              </Card>
            </Col>
          ))
        }
        {
          Object.keys(employeeCount).map((key) => (
            <Col span={8}>
              <Card title={`${employeeCountMap[key]}人数`} bordered={false}>
                <Statistic value={employeeCount[key]} />
              </Card>
            </Col>
          ))
        }
      </Row>
      <Row style={{ marginTop: 24 }} gutter={24}>
        <Col span={12}>
          <Card title="等级分布（截至昨日23:59:59）" bordered={false}>
            <div style={{ width: '100%', height: 200 }}>
              <Column {...ColumnConfig} />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="员工积分排名（截至昨日23:59:59）" bordered={false}>
            <div style={{ height: 200 }}>
              <Column {...employeeDataConfig} />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
