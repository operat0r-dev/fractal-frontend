import { useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { useParams } from 'react-router-dom';
import useBoardApi from './api/api';
import BoardColumn from './components/BoardColumn';
import CreateColumnPopover from './components/BoardColumn/CreateColumnPopover';
import EditTaskSidebar from './components/EditTaskSidebar';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tag } from 'lucide-react';
import { useAppDispatch } from '@/hooks';
import {
  setReduxColumns,
  updateColumnsTasks,
  resetColumns,
} from './slices/columnsSlice';
import { useAppSelector } from '@/hooks';
import { selectColumnIds } from './slices/columnsSlice';
import {
  selectAllTasksOrderedBySeq,
  setReduxTasks,
  taskUpdated,
  resetTasks,
} from './slices/tasksSlice';
import { reorder, move } from './utils/boardUtils';

const Board = () => {
  const { id } = useParams<string>();
  const { index, updateTask } = useBoardApi();
  const reduxColumns = useAppSelector(selectColumnIds);
  const reduxTasks = useAppSelector(selectAllTasksOrderedBySeq);
  const dispatch = useAppDispatch();

  useEffect(() => {
    let isMounted = true;

    const fetchBoards = async () => {
      if (!id) return;

      if (isMounted) {
        const response = await index(id);
        const columns = response.columns.map(({ tasks, ...column }) => ({
          ...column,
          tasks: tasks.map(({ id }) => id),
        }));

        const tasks = response.columns
          .map((column) =>
            column.tasks.map(({ labels, ...task }) => ({
              ...task,
              labels: labels.map(({ id }) => id),
            }))
          )
          .flat();

        dispatch(setReduxColumns(columns));
        dispatch(setReduxTasks(tasks));
      }
    };

    fetchBoards();

    return () => {
      isMounted = false;
      dispatch(resetTasks());
      dispatch(resetColumns());
    };
  }, [id]);

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceColumnId = +source.droppableId;
    const destinationColumnId = +destination.droppableId;

    if (
      sourceColumnId === destinationColumnId &&
      source.index !== destination.index
    ) {
      await handleReorder(sourceColumnId, source.index, destination.index);
    }

    if (sourceColumnId !== destinationColumnId) {
      await handleMove(
        sourceColumnId,
        destinationColumnId,
        source.index,
        destination.index
      );
    }
  };

  const handleReorder = async (
    columnId: number,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    const movedTask = reorder(
      reduxTasks,
      columnId,
      sourceIndex,
      destinationIndex
    );

    dispatch(
      updateColumnsTasks({
        destinationIndex,
        sourceId: columnId,
        destinationId: columnId,
        taskId: movedTask.id,
      })
    );

    dispatch(
      taskUpdated({
        ...movedTask,
      })
    );

    await updateTask(movedTask.id, { seq: movedTask.seq });
  };

  const handleMove = async (
    sourceId: number,
    destinationId: number,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    const movedTask = move(
      reduxTasks,
      sourceId,
      destinationId,
      sourceIndex,
      destinationIndex
    );

    dispatch(
      updateColumnsTasks({
        destinationIndex,
        sourceId,
        destinationId,
        taskId: movedTask.id,
      })
    );
    dispatch(
      taskUpdated({
        ...movedTask,
      })
    );

    await updateTask(movedTask.id, {
      column_id: movedTask.column_id,
      seq: movedTask.seq,
    });
  };

  return (
    <div className="relative h-full w-full overflow-hidden p-10">
      <Link to={`/board/${id}/labels`}>
        <Button
          size="sm"
          variant="outline"
        >
          <Tag className="h-4 w-4 mr-2" />
          Labels
        </Button>
      </Link>
      <div className="flex gap-4 h-full w-full overflow-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex h-full gap-4">
            {reduxColumns.map((id) => (
              <BoardColumn
                key={id}
                columnId={id}
              />
            ))}
          </div>
        </DragDropContext>

        <CreateColumnPopover newColumnSeq={reduxColumns.length + 1} />
      </div>

      <EditTaskSidebar />
    </div>
  );
};

export default Board;
