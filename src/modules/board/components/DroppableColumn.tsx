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
import apiClient from '@/apiClient';

type props = {
  seq: number;
  column: Column;
};

const formSchema = z.object({
  column_id: z.number(),
  title: z.string(),
});

const DroppableColumn = (props: props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      column_id: props.column.id,
      title: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await apiClient.post('/task/store', {
      ...values,
      seq: props.column.tasks.length + 1,
    });
  };

  return (
    <Card className="w-[350px] h-full flex flex-col">
      <CardHeader className="py-2 flex-row items-center justify-between border-t-4 border-t-green-500 rounded-tl-lg rounded-tr-lg">
        <CardTitle>{props.column.name}</CardTitle>
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
            className="flex flex-col flex-grow overflow-y-scroll">
            <CardContent className="px-4">
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
