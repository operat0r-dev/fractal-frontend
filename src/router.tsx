import App from './App.tsx';
import Login from '@/modules/auth/Login';
import Register from '@/modules/auth/Register';
import Dashboard from '@/modules/dashboard/components/DroppableColumn.tsx';
import AppLayout from './modules/core/AppLayout.tsx';
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoutes from './utils/ProtectedRoutes.tsx';
import Settings from './modules/settings/components/Settings.tsx';
import React from 'react';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            element: <ProtectedRoutes />,
            children: [
              {
                path: '/dashboard',
                element: <Dashboard />,
              },
              {
                path: '/settings',
                element: <Settings />,
              },
            ],
          },
        ],
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
    ],
  },
]);
