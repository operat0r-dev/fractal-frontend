import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Task } from '../types/types';

type props = {
  task: Task;
};

export default function BoardEntry(props: props) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{props.task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <p>Column ID: {props.task.column_id}</p>
              <p>Seq: {props.task.seq}</p>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
