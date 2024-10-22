import { Separator } from '@/components/ui/separator';
import { useAppDispatch } from '@/store/hooks';
import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { setReduxUsers } from '../users/slices/usersSlice';
import { useWorkspacesApi } from './api/workspacesApi';
import Banner from './components/Banner';
import Navigation from './components/Navigation';
import { useHandleError } from './components/useError';
import { setReduxBoards } from './slices/boardsSlice';
import { setCurrentWorkspace } from './slices/workspacesSlice';

const Workspace = () => {
  const { getWorkspace } = useWorkspacesApi();
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { handleError } = useHandleError();

  useEffect(() => {
    const fetchWorkspace = async () => {
      if (!id) return;
      try {
        const response = await getWorkspace(id);

        dispatch(
          setCurrentWorkspace({
            ...response,
            users: response.users.map(({ id }) => id),
            boards: response.boards.map(({ id }) => id),
          })
        );
        dispatch(setReduxUsers(response.users));
        dispatch(setReduxBoards(response.boards));
      } catch (error) {
        handleError(error);
      }
    };

    fetchWorkspace();
  }, [id]);

  return (
    <div className="flex h-full">
      <Navigation />

      <div className="container">
        <div className="p-8">
          <Banner />
        </div>
        <Separator />
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Workspace;
