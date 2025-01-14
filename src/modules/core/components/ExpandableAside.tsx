import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { setSidebarOpen } from '@/modules/board/slices/kanbanBoardSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

type ExpandableAsideProps = {
  children: ReactNode;
};

const ExpandableAside = ({ children }: ExpandableAsideProps) => {
  const { sidebarOpen } = useAppSelector((state) => state.kanbanBoard);
  const dispatch = useAppDispatch();

  return (
    <aside
      className={cn(
        sidebarOpen && 'translate-x-[-300px]',
        'absolute top-0 -right-[300px] w-[300px] h-full bg-black duration-300 border-l bg-background p-4'
      )}
    >
      <div className="mb-4">
        <Button
          onClick={() => dispatch(setSidebarOpen(false))}
          size="icon"
          variant="ghost"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      {children}
    </aside>
  );
};

export default ExpandableAside;
