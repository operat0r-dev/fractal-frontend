import QuickEditTask from '@/modules/board/components/QuickEditTask';
import { useParams } from 'react-router-dom';
import TaskApi from '../api/task.ts';
import { useEffect } from 'react';
import { useState } from 'react';
import type { Task } from '@/modules/tasks/domain';
import LabelsApi from '@/modules/labels/api/label.ts';
import { Label } from '@/modules/labels/domain/index.ts';
import TextEditor from './TextEditor.tsx';

const Task = () => {
  const [labels, setLabels] = useState<Label[]>([]);
  const [task, setTask] = useState<Task | undefined>(undefined);
  const { board_id, task_id } = useParams();

  useEffect(() => {
    let isMounted = false;

    if (isMounted || !board_id) return;

    LabelsApi.index(board_id).then((response) => {
      setLabels(response);
      isMounted = true;
    });

    return () => {
      isMounted = false;
    };
  }, [board_id]);

  useEffect(() => {
    let isMounted = false;

    if (isMounted || !task_id) return;

    TaskApi.getOne(task_id).then(({ task }) => {
      setTask(task);
    });

    return () => {
      isMounted = false;
    };
  }, [board_id]);

  return (
    <div className="flex relative w-full h-full overflow-hidden">
      <div className="container max-w-[1200px]">
        <TextEditor />
      </div>
      <div className="fixed bg-background h-full right-0 w-[300px] border-l p-4">
        <QuickEditTask />
      </div>
    </div>
  );
};

export default Task;
