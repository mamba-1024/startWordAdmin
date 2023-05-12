import React, { useState, useEffect } from 'react';
import { Table, Spin } from 'antd';
import {
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormSelect,
  ProFormText,
  QueryFilter,
} from '@ant-design/pro-components';

import { request } from '../../../utils/request';

async function getListData(query) {
  const res = await request({
    url: '/user/list',
    method: 'post',
    data: query,
  });
  return res;
}

function AboutPage() {
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({ page: 1, pageSize: 10 });

  const columns = [
    {
      dataIndex: 'id',
      width: 48,
    },
    {
      title: '姓名',
      dataIndex: 'title',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
    },
    {
      title: '积分',
      dataIndex: 'point',
    },
    {
      title: '累计工时',
      dataIndex: 'created_at',
    },
    {
      title: '员工状态',
      dataIndex: 'status',
    },
    {
      title: '入职时间',
      dataIndex: 'created_at',
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
          查看
        </a>,
      ],
    },
  ];

  useEffect(() => {
    setLoading(true);
    getListData(query)
      .then((res) => {
        setList(res.list);
        setTotal(res.total);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [query]);

  const pagination = {
    total,
    showSizeChanger: false,
    current: query.page,
    onChange: (current) => {
      setQuery({ ...query, page: current });
    },
    showTotal: (totals) => `Total ${totals} items`,
  };

  return (
    <Spin spinning={loading}>
      <QueryFilter
        onFinish={async (values) => {
          console.log(values.name);
        }}
      >
        <ProFormText name="name" label="姓名" />
        <ProFormText name="creater" label="手机号" />
        <ProFormSelect
          name="sex"
          label="性别"
          showSearch
          valueEnum={{
            man: '男',
            woman: '女',
          }}
        />
        <ProFormText name="status" label="应用状态" />
        <ProFormDatePicker name="startdate" label="响应日期" />
        <ProFormDateRangePicker name="create" label="创建时间" />
      </QueryFilter>
      <Table
        columns={columns}
        dataSource={list}
        pagination={pagination}
        rowKey={(record) => record.id}
      />
    </Spin>
  );
}

export default AboutPage;
