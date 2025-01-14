import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Tag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import ExpandableAside from '../core/components/ExpandableAside';
import TaskApi from '../tasks/api/task.ts';
import { setReduxUsers } from '../users/slices/usersSlice';
import WorkspaceApi from '../workspaces/api/workspace.ts';
import BoardApi from './api/board.ts';
import BoardColumn from './components/BoardColumn';
import CreateColumnPopover from './components/BoardColumn/CreateColumnPopover';
import EditTaskSidebar from './components/QuickEditTask';
import { SequenceIncrementor } from './constants/SequenceConstants';
import { setSidebarOpen } from './slices/kanbanBoardSlice.ts';
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
  const { workspace_id, board_id } = useParams();
  const { t } = useTranslation();
  const reduxColumns = useAppSelector(selectColumnIds);
  const reduxTasks = useAppSelector(selectAllTasksOrderedBySeq);
  const dispatch = useAppDispatch();
  const lastSeq =
    useAppSelector((state) =>
      selectColumnById(state, reduxColumns[reduxColumns.length - 1])
    )?.seq || 0;
  const [loading, setLoading] = useState(false);
  if (!board_id) return;

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setLoading(true);

      WorkspaceApi.getUsers(board_id).then((users) =>
        dispatch(setReduxUsers(users))
      );

      BoardApi.index(board_id).then(({ columns, tasks }) => {
        dispatch(setReduxColumns(columns));
        dispatch(setReduxTasks(tasks));
        setLoading(false);
      });
    }

    return () => {
      isMounted = false;
      dispatch(resetTasks());
      dispatch(resetColumns());
      dispatch(setSidebarOpen(false));
    };
  }, [board_id]);

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

    TaskApi.updateTask(movedTask.id, { seq: movedTask.seq });
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

    TaskApi.updateTask(movedTask.id, {
      column_id: movedTask.column_id,
      seq: movedTask.seq,
    });
  };

  return (
    <div className="relative flex flex-col h-full w-full overflow-hidden p-10">
      <div className="flex justify-end mb-4">
        <Link to={`/workspace/${workspace_id}/board/${board_id}/labels`}>
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
      {!loading ? (
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
      ) : (
        <div className="flex flex-grow gap-4">
          <Skeleton className="w-[350px]" />
          <Skeleton className="w-[350px]" />
        </div>
      )}
      <ExpandableAside>
        <EditTaskSidebar />
      </ExpandableAside>
    </div>
  );
};

export default Board;
