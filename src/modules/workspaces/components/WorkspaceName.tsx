import { useState } from 'react';
import { useWorkspacesApi } from '../api/WorkspacesApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import type { Workspace } from '../types/types';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';

type props = {
  workspace?: Workspace;
};

const formSchema = z.object({
  name: z.string(),
});

const WorkspaceName = ({ workspace }: props) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const { t } = useTranslation();
  const { updateWorkspace } = useWorkspacesApi();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!workspace?.id) return;
      const response = await updateWorkspace(String(workspace.id), values);
      form.setValue('name', response.name);
      toggleEditMode(false);
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          description: t('workspace.error.changeName'),
        });
      }
    }
  };

  const toggleEditMode = (state: boolean) => {
    if (!workspace) return;

    form.setValue('name', workspace.name);
    setEditMode(state);
  };

  if (!workspace) {
    return (
      <div className="flex gap-4 items-center">
        <Skeleton className="rounded-sm h-12 w-12 bg-muted font-medium text-lg" />
        <Skeleton className="w-[100px] h-4" />
      </div>
    );
  }

  if (editMode) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center rounded-sm h-12 w-12 bg-muted">
          <span className="font-bold text-xl">{workspace?.name.charAt(0)}</span>
        </div>
        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="name"
                      className="col-span-3"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <Button
          variant="default"
          onClick={form.handleSubmit(onSubmit)}
        >
          {t('general.save')}
        </Button>
        <Button
          variant="outline"
          onClick={() => toggleEditMode(false)}
        >
          {t('general.cancel')}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-4 items-center">
      <div className="flex items-center justify-center rounded-sm h-12 w-12 bg-muted">
        <span className="font-bold text-xl">{workspace?.name.charAt(0)}</span>
      </div>
      <p className="text-lg font-medium">{workspace?.name}</p>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => toggleEditMode(true)}
      >
        <Edit className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default WorkspaceName;
