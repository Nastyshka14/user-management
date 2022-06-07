import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { RegPage } from './pages/RegPage';
import { AuthPage } from './pages/AuthPage';
import { UsersPage } from './pages/UsersPage';

export const useRoutes = (isAuthenticated) => {
  if (isAuthenticated) {
    return (
      <Routes>
        <Route path="/users" element={<UsersPage />}></Route>
        <Route path="*" element={<Navigate to="/users" />} />
      </Routes>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<AuthPage />}></Route>
      <Route path="/reg" element={<RegPage />}></Route>
      <Route path="/" element={<Navigate to="/" />} />
    </Routes>
  );
};
