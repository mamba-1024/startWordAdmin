import { Navigate, useRoutes } from 'react-router-dom';
import React from 'react';

import CommonRoutes, { commonMenus, commonMenusAll } from './common';
import AttendanceManageRoutes, { attendanceManageMenus, attendanceManageMenusAll } from './attendanceManage';
import InfoManageRoutes, { infoManageMenus, infoManageMenusAll } from './infoManage';
import employeeRoutes, { employeeMenus, employeeMenusAll } from './employee';

import Login from '../pages/login';
import ErrorPage from '../pages/404';

const rootRouter = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '*',
    element: <ErrorPage />,
  },
  {
    path: '/',
    element: <Navigate to="/dashboard" />,
  },
].concat(employeeRoutes, CommonRoutes, AttendanceManageRoutes, InfoManageRoutes);

const Router = () => {
  const routes = useRoutes(rootRouter);
  return routes;
};

export default Router;

export const sidebarMenus = [
  ...commonMenus,
  ...employeeMenus,
  ...attendanceManageMenus,
  ...infoManageMenus,
];
export const sidebarMenusAll = [
  ...commonMenusAll,
  ...employeeMenusAll,
  ...attendanceManageMenusAll,
  ...infoManageMenusAll,
];
