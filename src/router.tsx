import App from './App.tsx';
import Login from "@/modules/auth/Login";
import Register from "@/modules/auth/Register"
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
      path: "/",
      element: <App />,
      children: [
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/register",
            element: <Register />,
        },
      ]
  },
]);