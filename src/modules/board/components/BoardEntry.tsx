import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch } from '@/hooks';
import { useAppSelector } from '@/hooks';
import { setSidebarOpen } from '../slices/boardSlice';
import { setCurrentTask, selectTaskById } from '../slices/tasksSlice';
import { ReduxTask } from '../types/stateTypes';
import { memo } from 'react';
import TaskBadgeWrapper from './BoardColumn/TaskBadgeWrapper';

type props = {
  taskId: number;
};

const BoardEntry = ({ taskId }: props) => {
  const dispatch = useAppDispatch();
  const reduxTask = useAppSelector((state) => selectTaskById(state, taskId));

  const showTaskDetails = (payload: ReduxTask) => {
    dispatch(setCurrentTask(payload.id));
    dispatch(setSidebarOpen(true));
  };

  return (
    <Card
      className="w-full board-entry rounded"
      onClick={() => showTaskDetails(reduxTask)}
    >
      <CardHeader>
        <CardTitle>{reduxTask.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {reduxTask.labels.map((label) => (
          <TaskBadgeWrapper
            key={label}
            labelId={label}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default memo(BoardEntry);
