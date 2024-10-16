import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTranslation } from 'react-i18next';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { useWorkspacesApi } from '../../api/WorkspacesApi';
import { useState } from 'react';
import LoadingButton from '@/components/ui/loading-button';
import { memo } from 'react';
import {
  selectCurrentWorkspace,
  updateReduxWorkspace,
} from '@/modules/workspaces/slices/workspacesSlice';
import { useAppSelector } from '@/store/hooks';
import { useAppDispatch } from '@/store/hooks';

const formSchema = z.object({
  name: z.string({ message: 'this field is required' }),
  description: z.string().optional(),
});

const defaultValues = {
  name: '',
  description: undefined,
};

const EditWorkspaceDialog = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { updateWorkspace } = useWorkspacesApi();
  const { toast } = useToast();
  const { t } = useTranslation();
  const workspace = useAppSelector(selectCurrentWorkspace);
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!workspace?.id) return;
      setLoading(true);
      const response = await updateWorkspace(String(workspace.id), values);
      dispatch(updateReduxWorkspace(response));

      toast({
        variant: 'success',
        description: t('workspace.edit.success'),
      });
      setLoading(false);
      setOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          description: t('workspace.error.changeName'),
        });
      }
    }
  };

  const handleOpen = () => {
    form.reset({ name: workspace?.name, description: workspace?.description });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleOpen()}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('workspace.edit.title')}</DialogTitle>
          <DialogDescription>
            {t('workspace.edit.description')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('workspace.form.name')} *</FormLabel>
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('workspace.form.description')}</FormLabel>
                  <FormControl>
                    <Input
                      id="description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            className="inline-flex"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            {t('general.cancel')}
          </Button>
          <LoadingButton
            loading={loading}
            onClick={form.handleSubmit(onSubmit)}
          >
            {t('general.submit')}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default memo(EditWorkspaceDialog);
