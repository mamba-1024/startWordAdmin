import { ExportOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import { listAuditApi, auditPassApi, auditRefuseApi } from '../sever';
import { message, Modal, Input, Form, Table, Space, Button } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

const { TextArea } = Input;

export default () => {
  const actionRef = useRef();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [record, setRecord] = useState();

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
      title: '注册时间',
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
      title: '审核状态',
      dataIndex: 'auditStatus',
      search: false,
      valueEnum: {
        REJECT: {
          text: '审核不通过',
        },
        PASS: {
          text: '审核通过',
        },
        WAIT_AUDIT: {
          text: '待审核',
        },
      },
    },
    {
      title: '是否实名',
      dataIndex: 'isAuthenticated',
      valueType: 'select',
      valueEnum: {
        true: {
          text: '是',
        },
        false: {
          text: '否',
        },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => {
        const operate = [];
        if (record.auditStatus === 'WAIT_AUDIT') {
          operate.push(
            <a
              key="editable"
              onClick={async () => {
                await auditPassApi({ id: record.id });
                message.success('审核通过', 0.5, () => {
                  action.reload();
                });
              }}
            >
              审核通过
            </a>,
          );
          operate.push(
            <a
              key="editable"
              onClick={() => {
                setIsOpen(true);
                setRecord(record);
              }}
            >
              审核不通过
            </a>,
          );
        }
        operate.push(
          <a
            onClick={() => {
              // navigate(`/employee/detail?id=${record.id}`, { state: { id: record.id } });
              message.info('暂无详情页');
            }}
            rel="noopener noreferrer"
            key="view"
          >
            查看
          </a>,
        );
        return operate;
      },
    },
  ];

  return (
    <>
      <ProTable
        rowSelection={{
        // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
        // 注释该行则默认不显示下拉选项
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          defaultSelectedRowKeys: [],
        }}
        tableAlertRender={({
          selectedRowKeys,
          selectedRows,
          onCleanSelected,
        }) => {
          console.log(selectedRowKeys, selectedRows);
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
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              <Button type="primary" ghost>批量审核通过</Button>
              <Button type="primary" ghost>批量审核不通过</Button>
              {/* <Button type="primary" ghost>导出数据</Button> */}
            </Space>
          );
        }}
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}, sort, filter) => {
          return listAuditApi({
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
            // const params = filterRef.current.getFieldsFormatValue();
            // const str = Object.keys(params).map((key) => `${key}=${params[key]}`).join('&');
            // window.open(`${window.location.origin}/backend/attendance/export?${str}`);
            }}
            type="primary"
          >
            导出
          </Button>,
        ]}
      />
      <Modal
        title="审核拒绝"
        open={isOpen}
        onOk={async () => {
          await auditRefuseApi({ id: record.id });
          actionRef.current.reload();
        }}
        onCancel={() => {
          setIsOpen(false);
        }}
      >
        <Form>
          <Form.Item label="拒绝原因" name="reason">
            <TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
