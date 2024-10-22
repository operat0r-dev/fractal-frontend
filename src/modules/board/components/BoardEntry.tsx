import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { selectUserById } from '@/modules/users/slices/usersSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { setSidebarOpen } from '../slices/boardSlice';
import { selectTaskById, setCurrentTask } from '../slices/tasksSlice';
import { ReduxTask } from '../types/stateTypes';
import TaskBadgeWrapper from './BoardColumn/TaskBadgeWrapper';
import { File } from 'lucide-react';

type BoardEntryProps = {
  taskId: number;
};

const BoardEntry = ({ taskId }: BoardEntryProps) => {
  const dispatch = useAppDispatch();
  const reduxTask = useAppSelector((state) => selectTaskById(state, taskId));
  const user = useAppSelector((state) =>
    reduxTask.user_id ? selectUserById(state, reduxTask.user_id) : null
  );

  const showTaskDetails = (payload: ReduxTask) => {
    dispatch(setCurrentTask(payload.id));
    dispatch(setSidebarOpen(true));
  };

  return (
    <Card
      className="min-h-24 w-full board-entry rounded"
      onClick={() => showTaskDetails(reduxTask)}
    >
      <CardHeader className="p-4">
        <CardTitle className="text-sm">
          <Link
            className="hover:underline"
            to={`/task/${reduxTask.id}`}
          >
            {reduxTask.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 space-y-4 pb-4">
        <div className="flex flex-wrap gap-2">
          {reduxTask.labels.map((label) => (
            <TaskBadgeWrapper
              key={label}
              labelId={label}
            />
          ))}
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-1 text-muted-foreground">
            <File className="h-4 w-4" />
            <span className="text-sm font-light">#{reduxTask.id}</span>
          </div>
          {user && (
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center justify-center bg-muted h-8 w-8 rounded-full">
                    <span className="text-sm">{user.name.charAt(0)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>{user.name}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(BoardEntry);
