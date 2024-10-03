import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAppDispatch } from '@/hooks';
import { setSidebarOpen } from '../board';
import { Task } from '../types/types';

type props = {
  task: Task;
};

export default function BoardEntry({ task }: props) {
  const dispatch = useAppDispatch();

  return (
    <Card
      className="w-full board-entry rounded"
      onClick={() => dispatch(setSidebarOpen(true))}
    >
      <CardHeader>
        <CardTitle>{task.title}</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}
