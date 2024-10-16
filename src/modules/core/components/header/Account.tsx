import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/modules/auth/slices/auth';
import { useNavigate } from 'react-router-dom';
import { User } from '@/modules/auth/interfaces/types';
import { ExternalLink, Users } from 'lucide-react';
import { useWorkspacesApi } from '@/modules/workspaces/api/WorkspacesApi';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { setReduxWorkspaces } from '@/modules/workspaces/slices/workspacesSlice';
import { Form, FormField, FormItem, FormControl } from '@/components/ui/form';
import { useTranslation } from 'react-i18next';
import { selectAllWorkspaces } from '@/modules/workspaces/slices/workspacesSlice';

type AccountProps = {
  user: User | null;
};

const formSchema = z.object({
  name: z.string(),
});

const Account = (props: AccountProps) => {
  const [open, setOpen] = useState(false);
  const workspaces = useAppSelector(selectAllWorkspaces);
  const { createWorkspace } = useWorkspacesApi();
  const { toast } = useToast();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await createWorkspace(values);
      dispatch(setReduxWorkspaces([response, ...workspaces]));

      setOpen(false);

      toast({
        description: t('workspace.create.success'),
        variant: 'success',
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          description: t('workspace.error.create'),
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full h-8 w-8"
        >
          <span className="uppercase">{props.user?.email.charAt(0)}</span>
          <span className="sr-only">{t('accountDropdown.myAccount')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="p-4"
      >
        <DropdownMenuLabel>{t('accountDropdown.myAccount')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex gap-4 items-center mb-2">
          <div className="flex items-center justify-center rounded-full h-9 w-9 bg-muted">
            <span className="uppercase">{props.user?.email.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium">{props.user?.name}</p>
            <p className="text-sm">{props.user?.email}</p>
          </div>
        </div>
        <DropdownMenuItem
          onClick={() => navigate('/settings')}
          className="justify-between"
        >
          {t('accountDropdown.manageAccount')}
          <ExternalLink className="h-4 w-4" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            dispatch(logout());
            navigate('/login');
          }}
        >
          {t('general.logout')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-4"
          onClick={() => setOpen(true)}
        >
          <Users className="h-4 w-4" />
          {t('accountDropdown.createWorkspace')}
        </DropdownMenuItem>
      </DropdownMenuContent>

      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('workspace.create.title')}</DialogTitle>
            <DialogDescription>
              {t('workspace.create.description')}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label
                          htmlFor="name"
                          className="text-right"
                        >
                          {t('workspace.form.name')}
                        </Label>
                        <Input
                          id="name"
                          className="col-span-3"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter>
            <Button
              type="submit"
              onClick={form.handleSubmit(onSubmit)}
            >
              {t('general.submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
};

export default Account;
