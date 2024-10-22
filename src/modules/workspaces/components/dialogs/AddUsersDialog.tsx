import { UserPlus } from 'lucide-react';
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
import { useWorkspacesApi } from '../../api/workspacesApi';
import { MultiSelect } from '@/components/custom/multi-select';
import { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import useUsersApi from '@/modules/users/api/usersApi';

const AddUsersDialog = () => {
  const [users, setUsers] = useState<{ value: string; label: string }[]>([]);
  const { t } = useTranslation();
  const { inviteUsers } = useWorkspacesApi();
  const { getUsers } = useUsersApi();
  const usersToInvite = useRef<number[]>([]);
  const { id } = useParams();
  const { toast } = useToast();

  const debounce = <T extends (...args: any[]) => void | Promise<void>>(
    callbackFn: T,
    time: number
  ) => {
    let timeoutId: number | null;

    const wrapper = (...args: Parameters<T>) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = window.setTimeout(() => {
        timeoutId = null;
        callbackFn(...args);
      }, time);
    };

    return wrapper;
  };

  const handleQueryInput = debounce(async (query: string) => {
    if (!query.length) {
      setUsers([]);
      return;
    }

    const response = (await getUsers(query)).map((user) => {
      return {
        value: String(user.id),
        label: user.email,
      };
    });

    setUsers(response);
  }, 500);

  const handleValueChange = (values: string[]) => {
    usersToInvite.current = values.map((value) => Number(value));
  };

  const handleSubmit = async () => {
    if (!id) return;
    try {
      await inviteUsers(id, { ids: usersToInvite.current });

      toast({
        description: t('workspace.addMembers.success'),
        variant: 'success',
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          description: t('workspace.addMembers.error'),
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          {t('workspace.addMembers.title')}{' '}
          <UserPlus className="h-4 w-4 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('workspace.addMembers.title')}</DialogTitle>
          <DialogDescription>
            {t('workspace.addMembers.description')}
          </DialogDescription>
        </DialogHeader>
        <MultiSelect
          options={users}
          shouldFilter={false}
          cacheOptions
          onValueChange={handleValueChange}
          onCommandInput={handleQueryInput}
          modalPopover
          placeholder="Wybierz użytkowników"
        />
        <DialogFooter>
          <Button
            onClick={() => handleSubmit()}
            className="inline-flex"
          >
            {t('general.submit')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUsersDialog;
