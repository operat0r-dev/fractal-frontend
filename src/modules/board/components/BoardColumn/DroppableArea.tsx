import { Droppable, Draggable, type DraggableStyle } from '@hello-pangea/dnd';
import type { Column } from '../../types/Board';
import BoardEntry from './../BoardEntry';

import { cn } from '@/lib/utils';

type props = {
  collapsed: boolean;
  column: Column;
  seq: number;
};

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'hsl(240 3.7% 15.9%)' : 'hsl(240 10% 3.9%)',
});

const getItemStyle = (draggableStyle: DraggableStyle | undefined) => ({
  userSelect: 'none',
  ...draggableStyle,
});

const DroppableArea = ({ collapsed, column, seq }: props) => {
  return (
    <Droppable droppableId={`${seq}`}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          style={getListStyle(snapshot.isDraggingOver)}
          className={cn(
            collapsed
              ? 'hidden'
              : 'py-2 flex flex-col flex-grow overflow-y-auto rounded-b'
          )}
        >
          <div className="px-2 space-y-2">
            {column.tasks.map((task, index) => (
              <Draggable
                key={task.id}
                draggableId={String(task.id)}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getItemStyle(provided.draggableProps.style)}
                  >
                    <BoardEntry task={task} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default DroppableArea;
