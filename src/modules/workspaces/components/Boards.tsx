import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
import { selectAllBoards } from '../slices/boardsSlice';
import { useAppSelector } from '@/store/hooks';
import CreateBoardDialog from './dialogs/CreteBoardDialog';

const Boards = () => {
  const { t } = useTranslation();
  const boards = useAppSelector(selectAllBoards);

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
          <Link
            className="border text-black rounded-md p-4 font-bold w-full h-[100px]"
            key={board.id}
            to={`/board/${board.id}`}
            style={{ backgroundColor: board.color }}
          >
            {board.name}
          </Link>
        ))}
        <CreateBoardDialog />
      </div>
    </>
  );
};

export default Boards;
