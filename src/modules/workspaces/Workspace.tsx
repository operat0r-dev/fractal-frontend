import Banner from './components/Banner';
import { Separator } from '@/components/ui/separator';
import { useEffect } from 'react';
import { useWorkspacesApi } from './api/WorkspacesApi';
import { Outlet, useParams } from 'react-router-dom';
import type { Workspace } from './types/types';
import Navigation from './components/Navigation';
import { useAppDispatch } from '@/store/hooks';
import { setReduxBoards } from './slices/boardsSlice';
import { setCurrentWorkspace } from './slices/workspacesSlice';
import { setReduxUsers } from './slices/usersSlice';

const Workspace = () => {
  const { getWorkspace } = useWorkspacesApi();
  const { id } = useParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchWorkspace = async () => {
      if (!id) return;

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
