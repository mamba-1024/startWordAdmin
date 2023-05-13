import React from 'react';
import { FormOutlined } from '@ant-design/icons';
import { LazyComp, transformRouterSidebar, transformRouterSidebarAll } from './help';
import Layout from '../component/Layout';

const OnJob = React.lazy(() => import('../pages/employee/on-job'));
const Detail = React.lazy(() => import('../pages/employee/detail'));
const JobAudit = React.lazy(() => import('../pages/employee/jobAudit'));


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
        element: LazyComp(OnJob),
        crumb: ['员工管理', '在职管理'], // 自定义面包屑
      },
      {
        path: '/employee/detail',
        key: '/employee/detail',
        label: '员工详情',
        hide: true,
        exact: true,
        element: LazyComp(Detail),
        crumb: ['员工管理', '员工详情'], // 自定义面包屑
      },
      {
        path: '/employee/jobAudit',
        key: '/employee/jobAudit',
        label: '入职审核',
        hide: false,
        exact: true,
        element: LazyComp(JobAudit),
        crumb: ['员工管理', '入职审核'], // 自定义面包屑
      },
    ],
  },
];

export const employeeMenus = transformRouterSidebar(Routes);
export const employeeMenusAll = transformRouterSidebarAll(Routes);

export default Routes;
