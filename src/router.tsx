import { createBrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import Login from '@/modules/auth/Login';
import Register from '@/modules/auth/Register';
import AppLayout from './modules/core/AppLayout.tsx';
import ProtectedRoutes from './utils/ProtectedRoutes.tsx';
import Settings from './modules/settings/components/Settings.tsx';
import Workspace from './modules/workspaces/Workspace.tsx';
import Labels from './modules/labels/Labels.tsx';
import Boards from './modules/workspaces/components/Boards.tsx';
import Users from './modules/workspaces/components/Users.tsx';
import Task from './modules/tasks/components/Task.tsx';
import KanbanBoard from './modules/board/KanbanBoard.tsx';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        element: <ProtectedRoutes />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: '/workspace/:workspace_id/board/:board_id',
                element: <KanbanBoard />,
              },
              {
                path: '/workspace/:workspace_id/board/:board_id/labels',
                element: <Labels />,
              },
              {
                path: '/settings',
                element: <Settings />,
              },
              {
                path: '/workspace/:workspace_id',
                element: <Workspace />,
                children: [
                  {
                    path: '/workspace/:workspace_id/boards',
                    element: <Boards />,
                  },
                  {
                    path: '/workspace/:workspace_id/users',
                    element: <Users />,
                  },
                ],
              },
              {
                path: '/workspace/:workspace_id/board/:board_id/task/:task_id',
                element: <Task />,
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
