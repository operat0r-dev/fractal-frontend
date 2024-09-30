import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Form,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  DragDropContext,
  DropResult,
  DraggableLocation,
} from '@hello-pangea/dnd';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import useBoardApi from './api';
import type { Column, Task } from './types/types';
import DroppableColumn from './components/DroppableColumn';
import { SequenceIncrementor } from './constants/SequenceConstants';

const formSchema = z.object({
  board_id: z.number(),
  name: z.string(),
});

const reorder = (list: Task[], startIndex: number, endIndex: number) => {
  const tasksArray = Array.from(list);
  const [taskToReorder] = tasksArray.splice(startIndex, 1);
  tasksArray.splice(endIndex, 0, taskToReorder);

  const result = calculateSequenceNumber(tasksArray, endIndex);
  const { id, seq } = result[endIndex];

  return { result, id, seq };
};

const calculateSequenceNumber = (tasks: Task[], taskIndex: number) => {
  const reorderedTasks = [...tasks];

  if (tasks.length === 1) {
    reorderedTasks[taskIndex].seq = SequenceIncrementor;
  } else if (taskIndex === 0 && tasks.length > 1) {
    reorderedTasks[taskIndex].seq = reorderedTasks[taskIndex + 1].seq / 2;
  } else if (taskIndex === reorderedTasks.length - 1) {
    reorderedTasks[taskIndex].seq =
      reorderedTasks[taskIndex - 1].seq + SequenceIncrementor;
  } else {
    reorderedTasks[taskIndex].seq =
      (reorderedTasks[taskIndex + 1].seq + reorderedTasks[taskIndex - 1].seq) /
      2;
  }

  return reorderedTasks;
};

const move = (
  source: Column,
  destination: Column,
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) => {
  const sourceClone = Array.from(source.tasks);
  const destClone = Array.from(destination.tasks);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const calculateSequenceNumber = (tasks: Task[], taskIndex: number) => {
    if (tasks.length === 1) {
      return (tasks[taskIndex].seq = SequenceIncrementor);
    } else if (taskIndex === 0 && tasks.length > 1) {
      return tasks[taskIndex + 1].seq / 2;
    } else if (taskIndex === tasks.length - 1) {
      return tasks[taskIndex - 1].seq + SequenceIncrementor;
    }
    return (tasks[taskIndex + 1].seq + tasks[taskIndex - 1].seq) / 2;
  };

  const newSequenceNumber = calculateSequenceNumber(
    destClone,
    droppableDestination.index
  );

  const result: { [key: number]: Column } = {};

  result[+droppableSource.droppableId] = {
    ...source,
    tasks: sourceClone,
  };
  result[+droppableDestination.droppableId] = {
    ...destination,
    tasks: destClone.map((task, index) => {
      return {
        ...task,
        column_id: Number(destination.id),
        seq:
          index === droppableDestination.index ? newSequenceNumber : task.seq,
      };
    }),
  };

  return {
    result,
    column_id: destination.id,
    id: removed.id,
    seq: newSequenceNumber,
  };
};

const Board = () => {
  const { id } = useParams<string>();
  const { index, storeColumn, moveTask, reorderTask } = useBoardApi();
  const [columns, setColumns] = useState<Column[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchBoards = async () => {
      if (!id) return;
      const response = await index(id);
      if (isMounted) {
        setColumns(response.columns);
      }
    };

    fetchBoards();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      board_id: Number(id),
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await storeColumn({ ...values, seq: columns.length + 1 });
    setColumns((prevColumns) => [...prevColumns, response]);
  };

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceColumnIndex = +source.droppableId;
    const destinationColumnIndex = +destination.droppableId;

    if (
      sourceColumnIndex === destinationColumnIndex &&
      source.index !== destination.index
    ) {
      await handleReorder(sourceColumnIndex, source.index, destination.index);
    }

    if (sourceColumnIndex !== destinationColumnIndex) {
      await handleMove(
        sourceColumnIndex,
        destinationColumnIndex,
        source,
        destination
      );
    }
  };

  const handleReorder = async (
    columnIndex: number,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    const { result, id, seq } = reorder(
      columns[columnIndex].tasks,
      sourceIndex,
      destinationIndex
    );
    const updatedColumns = [...columns];
    updatedColumns[columnIndex].tasks = result;
    handleColumnsUpdate(sourceIndex, destinationIndex, updatedColumns);

    await reorderTask({ seq }, String(id));
  };

  const handleMove = async (
    sourceIndex: number,
    destinationIndex: number,
    source: DraggableLocation,
    destination: DraggableLocation
  ) => {
    const { result, column_id, id, seq } = move(
      columns[sourceIndex],
      columns[destinationIndex],
      source,
      destination
    );
    const updatedColumns = [...columns];
    updatedColumns[sourceIndex] = result[sourceIndex];
    updatedColumns[destinationIndex] = result[destinationIndex];
    handleColumnsUpdate(sourceIndex, destinationIndex, updatedColumns);

    await moveTask({ column_id, seq }, String(id));
  };

  const handleColumnsUpdate = (
    sourceIndex: number,
    destinationIndex: number,
    updatedColumns: Column[]
  ) => {
    setColumns((prevColumns) =>
      prevColumns.map((column, index) => {
        if (index === sourceIndex || index === destinationIndex) {
          return { ...column, tasks: updatedColumns[index].tasks };
        }

        return column;
      })
    );
  };

  const handleTaskCreate = (payload: Task) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) => {
        if (payload.column_id === column.id) {
          return {
            ...column,
            tasks: [...column.tasks, payload],
          };
        }

        return column;
      })
    );
  };

  return (
    <div className="flex gap-4 h-full">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex h-full gap-4">
          {columns.map((column, index) => (
            <DroppableColumn
              key={column.id}
              column={column}
              seq={index}
              onTaskCreate={handleTaskCreate}
            />
          ))}
        </div>
      </DragDropContext>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[300px] h-[100px]">
            Create new column
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Column name</FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                variant="default"
                onClick={form.handleSubmit(onSubmit)}>
                Create
              </Button>
            </form>
          </Form>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Board;
