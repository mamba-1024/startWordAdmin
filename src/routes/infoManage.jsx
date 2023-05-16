import React from 'react';
import { RedditOutlined } from '@ant-design/icons';
import { LazyComp, transformRouterSidebar, transformRouterSidebarAll } from './help';
import Layout from '../component/Layout';

const GoldEgg = React.lazy(() => import('../pages/infoManage/products'));
const Sudoku = React.lazy(() => import('../pages/infoManage/company'));
const InfoEdit = React.lazy(() => import('../pages/infoManage/infoEdit'));
const IndexConfig = React.lazy(() => import('../pages/infoManage/indexConfig'));
const Detail = React.lazy(() => import('../pages/infoManage/detail'));

const Routes = [
  {
    label: '配置管理',
    hide: false,
    icon: <RedditOutlined />,
    key: 'infoManage',
    element: <Layout />,
    children: [
      {
        path: '/infoManage/indexConfig',
        key: '/infoManage/indexConfig',
        label: '首页配置',
        hide: false,
        exact: true,
        element: LazyComp(IndexConfig),
        crumb: ['配置管理', '首页配置'], // 自定义面包屑
      },
      {
        path: '/infoManage/products',
        key: '/infoManage/products',
        label: '产品管理',
        hide: false,
        exact: true,
        element: LazyComp(GoldEgg),
        crumb: ['配置管理', '产品管理'], // 自定义面包屑
      },
      {
        path: '/infoManage/company',
        key: '/infoManage/company',
        label: '企业动态',
        hide: false,
        exact: true,
        element: LazyComp(Sudoku),
        crumb: ['配置管理', '企业动态'], // 自定义面包屑
      },
      {
        path: '/infoManage/infoEdit',
        key: '/infoManage/infoEdit',
        label: '信息配置',
        hide: true,
        exact: true,
        element: LazyComp(InfoEdit),
        crumb: ['配置管理', '信息配置'], // 自定义面包屑
      },
      {
        path: '/infoManage/detail',
        key: '/infoManage/detail',
        label: '',
        hide: true,
        exact: true,
        element: LazyComp(Detail),
        crumb: ['配置管理', '详情信息'], // 自定义面包屑
      },
    ],
  },
];

export const infoManageMenus = transformRouterSidebar(Routes);
export const infoManageMenusAll = transformRouterSidebarAll(Routes);

export default Routes;
