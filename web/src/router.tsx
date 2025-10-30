import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import Sites from './pages/Sites';
import User from './pages/User';
import SiteLayout from './pages/site/Layout';
import SiteList from './pages/site/List';
import SiteStart from './pages/site/Start';
import SiteRecords from './pages/site/Records';
import SiteManage from './pages/site/Manage';
import SiteExport from './pages/site/Export';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}> 
      <Route index element={<Navigate to="/login" replace />} />
      <Route path="login" element={<Login />} />
      <Route path="sites" element={<Sites />} />
      <Route path="user" element={<User />} />
      <Route path="site/:id" element={<SiteLayout />}> 
        <Route index element={<Navigate to="start" replace />} />
        <Route path="list" element={<SiteList />} />
        <Route path="start" element={<SiteStart />} />
        <Route path="records" element={<SiteRecords />} />
        <Route path="manage" element={<SiteManage />} />
        <Route path="export" element={<SiteExport />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Route>
  )
);

export default router;
