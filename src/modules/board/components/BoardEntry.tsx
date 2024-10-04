import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch } from '@/hooks';
import { setSidebarOpen, setCurrentTask } from '../slices/boardSlice';
import { Task } from '../types/Board';
import TaskBadge from './TaskBadge';

type props = {
  task: Task;
};

export default function BoardEntry({ task }: props) {
  const dispatch = useAppDispatch();

  const showTaskDetails = (payload: Task) => {
    dispatch(setCurrentTask(payload));
    dispatch(setSidebarOpen(true));
  };

  return (
    <Card
      className="w-full board-entry rounded"
      onClick={() => showTaskDetails(task)}
    >
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {task.labels.map((label) => (
          <TaskBadge
            key={label.id}
            name={label.name}
            color={label.color}
          />
        ))}
      </CardContent>
    </Card>
  );
}
