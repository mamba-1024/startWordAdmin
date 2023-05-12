import { Navigate, useRoutes } from 'react-router-dom';
import React from 'react';

import CommonRoutes, { commonMenus } from './common';
// import FromRoutes, { formMenus } from './form';
// import GameRoutes, { gameMenus } from './game';
import employeeRoutes, { employeeMenus } from './employee';

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
    element: <Navigate to="/login" />,
  },
].concat(employeeRoutes, CommonRoutes);

const Router = () => {
  const routes = useRoutes(rootRouter);
  return routes;
};

export default Router;

export const sidebarMenus = [...commonMenus, ...employeeMenus];
