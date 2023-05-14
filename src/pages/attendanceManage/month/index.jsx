import { ExportOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { useRef } from 'react';
import { attendanceListApi } from '../sever';
import dayjs from 'dayjs';
import { Button } from 'antd';
// import { useNavigate } from 'react-router-dom';

export default () => {
  const actionRef = useRef();
  const filterRef = useRef();
  // const navigate = useNavigate();

  const columns = [
    {
      dataIndex: 'id',
      width: 48,
      valueType: 'index',
      search: false,
    },
    {
      title: '时间',
      dataIndex: 'punchDate',
      valueType: 'dateRange',
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
      render: (_, record) => {
        return record.punchDate ? dayjs(record.punchDate).format('YYYY-MM-DD') : '-';
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '员工状态',
      dataIndex: 'onBoard',
      search: false,
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
      title: '上班时间',
      search: false,
      children: [
        {
          title: '班次1',
          dataIndex: 'commonRecord1',
          search: false,
          render: (_, record) => {
            return record.commonRecord
              ? `${record.commonRecord?.punchUpTime?.hours}:${record.commonRecord?.punchUpTime?.minutes}:${record.commonRecord?.punchUpTime?.seconds}`
              : '-';
          },
        },
        {
          title: '班次2',
          dataIndex: 'overRecord2',
          search: false,
          render: (_, record) => {
            return record.overRecord
              ? `${record.overRecord?.punchUpTime?.hours}:${record.overRecord?.punchUpTime?.minutes}:${record.overRecord?.punchUpTime?.seconds}`
              : '-';
          },
        },
      ],
    },
    {
      title: '上班时间',
      search: false,
      children: [
        {
          title: '班次1',
          dataIndex: 'commonRecord',
          search: false,
          render: (_, record) => {
            return record.commonRecord
              ? `${record.commonRecord?.punchDownTime?.hours}:${record.commonRecord?.punchDownTime?.minutes}:${record.commonRecord?.punchDownTime?.seconds}`
              : '-';
          },
        },
        {
          title: '班次2',
          dataIndex: 'overRecord',
          search: false,
          render: (_, record) => {
            return record.overRecord
              ? `${record.overRecord?.punchDownTime?.hours}:${record.overRecord?.punchDownTime?.minutes}:${record.overRecord?.punchDownTime?.seconds}`
              : '-';
          },
        },
      ],
    },
    {
      title: '班次1时长',
      dataIndex: 'commonRecord11',
      search: false,
      render: (_, record) => {
        return record.commonRecord?.hours || '-';
      },
    },

    {
      title: '班次2时长',
      dataIndex: 'overRecord22',
      search: false,
      render: (_, record) => {
        return record.overRecord?.hours || '-';
      },
    },
  ];

  return (
    <ProTable
      rowKey={(record, index) => index}
      columns={columns}
      actionRef={actionRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        return attendanceListApi({
          page: params.current,
          pageSize: params.pageSize,
          ...params,
        });
      }}
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
      formRef={filterRef}
      pagination={{
        pageSize: 10,
        onChange: (page) => console.log(page),
      }}
      dateFormatter="string"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<ExportOutlined />}
          onClick={async () => {
            // await exportApi(filterRef.current.getFieldsFormatValue());
            const params = filterRef.current.getFieldsFormatValue();
            const str = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
            window.open(`${window.location.origin}/backend/attendance/export/daily?${str}`);
          }}
          type="primary"
        >
          导出日报
        </Button>,
        <Button
          key="button"
          icon={<ExportOutlined />}
          onClick={async () => {
            // await exportApi(filterRef.current.getFieldsFormatValue());
            const params = filterRef.current.getFieldsFormatValue();
            const str = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
            window.open(`${window.location.origin}/backend/attendance/export/month?${str}`);
          }}
          type="primary"
        >
          导出月报
        </Button>,
      ]}
    />
  );
};
