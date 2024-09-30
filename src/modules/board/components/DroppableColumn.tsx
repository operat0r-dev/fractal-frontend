import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, EllipsisVertical, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BoardEntry from './BoardEntry';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Column } from '../types/types';
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import useBoardApi from '../api';
import { SequenceIncrementor } from '../constants/SequenceConstants';
import type { Task } from '../types/types';

type props = {
  seq: number;
  column: Column;
  onTaskCreate: (payload: Task) => void;
};

const formSchema = z.object({
  column_id: z.number(),
  title: z.string(),
});

const columnNameFormSchema = z.object({
  name: z.string(),
});

const DroppableColumn = (props: props) => {
  const { storeTask, updateColumn } = useBoardApi();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      column_id: props.column.id,
      title: '',
    },
  });

  const columnNameForm = useForm<z.infer<typeof columnNameFormSchema>>({
    resolver: zodResolver(columnNameFormSchema),
    defaultValues: {
      name: props.column.name,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await storeTask({
      ...values,
      seq: props.column.tasks.length
        ? props.column.tasks[props.column.tasks.length - 1].seq +
          SequenceIncrementor
        : SequenceIncrementor,
    });

    props.onTaskCreate(response);
  };

  const onColumnNameFormSubmit = async (
    values: z.infer<typeof columnNameFormSchema>
  ) => {
    if (!values.name.length) {
      columnNameForm.setValue('name', props.column.name);
    }
    const response = await updateColumn(values, String(props.column.id));
  };

  return (
    <Card className="w-[350px] h-full flex flex-col">
      <CardHeader className="py-2 flex-row items-center justify-between border-t-4 border-t-green-500 rounded-tl-lg rounded-tr-lg">
        <CardTitle>
          <Form {...columnNameForm}>
            <form className="space-y-4">
              <FormField
                control={columnNameForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        id="name"
                        className="border-none"
                        {...field}
                        onBlur={columnNameForm.handleSubmit(
                          onColumnNameFormSubmit
                        )}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardTitle>
        <div className="space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Form {...form}>
                <form className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task name</FormLabel>
                        <FormControl>
                          <Input
                            id="title"
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon">
                <EllipsisVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <Trash className="h-4 w-4 mr-2" />
                <span>Delete column</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <Droppable droppableId={`${props.seq}`}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col flex-grow overflow-y-auto">
            <CardContent className="px-4 space-y-4">
              {props.column.tasks.map((task, index) => (
                <Draggable
                  key={task.id}
                  draggableId={String(task.id)}
                  index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}>
                      <BoardEntry task={task} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </CardContent>
          </div>
        )}
      </Droppable>
    </Card>
  );
};

export default DroppableColumn;
