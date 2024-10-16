import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import LoadingButton from '@/components/ui/loading-button';
import { useForm } from 'react-hook-form';
import {
  selectCurrentWorkspace,
  selectAllWorkspaces,
} from '../../slices/workspacesSlice';
import { useAppSelector } from '@/store/hooks';
import { useAppDispatch } from '@/store/hooks';
import useBoardApi from '@/modules/board/api/api';

const formSchema = z.object({
  workspace_id: z.number(),
  name: z.string(),
});
import { addReduxBoard } from '../../slices/boardsSlice';

const CreateBoardDialog = () => {
  const [open, setOpen] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const { storeBoard } = useBoardApi();
  const { toast } = useToast();
  const workspace = useAppSelector(selectCurrentWorkspace);
  const workspaces = useAppSelector(selectAllWorkspaces);
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workspace_id: workspace?.id,
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await storeBoard(values);
      dispatch(addReduxBoard(response));
      setLoading(false);
      setOpen(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          description: t('board.error.createColumn'),
        });
      }
      setLoading(false);
    }
  };

  const handleOpen = () => {
    form.reset({ workspace_id: workspace?.id });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-[100px]"
          onClick={() => handleOpen()}
        >
          {t('boards.create.board')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('workspace.addMembers.title')}</DialogTitle>
          <DialogDescription>
            {t('workspace.addMembers.description')}
          </DialogDescription>
        </DialogHeader>

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
          </form>
        </Form>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            {t('general.cancel')}
          </Button>
          <LoadingButton
            loading={loading}
            variant="default"
            onClick={form.handleSubmit(onSubmit)}
          >
            {t('general.submit')}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBoardDialog;
