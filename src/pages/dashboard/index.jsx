import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Avatar, Skeleton } from 'antd';
import { PageHeader } from '@ant-design/pro-layout';
import { Column } from '@ant-design/plots';
import { queryHomeData } from './server';
import CountUp from 'react-countup';
import {
  BarChartOutlined,
  StockOutlined,
  UsergroupAddOutlined,
  UsergroupDeleteOutlined,
  UserOutlined,
  TeamOutlined,
  AlertOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

/**
  第一排：昨日新增员工数，昨日正常上班员工数，昨天加班员工数
  第二排：待审核员工数，总启用员工数，总停用员工数
 */

const employeeCountMap = {
  lastDayAdd: '昨日新增员工数',
  昨日正常上班: '昨日正常上班员工数',
  昨日加班人数: '昨天加班员工数',
  waitAuditCount: '待审核员工数',
  enableCount: '总启用员工数',
  disableCount: '总停用员工数',
};
const formatter = (value) => <CountUp end={value} />;
const statisticStyle = {
  waitAuditCount: {
    prefix: <AlertOutlined />,
    valueStyle: { color: '#cf1322' },
    formatter,
    link: '/employee/jobAudit?auditStatus=WAIT_AUDIT',
  },
  disableCount: {
    prefix: <UsergroupDeleteOutlined />,
    valueStyle: { color: '#cf1322' },
    formatter,
    link: '/employee/onJob?status=false',
  },
  enableCount: {
    prefix: <TeamOutlined />,
    valueStyle: { color: '#1677FF' },
    formatter,
    link: '/employee/onJob?status=true',
  },
  lastDayAdd: {
    prefix: <UsergroupAddOutlined />,
    valueStyle: { color: '#3f8600' },
    formatter,
    link: `/employee/onJob?enableDateStart=${dayjs()
      .subtract(1, 'day')
      .startOf('day')
      .format('YYYY-MM-DD')}&enableDateEnd=${dayjs()
      .subtract(1, 'day')
      .endOf('day')
      .format('YYYY-MM-DD')}`,
  },
  昨日加班人数: {
    prefix: <UserOutlined />,
    valueStyle: { color: '#EA0FB4' },
    formatter,
  },
  昨日正常上班: {
    prefix: <UserOutlined />,
    valueStyle: { color: '#3809F8' },
    formatter,
  },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [employeesInfo, setEmployeesInfo] = useState({});
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    queryHomeData()
      .then((res) => {
        // 人数统计
        const employeesInfos = {
          waitAuditCount: res.waitAuditCount,
          ...res.employeeWorkCount,
          ...res.employeeCount,
        };

        setEmployeesInfo(employeesInfos);

        // 等级分布数据
        const level = Object.keys(res.levelDistribution || {}).map((key) => ({
          type: key,
          sales: res.levelDistribution[key],
        }));
        setLevelData(level || []);
        // setEmployeeWorkCount(res.employeeWorkCount || {});
        // 员工统计
        // setEmployeeCount(res.employeeCount);
        // 待审核员工数量
        // setWaitAuditCount(res.waitAuditCount);
        // 员工积分排名前十
        const employeesData = res.employees.map((item) => ({
          name: item.name,
          points: item.points,
        }));
        setEmployees(employeesData || []);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <PageHeader onBack={() => null} title="数据大盘" backIcon={false} />
      <Row gutter={[24, 24]}>
        {Object.keys(employeeCountMap).map((key) =>
          loading ? (
            <Skeleton active />
          ) : (
            <Col span={8}>
              <Card
                onClick={() => {
                  navigate(statisticStyle[key].link);
                }}
                title={employeeCountMap[key]}
                bordered={false}
                style={{ borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}
                extra={
                  <Avatar
                    icon={<StockOutlined />}
                    style={{
                      backgroundColor: '#91d5ff',
                      color: '#1890ff',
                    }}
                  />
                }
              >
                <Statistic value={employeesInfo[key]} {...statisticStyle[key]} />
              </Card>
            </Col>
          )
        )}
      </Row>
      <Row style={{ marginTop: 24 }} gutter={24}>
        <Col span={12}>
          {loading ? (
            <Skeleton active />
          ) : (
            <Card
              title="等级分布（截至昨日23:59:59）"
              bordered={false}
              extra={
                <Avatar
                  icon={<BarChartOutlined />}
                  style={{
                    backgroundColor: '#91d5ff',
                    color: '#1890ff',
                  }}
                />
              }
            >
              <div style={{ width: '100%', height: 200 }}>
                <Column {...ColumnConfig} />
              </div>
            </Card>
          )}
        </Col>
        <Col span={12}>
          {loading ? (
            <Skeleton active />
          ) : (
            <Card
              title="员工积分排名（截至昨日23:59:59）"
              bordered={false}
              extra={
                <Avatar
                  icon={<BarChartOutlined />}
                  style={{
                    backgroundColor: '#91d5ff',
                    color: '#1890ff',
                  }}
                />
              }
            >
              <div style={{ height: 200 }}>
                <Column {...employeeDataConfig} />
              </div>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
}
