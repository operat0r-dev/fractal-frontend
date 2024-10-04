import Header from './components/Header';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <>
      <Header />
      <div className="app-layout bg-black w-full">
        <Outlet />
      </div>
    </>
  );
};

export default AppLayout;
