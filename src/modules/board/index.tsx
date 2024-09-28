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

const formSchema = z.object({
  board_id: z.number(),
  name: z.string(),
});

const reorder = (list: Task[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result.map((task, index) => {
    return { ...task, seq: index + 1 };
  });
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

  const result: { [key: string]: Column } = {};
  result[droppableSource.droppableId] = {
    ...source,
    tasks: sourceClone,
  };
  result[droppableDestination.droppableId] = {
    ...destination,
    tasks: destClone.map((task, index) => {
      return { ...task, column_id: Number(destination.id), seq: index + 1 };
    }),
  };

  return result;
};

const Board = () => {
  const { id } = useParams<string>();
  const { index, storeColumn } = useBoardApi();
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

  function onDragEnd(result: DropResult) {
    const { source, destination } = result;

    if (!destination) {
      return;
    }
    const sourceIndex = +source.droppableId;
    const destinationIndex = +destination.droppableId;

    if (sourceIndex === destinationIndex) {
      handleReorder(sourceIndex, source.index, destination.index);
    } else {
      handleMove(sourceIndex, destinationIndex, source, destination);
    }
  }

  const handleReorder = (
    columnIndex: number,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    const items = reorder(
      columns[columnIndex].tasks,
      sourceIndex,
      destinationIndex
    );
    const updatedColumns = [...columns];
    updatedColumns[columnIndex].tasks = items;
    setColumns((prevColumns) =>
      prevColumns.map((column, index) => {
        if (index === sourceIndex || index === destinationIndex) {
          return { ...column, tasks: updatedColumns[index].tasks };
        }

        return column;
      })
    );
  };

  const handleMove = (
    sourceIndex: number,
    destinationIndex: number,
    source: DraggableLocation,
    destination: DraggableLocation
  ) => {
    const result = move(
      columns[sourceIndex],
      columns[destinationIndex],
      source,
      destination
    );
    const updatedColumns = [...columns];
    updatedColumns[sourceIndex] = result[sourceIndex];
    updatedColumns[destinationIndex] = result[destinationIndex];
    setColumns(updatedColumns);
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
