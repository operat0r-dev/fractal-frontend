import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useToast } from '@/hooks/use-toast';
import WorkspaceApi from '@/modules/workspaces/api/workspace';
import {
  selectAllWorkspaces,
  setReduxWorkspaces,
} from '@/modules/workspaces/slices/workspacesSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { SetStateAction, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

type CreateWorkspaceDialogProps = {
  open: boolean;
  setOpen: (value: SetStateAction<boolean>) => void;
};

const formSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

const defaultValues = {
  name: '',
  description: undefined,
};

const CreateWorkspaceDialog = ({
  open,
  setOpen,
}: CreateWorkspaceDialogProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const workspaces = useAppSelector(selectAllWorkspaces);
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    WorkspaceApi.store(values)
      .then((response) => {
        dispatch(setReduxWorkspaces([response, ...workspaces]));

        toast({
          description: t('workspace.create.success'),
          variant: 'success',
        });
        setLoading(false);
        setOpen(false);
      })
      .catch((error: unknown) => {
        if (error instanceof Error) {
          toast({
            description: t('workspace.error.create'),
            variant: 'destructive',
          });
          setLoading(false);
        }
      });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('workspace.create.title')}</DialogTitle>
          <DialogDescription>
            {t('workspace.create.description')}
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
                      className="col-span-3"
                      {...field}
                    />
                  </FormControl>
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
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
          >
            {t('general.submit')}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateWorkspaceDialog;
