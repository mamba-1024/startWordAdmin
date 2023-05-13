import React from 'react';
import { CalendarOutlined } from '@ant-design/icons';
import { LazyComp, transformRouterSidebar, transformRouterSidebarAll } from './help';
import Layout from '../component/Layout';

const Day = React.lazy(() => import('../pages/attendanceManage/day'));

const Routes = [
  {
    label: '考勤管理',
    hide: false,
    icon: <CalendarOutlined />,
    key: 'attendanceManage',
    element: <Layout />,
    children: [
      {
        path: '/attendanceManage/day',
        key: '/attendanceManage/day',
        label: '日报',
        hide: false,
        exact: true,
        element: LazyComp(Day),
        crumb: ['考勤管理', '日报'], // 自定义面包屑
      },
    ],
  },
];

export const attendanceManageMenus = transformRouterSidebar(Routes);
export const attendanceManageMenusAll = transformRouterSidebarAll(Routes);

export default Routes;
