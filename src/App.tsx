import { Outlet } from "react-router-dom";
import { useAppDispatch } from "./hooks";
import { useEffect } from "react";
import { loadTokenFromStorage } from "./modules/auth/slices/auth";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadTokenFromStorage());
  })

  return (
    <>  
      <Outlet />      
    </>
  )
}

export default App
