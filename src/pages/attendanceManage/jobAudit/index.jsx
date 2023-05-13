// import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { useRef } from 'react';
import { request } from '../../../utils/request';

export const waitTimePromise = async (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const waitTime = async (time = 100) => {
  await waitTimePromise(time);
};

const columns = [
  {
    dataIndex: 'id',
    width: 48,
    valueType: 'indexBorder',
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
    title: '员工状态',
    dataIndex: 'status',
    valueType: 'select',
    valueEnum: {
      open: {
        text: '在职',
        status: 'Error',
      },
      closed: {
        text: '离职',
        status: 'Success',
      },
    },
  },
  {
    title: '入职时间',
    dataIndex: 'created_at',
    valueType: 'dateRange',
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

async function requestFun(query) {
  await request({
    url: '/backend/employee/listIncumbency',
    method: 'post',
    data: query,
  });
}

export default () => {
  const actionRef = useRef();
  return (
    <ProTable
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        console.log(sort, filter);
        return await requestFun(params);
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
