import { createBrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import Login from '@/modules/auth/Login';
import Register from '@/modules/auth/Register';
import AppLayout from './modules/core/AppLayout.tsx';
import ProtectedRoutes from './utils/ProtectedRoutes.tsx';
import Settings from './modules/settings/components/Settings.tsx';
import Workspace from './modules/workspaces/Workspace.tsx';
import Board from './modules/board/Board.tsx';
import Labels from './modules/board/Labels.tsx';
import Boards from './modules/workspaces/components/Boards.tsx';
import Users from './modules/workspaces/components/Users.tsx';

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
                path: '/board/:id',
                element: <Board />,
              },
              {
                path: '/board/:id/labels',
                element: <Labels />,
              },
              {
                path: '/settings',
                element: <Settings />,
              },
              {
                path: '/workspace/:id',
                element: <Workspace />,
                children: [
                  {
                    path: '/workspace/:id/boards',
                    element: <Boards />,
                  },
                  {
                    path: '/workspace/:id/users',
                    element: <Users />,
                  },
                ],
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
