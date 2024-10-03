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
import { Link } from 'react-router-dom';
import type { Board } from '../types/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
import useBoardApi from '@/modules/board/api';

type props = {
  boards?: Board[];
  onBoardCreate: (payload: Board) => void;
};

const formSchema = z.object({
  workspace_id: z.number(),
  name: z.string(),
});

const WorkspaceBoards = ({ boards, onBoardCreate }: props) => {
  const { t } = useTranslation();
  const { storeBoard } = useBoardApi();
  const workspace = useAppSelector(currentWorkspace);
  const workspaces = useAppSelector((state) => state.workspaces.workspaces);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workspace_id: workspace?.id,
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await storeBoard(values);
    onBoardCreate(response);
  };

  if (!boards) {
    return (
      <div className="grid grid-cols-4 justify-evenly gap-4">
        <Skeleton className="h-[100px]" />
        <Skeleton className="h-[100px]" />
        <Skeleton className="h-[100px]" />
        <Skeleton className="h-[100px]" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 justify-evenly gap-4">
      {boards.map((board) => (
        <Link
          className="border rounded-md p-4 font-bold w-full h-[100px] bg-destructive"
          key={board.id}
          to={`/board/${board.id}`}
        >
          {board.name}
        </Link>
      ))}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full h-[100px]"
          >
            {t('boards.create.board')}
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
                    <FormLabel>{t('boards.form.name')}</FormLabel>
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
                name="workspace_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('boards.form.workspace')}</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(e) => field.onChange(Number(e))}
                        defaultValue={String(field.value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose workspace" />
                        </SelectTrigger>
                        <SelectContent>
                          {workspaces.map((workspace) => (
                            <SelectItem
                              key={workspace.id}
                              value={String(workspace.id)}
                            >
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
                onClick={form.handleSubmit(onSubmit)}
              >
                {t('general.submit')}
              </Button>
            </form>
          </Form>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default WorkspaceBoards;
