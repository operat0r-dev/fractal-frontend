import { cn } from '@/lib/utils';
import { useState } from 'react';
import ControlPanel from './BoardColumn/ControlPanel';
import DroppableArea from './BoardColumn/DroppableArea';
import { useAppSelector } from '@/store/hooks';
import { selectColumnById } from '../slices/columnsSlice';
import { memo } from 'react';
import { Draggable } from '@hello-pangea/dnd';

type props = {
  columnId: number;
  index: number;
};

const BoardColumn = ({ columnId, index }: props) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const column = useAppSelector((state) => selectColumnById(state, columnId));

  const toggleCollapse = () => {
    setCollapsed((prevCollapsed) => !prevCollapsed);
  };

  return (
    <Draggable
      draggableId={column.name}
      index={index}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={cn(
            collapsed ? 'w-min' : 'w-[350px]',
            'h-full flex flex-col border rounded bg-background'
          )}
        >
          <ControlPanel
            collapsed={collapsed}
            onCollapsedChange={toggleCollapse}
            column={column}
            taskIds={column.tasks}
            provided={provided}
          />
          <DroppableArea
            taskIds={column.tasks}
            columnId={columnId}
            collapsed={collapsed}
          />
        </div>
      )}
    </Draggable>
  );
};
export default memo(BoardColumn);
