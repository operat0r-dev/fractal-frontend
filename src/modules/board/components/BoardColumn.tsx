import { cn } from '@/lib/utils';
import { useState } from 'react';
import ControlPanel from './BoardColumn/ControlPanel';
import DroppableArea from './BoardColumn/DroppableArea';
import { useAppSelector } from '@/hooks';
import { selectColumnById } from '../slices/columnsSlice';
import { memo } from 'react';

type props = {
  columnId: number;
};

const BoardColumn = ({ columnId }: props) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const column = useAppSelector((state) => selectColumnById(state, columnId));

  const toggleCollapse = () => {
    setCollapsed((prevCollapsed) => !prevCollapsed);
  };

  return (
    <div
      className={cn(
        collapsed ? 'w-min' : 'w-[350px]',
        'h-full flex flex-col border rounded'
      )}
    >
      <ControlPanel
        collapsed={collapsed}
        onCollapsedChange={toggleCollapse}
        column={column}
        taskIds={column.tasks}
      />
      <DroppableArea
        taskIds={column.tasks}
        columnId={columnId}
        collapsed={collapsed}
      />
    </div>
  );
};
export default memo(BoardColumn);
