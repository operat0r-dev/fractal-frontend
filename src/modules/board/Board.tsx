import { Button } from '@/components/ui/button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Tag } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import useBoardApi from './api/api';
import BoardColumn from './components/BoardColumn';
import CreateColumnPopover from './components/BoardColumn/CreateColumnPopover';
import EditTaskSidebar from './components/EditTaskSidebar';
import { SequenceIncrementor } from './constants/SequenceConstants';
import {
  resetColumns,
  selectColumnById,
  selectColumnIds,
  setReduxColumns,
  updateColumnsTasks,
} from './slices/columnsSlice';
import {
  resetTasks,
  selectAllTasksOrderedBySeq,
  setReduxTasks,
  taskUpdated,
} from './slices/tasksSlice';
import { move, reorder } from './utils/boardUtils';

const Board = () => {
  const { id } = useParams<string>();
  const { t } = useTranslation();
  const { index, updateTask } = useBoardApi();
  const reduxColumns = useAppSelector(selectColumnIds);
  const reduxTasks = useAppSelector(selectAllTasksOrderedBySeq);
  const dispatch = useAppDispatch();
  const lastSeq = useAppSelector((state) =>
    selectColumnById(state, reduxColumns[reduxColumns.length - 1])
  )?.seq;

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
    <div className="relative flex flex-col h-full w-full overflow-hidden p-10">
      <div className="flex justify-end mb-4">
        <Link to={`/board/${id}/labels`}>
          <Button
            size="sm"
            variant="outline"
            className="ml-auto"
          >
            <Tag className="h-4 w-4 mr-2" />
            {t('label.labels')}
          </Button>
        </Link>
      </div>
      <div className="flex flex-grow gap-4 w-full overflow-auto">
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

        <CreateColumnPopover newColumnSeq={lastSeq + SequenceIncrementor} />
      </div>

      <EditTaskSidebar />
    </div>
  );
};

export default Board;
