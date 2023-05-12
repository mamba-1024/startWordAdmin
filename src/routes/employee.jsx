import React from 'react';
import { FormOutlined } from '@ant-design/icons';
import { LazyComp, transformRouterSidebar } from './help';
import Layout from '../component/Layout';

const BasicForm = React.lazy(() => import('../pages/employee/on-job'));
const ProForm = React.lazy(() => import('../pages/employee/detail'));

const Routes = [
  {
    label: '员工管理',
    hide: false,
    icon: <FormOutlined />,
    key: 'employee',
    element: <Layout />,
    children: [
      {
        path: '/employee/onJob',
        key: '/employee/onJob',
        label: '在职管理',
        hide: false,
        exact: true,
        element: LazyComp(BasicForm),
        crumb: ['员工管理', '在职管理'], // 自定义面包屑
      },
      {
        path: '/employee/detail',
        key: '/employee/detail',
        label: '员工详情',
        hide: false,
        exact: true,
        element: LazyComp(ProForm),
        crumb: ['员工管理', '员工详情'], // 自定义面包屑
      },
    ],
  },
];

export const employeeMenus = transformRouterSidebar(Routes);

export default Routes;
