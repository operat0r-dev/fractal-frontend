import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
import { selectAllBoards } from '../slices/boardsSlice';
import { useAppSelector } from '@/store/hooks';
import CreateBoardDialog from './dialogs/CreteBoardDialog';
import EditBoardDialog from './dialogs/EditBoardDialog';

const Boards = () => {
  const { t } = useTranslation();
  const boards = useAppSelector(selectAllBoards);
  const currentWorkspace = useAppSelector((state) => state.workspaces.current);

  if (!boards.length) {
    return (
      <>
        <h2 className="font-bold text-xl mb-4">{t('boards.title')}</h2>
        <div className="grid grid-cols-4 justify-evenly gap-4">
          <Skeleton className="h-[100px]" />
          <Skeleton className="h-[100px]" />
        </div>
      </>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-bold text-xl">{t('boards.title')}</h2>
        <CreateBoardDialog />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {boards.map(({ id, name, color }) => (
          <div
            key={id}
            className="relative rounded-md w-full h-[100px] opacity-80 hover:opacity-100 transition-opacity duration-300 text-black"
            style={{ backgroundColor: color }}
          >
            <Link
              to={`/workspace/${currentWorkspace?.id}/board/${id}`}
              className="block p-4 w-full h-full font-bold"
            >
              {name}
            </Link>
            <EditBoardDialog
              id={id}
              name={name}
              color={color}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Boards;
