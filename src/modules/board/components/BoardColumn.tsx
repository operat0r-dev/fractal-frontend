import type { Column } from '../types/Board';

import type { Task } from '../types/Board';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import ControlPanel from './BoardColumn/ControlPanel';
import DroppableArea from './BoardColumn/DroppableArea';

type props = {
  seq: number;
  column: Column;
  onTaskCreate: (payload: Task) => void;
  onColorChange: (payload: Column) => void;
};

const BoardColumn = ({ seq, column, onTaskCreate, onColorChange }: props) => {
  const [collapsed, setCollapsed] = useState<boolean>(false);

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
        onTaskCreate={onTaskCreate}
        onColorChange={onColorChange}
      />
      <DroppableArea
        seq={seq}
        collapsed={collapsed}
        column={column}
      />
    </div>
  );
};

export default BoardColumn;
