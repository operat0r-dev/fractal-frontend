import { cn } from '@/lib/utils';
import { useAppSelector } from '@/hooks';
import { useAppDispatch } from '@/hooks';
import { Button } from '@/components/ui/button';
import { setSidebarOpen } from '@/modules/board/board';

const EditTaskSidebar = () => {
  const open = useAppSelector((state) => state.board.sidebarOpen);
  const dispatch = useAppDispatch();

  return (
    <div
      className={cn(
        open && 'translate-x-[-300px]',
        'absolute top-0 -right-[300px] w-[300px] h-full bg-black duration-300'
      )}
    >
      <Button onClick={() => dispatch(setSidebarOpen(false))}>Zamknij</Button>
    </div>
  );
};

export default EditTaskSidebar;
