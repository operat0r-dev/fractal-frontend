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
    <>
      <h2 className="font-bold text-xl mb-4">{t('boards.title')}</h2>
      <div className="grid grid-cols-4 justify-evenly gap-4">
        {boards.map((board) => (
          <div
            key={board.id}
            className="relative rounded-md font-bold w-full h-[100px] opacity-80 hover:opacity-100 transition-opacity duration-300 text-black"
            style={{ backgroundColor: board.color }}
          >
            <Link
              to={`/workspace/${currentWorkspace?.id}/board/${board.id}`}
              className="block p-4 w-full h-ful"
            >
              {board.name}
            </Link>
            <EditBoardDialog
              id={board.id}
              name={board.name}
              color={board.color}
            />
          </div>
        ))}
        <CreateBoardDialog />
      </div>
    </>
  );
};

export default Boards;
