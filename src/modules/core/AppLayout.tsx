import Header from './components/Header';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <>
      <Header />
      <div className="app-layout">
        <Outlet />
      </div>
    </>
  );
};

export default AppLayout;
