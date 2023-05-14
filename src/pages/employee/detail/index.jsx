// Note: 员工详情页
import { ProDescriptions } from '@ant-design/pro-components';
import { Image, Card } from 'antd';
import { useEffect, useState } from 'react';
import { detailApi } from '../sever';
import { useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';

export default () => {
  const [searchParams] = useSearchParams();
  const [detail, setDetail] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setLoading(true);
      detailApi({ id })
        .then((res) => {
          setDetail(res);
          console.log('detail: ', res);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [searchParams]);

  return (
    <Card>
      <ProDescriptions title="基本信息" loading={loading}>
        <ProDescriptions.Item label="姓名">{detail?.name}</ProDescriptions.Item>
        <ProDescriptions.Item label="头像">
          <Image src={detail?.avatar} width={60} height={60} />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="昵称">{detail?.nickname}</ProDescriptions.Item>
        <ProDescriptions.Item label="手机号">{detail?.phone}</ProDescriptions.Item>
        <ProDescriptions.Item label="等级">{detail?.level}</ProDescriptions.Item>
        <ProDescriptions.Item label="积分">{detail?.points}</ProDescriptions.Item>
        <ProDescriptions.Item label="当月累计工时">{detail?.totalWorkTime}</ProDescriptions.Item>
        <ProDescriptions.Item
          label="启用状态"
          valueEnum={{
            true: {
              text: '启用',
            },
            false: {
              text: '停用',
            },
          }}
        >
          {detail?.status}
        </ProDescriptions.Item>
        <ProDescriptions.Item
          label="在职状态"
          valueEnum={{
            true: {
              text: '在职',
            },
            false: {
              text: '离职',
            },
          }}
        >
          {detail?.onBoard}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="入职时间">
          {detail?.entryTime && dayjs(detail?.entryTime).format('YYYY-MM-DD')}
        </ProDescriptions.Item>
        <ProDescriptions.Item
          label="审核状态"
          valueEnum={{
            REJECT: {
              text: '审核不通过',
            },
            PASS: {
              text: '审核通过',
            },
            WAIT_AUDIT: {
              text: '待审核',
            },
          }}
        >
          {detail?.auditStatus}
        </ProDescriptions.Item>
        <ProDescriptions.Item
          label="是否实名"
          valueEnum={{
            true: {
              text: '是',
            },
            false: {
              text: '否',
            },
          }}
        >
          {detail?.isAuthenticated}
        </ProDescriptions.Item>
      </ProDescriptions>
      {detail?.isAuthenticated && (
        <ProDescriptions title="实名信息" loading={loading}>
          <ProDescriptions.Item label="姓名">{detail?.employeeDetails?.name}</ProDescriptions.Item>
          <ProDescriptions.Item label="身份证号">
            {detail?.employeeDetails?.idCard}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="银行卡号">
            {detail?.employeeDetails?.bankCard}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="银行预留手机号">
            {detail?.employeeDetails?.bankReservePhone}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="开户行">
            {detail?.employeeDetails?.bankBranch}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="实名时间">
            {detail?.employeeDetails?.createTime
              ? dayjs(detail?.employeeDetails?.createTime).format('YYYY-MM-DD')
              : '-'}
          </ProDescriptions.Item>
        </ProDescriptions>
      )}
    </Card>
  );
};
