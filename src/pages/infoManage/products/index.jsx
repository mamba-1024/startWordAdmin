import { PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { useRef } from 'react';
import { productListApi, deleteApi } from '../sever';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { Image, message, Popconfirm, Button } from 'antd';


export default () => {
  const actionRef = useRef();
  const navigate = useNavigate();

  const columns = [
    {
      dataIndex: 'id',
      width: 48,
      valueType: 'index',
      search: false,
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '简介',
      dataIndex: 'shortDesc',
      search: false,
      ellipsis: true,
    },
    {
      title: '主图',
      dataIndex: 'productMainUrl',
      search: false,
      render: (_, record) => {
        return (
          <Image
            src={record.productMainUrl}
            width={100}
            height={100}
            alt="主图"
          />
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a
          onClick={() => {
            navigate(`/infoManage/detail?type=product&id=${record.id}`);
          }}
          rel="noopener noreferrer"
          key="view"
        >
          查看
        </a>,
        <a
          onClick={() => {
            navigate(`/infoManage/infoEdit?action=edit&type=product&id=${record.id}`);
          }}
          rel="noopener noreferrer"
          key="view"
        >
          编辑
        </a>,
        <Popconfirm
          title="删除？"
          description="确定要删除吗？"
          onConfirm={() => {
            deleteApi({ id: record.id }).then((res) => {
              if (res) {
                message.success('删除成功');
                action.reload();
              } else {
                message.error(res.msg);
              }
            });
          }}
          okText="确定"
          cancelText="取消"
        >
          <a
            rel="noopener noreferrer"
            key="view"
          >
            删除
          </a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <ProTable
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        return productListApi({
          page: params.current,
          pageSize: params.pageSize,
          ...params,
        });
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
        defaultCollapsed: false,
      }}
      options={{
        setting: {
          listsHeight: 400,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      dateFormatter="string"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<PlusOutlined />}
          onClick={() => {
            navigate('/infoManage/infoEdit?action=add&type=product');
          }}
          type="primary"
        >
          新建
        </Button>,
      ]}
    />
  );
};
