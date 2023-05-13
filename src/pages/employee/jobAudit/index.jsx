// import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { ProTable } from '@ant-design/pro-components';
import { useRef, useState } from 'react';
import { listAuditApi, auditPassApi, auditRefuseApi } from '../sever';
import { message, Modal, Input, Form } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { set } from 'lodash';

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
