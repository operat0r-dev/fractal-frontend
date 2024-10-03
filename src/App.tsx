import { Outlet } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks';
import { setTokenData, setUser } from './modules/auth/slices/auth';
import { getLocalStorageItem } from './modules/core/helpers/LocalStorage';
import { JWTTokenResponse, User } from './modules/auth/interfaces/types';
import { Toaster } from './components/ui/toaster';

const App = () => {
  const { tokenData, user } = useAppSelector((state) => state.authData);
  const dispatch = useAppDispatch();

  if (!tokenData) {
    const localStorageTokenData =
      getLocalStorageItem<JWTTokenResponse>('token_data');

    if (localStorageTokenData) {
      dispatch(setTokenData(localStorageTokenData));
    }
  }

  if (!user) {
    const localStorageUserData = getLocalStorageItem<User>('user');

    if (localStorageUserData) {
      dispatch(setUser(localStorageUserData));
    }
  }

  return (
    <div className="w-[100vw] h-full">
      <Outlet />
      <Toaster />
    </div>
  );
};

export default App;
