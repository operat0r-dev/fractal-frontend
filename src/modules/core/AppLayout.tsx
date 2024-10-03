import Header from './components/Header';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <>
      <Header />
      <div className="app-layout p-8 bg-black w-full">
        <Outlet />
      </div>
    </>
  );
};

export default AppLayout;
