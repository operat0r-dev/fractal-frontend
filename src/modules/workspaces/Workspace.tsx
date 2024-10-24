import { Separator } from '@/components/ui/separator';
import { useAppDispatch } from '@/store/hooks';
import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { setReduxUsers } from '../users/slices/usersSlice';
import WorkspaceApi from './api/workspace';
import Banner from './components/Banner';
import Navigation from './components/Navigation';
import { useHandleError } from './components/useError';
import { setReduxBoards } from './slices/boardsSlice';
import { setCurrentWorkspace } from './slices/workspacesSlice';

const Workspace = () => {
  const { id } = useParams();
  const { handleError } = useHandleError();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!id) return;

    WorkspaceApi.getOne(id)
      .then(({ workspace, boards, users }) => {
        dispatch(setCurrentWorkspace(workspace));
        dispatch(setReduxUsers(users));
        dispatch(setReduxBoards(boards));
      })
      .catch((error) => handleError(error));
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
