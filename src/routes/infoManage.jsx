import React from 'react';
import { RedditOutlined } from '@ant-design/icons';
import { LazyComp, transformRouterSidebar, transformRouterSidebarAll } from './help';
import Layout from '../component/Layout';

const GoldEgg = React.lazy(() => import('../pages/infoManage/products'));
const Sudoku = React.lazy(() => import('../pages/infoManage/company'));

const Routes = [
  {
    label: '信息管理',
    hide: false,
    icon: <RedditOutlined />,
    key: 'infoManage',
    element: <Layout />,
    children: [
      {
        path: '/infoManage/products',
        key: '/infoManage/products',
        label: '产品动态',
        hide: false,
        exact: true,
        element: LazyComp(GoldEgg),
        crumb: ['信息管理', '产品动态'], // 自定义面包屑
      },
      {
        path: '/infoManage/company',
        key: '/infoManage/company',
        label: '企业动态',
        hide: false,
        exact: true,
        element: LazyComp(Sudoku),
        crumb: ['信息管理', '企业动态'], // 自定义面包屑
      },
    ],
  },
];

export const infoManageMenus = transformRouterSidebar(Routes);
export const infoManageMenusAll = transformRouterSidebarAll(Routes);

export default Routes;
