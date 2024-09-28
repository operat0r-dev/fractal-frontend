import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppSelector } from '@/hooks';
import { currentWorkspace } from '../slices/workspaces';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import apiClient from '@/apiClient';
import { Link } from 'react-router-dom';
import type { Board } from '../types/types';
import { Skeleton } from '@/components/ui/skeleton';

type props = {
  boards?: Board[];
};

const formSchema = z.object({
  workspaceId: z.number(),
  name: z.string(),
});

const WorkspaceBoards = (props: props) => {
  const workspace = useAppSelector(currentWorkspace);
  const workspaces = useAppSelector((state) => state.workspaces.workspaces);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workspaceId: workspace?.id,
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await apiClient.post('/board/store', values);
  };

  if (!props.boards) {
    return (
      <div className="flex gap-4">
        <Skeleton className="w-[300px] h-[100px]" />
        <Skeleton className="w-[300px] h-[100px]" />
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {props.boards.map((board) => (
        <Link
          className="border rounded-md p-4 font-bold w-[300px] h-[100px] bg-destructive"
          key={board.id}
          to={`/board/${board.id}`}>
          {board.name}
        </Link>
      ))}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[300px] h-[100px]">
            Create new board
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
                    <FormLabel>Board name</FormLabel>
                    <FormControl>
                      <Input
                        id="name"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="workspaceId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Workspace</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(e) => field.onChange(Number(e))}
                        defaultValue={String(field.value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose workspace" />
                        </SelectTrigger>
                        <SelectContent>
                          {workspaces.map((workspace) => (
                            <SelectItem
                              key={workspace.id}
                              value={String(workspace.id)}>
                              {workspace.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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

export default WorkspaceBoards;
