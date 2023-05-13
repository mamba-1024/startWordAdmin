import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import { ProTable, TableDropdown } from '@ant-design/pro-components';
import { Button, Dropdown, Space, Tag } from 'antd';
import { useRef, useEffect, useState } from 'react';
import { detailApi } from '../sever';
import { useSearchParams } from 'react-router-dom';

export default () => {
  const [searchParams] = useSearchParams();
  const [detail, setDetail] = useState();

  useEffect(() => {
    const id = searchParams.get('id');
    // if (id) {
    //   detailApi({ id }).then((res) => {
    //     setDetail(res);
    //     console.log('detail: ', res);
    //   });
    // }
  }, [searchParams]);

  const actionRef = useRef();
  return <div className="text-center pt-10">{detail ? '' : '暂无数据，后续开发'}</div>;
};
