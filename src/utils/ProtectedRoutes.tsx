import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

const ProtectedRoutes = () => {
  const tokenData = useAppSelector((state) => state.auth.tokenData);
  if (!tokenData) return <Navigate to="/login" />;

  return <Outlet />;
};

export default ProtectedRoutes;
