import App from './App.tsx';
import Login from "@/modules/auth/Login";
import Register from "@/modules/auth/Register"
import Dashboard from '@/modules/dashboard/components/Dashboard.tsx';
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
      path: "/",
      element: <App />,
      children: [
        {
          path: "/dashboard",
          element: <Dashboard />,
        },
      ]
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
      path: "/register",
      element: <Register />,
  },
]);