import { ExportOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { useRef } from 'react';
import {attendanceListApi, exportApi, exportDailyApi, exportMonthApi} from '../sever';
import dayjs from 'dayjs';
import { Button, message } from 'antd';
import { isNull } from '../../../utils/index';
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
      dataIndex: 'status',
      search: false,
      valueEnum: {
        true: {
          text: '启用',
        },
        false: {
          text: '停用',
        },
      },
    },
    {
      title: '普通班次',
      search: false,
      children: [
        {
          title: '上班时间',
          dataIndex: 'commonRecord1',
          search: false,
          render: (_, record) => {
            return record.commonRecord?.punchUpTime
              ? `${record.commonRecord?.punchUpTime}`
              : '-';
          },
        },
        {
          title: '下班时间',
          dataIndex: 'commonRecord',
          search: false,
          render: (_, record) => {
            return record.commonRecord?.punchDownTime
              ? `${record.commonRecord?.punchDownTime}`
              : '-';
          },
        },
      ],
    },
    {
      title: '加班班次',
      search: false,
      children: [
        {
          title: '上班时间',
          dataIndex: 'overRecord2',
          search: false,
          render: (_, record) => {
            return record.overRecord?.punchUpTime
              ? `${record.overRecord?.punchUpTime}`
              : '-';
          },
        },
        {
          title: '下班时间',
          dataIndex: 'overRecord',
          search: false,
          render: (_, record) => {
            return record.overRecord?.punchDownTime
              ? `${record.overRecord?.punchDownTime}`
              : '-';
          },
        },
      ],
    },
    {
      title: '普通班次时长',
      dataIndex: 'commonRecord11',
      search: false,
      render: (_, record) => {
        return isNull(record.commonRecord?.hours) ? '-' : record.commonRecord?.hours;
      },
    },

    {
      title: '加班班次时长',
      dataIndex: 'overRecord22',
      search: false,
      render: (_, record) => {
        return isNull(record.overRecord?.hours) ? '-' : record.overRecord?.hours;
      },
    },
  ];

  return (
    <ProTable
      scroll={{ x: 'max-content' }}
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
      dateFormatter="string"
      toolBarRender={() => [
        <Button
          key="button"
          icon={<ExportOutlined />}
          onClick={async () => {
            await exportDailyApi(filterRef.current.getFieldsFormatValue());
          }}
          type="primary"
        >
          导出日报
        </Button>,
      ]}
    />
  );
};
