import { ExportOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { useRef } from 'react';
import {
  requestFun,
  enableApi,
  disableApi,
  clearPointsApi,
  batchDisableApi,
  batchEnableApi,
  batchClearPointsApi,
} from '../sever';
import { message, Popconfirm, Table, Space, Button } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { dateFormat } from '../../../utils/index';
import { exportApi } from '../../attendanceManage/sever';

export default () => {
  const actionRef = useRef();
  const filterRef = useRef();
  const navigate = useNavigate();

  const columns = [
    {
      dataIndex: 'id',
      width: 48,
      valueType: 'index',
      search: false,
      fixed: 'left',
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
      valueType: 'select',
      valueEnum: {
        0: {
          text: 'LV0',
        },
        1: {
          text: 'LV1',
        },
        2: {
          text: 'LV2',
        },
        3: {
          text: 'LV3',
        },
      },
    },
    {
      title: '积分',
      dataIndex: 'points',
      search: false,
    },
    {
      title: '当月累计工时(小时)',
      dataIndex: 'totalWorkTime',
      search: false,
    },
    {
      title: '启用状态',
      dataIndex: 'status',
      valueType: 'select',
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
      title: '启用时间',
      dataIndex: 'enableDate',
      valueType: 'dateRange',
      search: {
        transform: (value) => {
          return {
            enableDateStart: value[0],
            enableDateEnd: value[1],
          };
        },
      },
      render: (_, record) => {
        return record.enableDate ? dayjs(record.enableDate).format(dateFormat) : '-';
      },
    },
    {
      title: '停用时间',
      dataIndex: 'disableDate',
      search: false,
      render: (_, record) => {
        return record.disableDate ? dayjs(record.disableDate).format(dateFormat) : '-';
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
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
          <a rel="noopener noreferrer" key="view">
            积分清零
          </a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <ProTable
      scroll={{ x: 'max-content' }}
      rowSelection={{
        // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
        // 注释该行则默认不显示下拉选项
        selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        defaultSelectedRowKeys: [],
      }}
      tableAlertRender={({ selectedRowKeys, onCleanSelected }) => {
        return (
          <Space size={24}>
            <span>
              已选 {selectedRowKeys.length} 项
              <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
                取消选择
              </a>
            </span>
          </Space>
        );
      }}
      tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => {
        return (
          <Space size={16}>
            <Button
              type="primary"
              ghost
              onClick={async () => {
                await batchEnableApi(selectedRowKeys);
                message.success('批量启用成功', 0.5, () => {
                  actionRef.current.reload();
                  onCleanSelected();
                });
              }}
            >
              批量启用
            </Button>
            <Button
              type="primary"
              ghost
              onClick={async () => {
                await batchDisableApi(selectedRowKeys);
                message.success('批量停用成功', 0.5, () => {
                  actionRef.current.reload();
                  onCleanSelected();
                });
              }}
            >
              批量停用
            </Button>
            <Popconfirm
              title="批量积分清零？"
              description="确定要积分清零吗？"
              onConfirm={async () => {
                await batchClearPointsApi(selectedRowKeys);
                message.success('批量积分清零成功', 0.5, () => {
                  actionRef.current.reload();
                  onCleanSelected();
                });
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="primary"
                ghost
              >
                批量积分清零
              </Button>
            </Popconfirm>,
          </Space>
        );
      }}
      search={{
        defaultCollapsed: false,
        labelWidth: 'auto',
      }}
      columns={columns}
      actionRef={actionRef}
      formRef={filterRef}
      cardBordered
      request={async (params = {}, sort, filter) => {
        return requestFun({
          page: params.current,
          pageSize: params.pageSize,
          ...params,
        });
      }}
      rowKey="id"
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
          icon={<ExportOutlined />}
          onClick={async () => {
            await exportApi(filterRef.current.getFieldsFormatValue());
          }}
          type="primary"
        >
          导出
        </Button>,
      ]}
    />
  );
};
