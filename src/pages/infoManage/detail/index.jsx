// Note: 员工详情页
import { ProDescriptions } from '@ant-design/pro-components';
import { Image, Card, Button } from 'antd';
import { useEffect, useState } from 'react';
import { entActionDetailApi, productDetailApi } from '../sever';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [detail, setDetail] = useState();
  const [loading, setLoading] = useState(false);
  // 详情id
  const id = searchParams.get('id');
  // 详情 type
  const type = searchParams.get('type');

  useEffect(() => {
    let func;
    if (type === 'product') {
      func = productDetailApi;
    } else {
      func = entActionDetailApi;
    }
    if (id && type) {
      setLoading(true);
      func({ id })
        .then((res) => {
          setDetail(res);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id, type]);

  return (
    <Card>
      <div className="flex flex-row justify-end items-center">
        <Button type="primary" ghost onClick={() => navigate(-1)}>返回上一页</Button>
      </div>
      <ProDescriptions
        column={2}
        layout="vertical"
        title={type === 'product' ? '产品信息' : '企业动态信息'}
        loading={loading}
      >
        <ProDescriptions.Item label="标题">{detail?.title}</ProDescriptions.Item>
        <ProDescriptions.Item label="主图片">
          <Image src={detail?.productMainUrl || detail?.actionMainUrl} width={200} height={100} />
        </ProDescriptions.Item>
        <ProDescriptions.Item label="简介">{detail?.shortDesc}</ProDescriptions.Item>
        <ProDescriptions.Item
          label="显示在首页"
          valueEnum={{
            true: {
              text: '是',
            },
            false: {
              text: '否',
            },
          }}
        >
          {detail?.showIndex}
        </ProDescriptions.Item>
        <ProDescriptions.Item label="正文内容">
          {detail?.htmlContent && <div dangerouslySetInnerHTML={{ __html: detail?.htmlContent }} />}
        </ProDescriptions.Item>
      </ProDescriptions>
    </Card>
  );
};
