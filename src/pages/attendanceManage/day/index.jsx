import React, { useState, useRef } from 'react';
import { Button, DatePicker, Modal, message } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import dayjs from 'dayjs';
import { attendanceListApi, exportDailyApi, exportMonthApi } from '../sever';
import {dateFormat, isNull} from '../../../utils/index';
import { dateFormat2 } from '../../../utils/index';

export default () => {
  const actionRef = useRef();
  const filterRef = useRef();

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);

  const handleMonthChange = (date) => {
    setSelectedMonth(date);
  };

  const handleExportMonthly = () => {
    if (selectedMonth) {
      exportMonthApi({ month: selectedMonth.format('YYYY-MM') })
          .then(() => {
            message.success('月报导出成功');
            setShowDatePicker(false);
          })
          .catch((error) => {
            message.error('月报导出失败');
            console.error(error);
          });
    } else {
      message.warning('请先选择一个月份');
    }
  };

  const handleCancel = () => {
    setShowDatePicker(false);
  };

  const handleShowDatePicker = () => {
    setShowDatePicker(true);
  };

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
                ?  dayjs(`${record.commonRecord?.punchUpTime}`).format(dateFormat2)
                : '-';
          },
        },
        {
          title: '下班时间',
          dataIndex: 'commonRecord',
          search: false,
          render: (_, record) => {
            return record.commonRecord?.punchDownTime
                ? dayjs(`${record.commonRecord?.punchDownTime}`).format(dateFormat2)
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
                ? dayjs(`${record.overRecord?.punchUpTime}`).format(dateFormat2)
                : '-';
          },
        },
        {
          title: '下班时间',
          dataIndex: 'overRecord',
          search: false,
          render: (_, record) => {
            return record.overRecord?.punchDownTime
                ? dayjs(`${record.overRecord?.punchDownTime}`).format(dateFormat2)
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
      <>
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
                  key="exportDaily"
                  icon={<ExportOutlined />}
                  onClick={async () => {
                    await exportDailyApi(filterRef.current.getFieldsFormatValue());
                  }}
                  type="primary"
              >
                导出日报
              </Button>,
              <Button
                  key="exportMonthly"
                  icon={<ExportOutlined />}
                  onClick={handleShowDatePicker}
                  type="primary"
              >
                导出月报
              </Button>,
            ]}
        />
        <Modal
            title="选择月份"
            visible={showDatePicker}
            onCancel={handleCancel}
            onOk={handleExportMonthly}
        >
          <DatePicker.MonthPicker onChange={handleMonthChange} />
        </Modal>
      </>
  );
};
