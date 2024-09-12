import { Outlet } from "react-router-dom"
import { useEffect } from "react";
import apiClient from "./apiClient";

function App() {
  return (
    <>
      <Outlet />
    </>
  )
}

export default App
