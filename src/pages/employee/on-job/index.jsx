// import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { useRef } from 'react';
import { requestFun, enableApi, disableApi, clearPointsApi } from '../sever';
import { message, Popconfirm } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';


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
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: ' 等级',
      dataIndex: 'level',
    },
    {
      title: '积分',
      dataIndex: 'points',
      search: false,
    },
    {
      title: '累计工时',
      dataIndex: 'totalWorkTime',
      search: false,
    },
    {
      title: '在职状态',
      dataIndex: 'onBoard',
      valueType: 'select',
      valueEnum: {
        true: {
          text: '在职',
        },
        false: {
          text: '离职',
        },
      },
    },
    {
      title: '入职时间',
      dataIndex: 'onboardingDate',
      valueType: 'dateRange',
      search: {
        transform: (value) => {
          return {
            incumbencyStart: value[0],
            incumbencyEnd: value[1],
          };
        },
      },
      render: (_, record) => {
        return record.onboardingDate ? dayjs(record.onboardingDate).format('YYYY-MM-DD') : '-';
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={async () => {
            if (record.status) {
              await disableApi({ id: record.id });
              message.success('停用成功', 0.5, () => {
                action.reload();
              });
            } else {
              await enableApi({ id: record.id });
              message.success('启用成功', 0.5, () => {
                action.reload();
              });
            }
          }}
        >
          {record.status ? '停用' : '启用'}
        </a>,
        <a
          onClick={() => {
            navigate(`/employee/detail?id=${record.id}`, { state: { id: record.id } });
          }}
          rel="noopener noreferrer"
          key="view"
        >
          查看
        </a>,
        <Popconfirm
          title="积分清零？"
          description="确定要积分清零吗？"
          onConfirm={() => {
            clearPointsApi({ id: record.id }).then((res) => {
              if (res) {
                message.success('积分清零成功', 1, () => {
                  action.reload();
                });
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
            积分清零
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
        return requestFun({
          page: params.current,
          pageSize: params.pageSize,
          ...params,
        });
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
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
      pagination={{
        pageSize: 10,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
    />
  );
};
