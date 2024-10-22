import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import LoadingButton from '@/components/ui/loading-button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useBoardApi from '@/modules/board/api/boardApi';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { addReduxBoard } from '../../slices/boardsSlice';
import {
  selectAllWorkspaces,
  selectCurrentWorkspace,
} from '../../slices/workspacesSlice';
import { useHandleError } from '../useError';

const CreateBoardDialog = () => {
  const [open, setOpen] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const { storeBoard } = useBoardApi();
  const workspace = useAppSelector(selectCurrentWorkspace);
  const workspaces = useAppSelector(selectAllWorkspaces);
  const dispatch = useAppDispatch();

  const formSchema = z
    .object({
      workspace_id: z.number(),
      name: z.string({ message: t('form.required') }),
    })
    .superRefine(({ name }, ctx) => {
      if (!name.length) {
        ctx.addIssue({
          code: 'custom',
          message: t('form.required'),
          path: ['name'],
        });
      }
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      workspace_id: workspace?.id,
      name: '',
    },
  });

  const { setError } = form;
  const { handleError } = useHandleError();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await storeBoard(values);
      dispatch(addReduxBoard(response));
      setOpen(false);
    } catch (error) {
      handleError<z.infer<typeof formSchema>>(error, {
        formErrorHandler: setError,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    // form.reset({ workspace_id: workspace?.id });
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
                  <FormMessage />
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
                  <FormMessage />
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
