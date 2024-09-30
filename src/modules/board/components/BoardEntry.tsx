import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Pen } from 'lucide-react';

import { Task } from '../types/types';

type props = {
  task: Task;
};

export default function BoardEntry(props: props) {
  return (
    <Card className="w-full board-entry">
      <CardHeader>
        <CardTitle>{props.task.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-end">
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <p>Column ID: {props.task.column_id}</p>
                <p>Seq: {props.task.seq}</p>
              </div>
            </div>
          </form>
          <Button
            className="board-entry-edit-btn hidden"
            variant="outline"
            size="icon">
            <Pen className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
