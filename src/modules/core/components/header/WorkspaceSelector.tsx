import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useEffect } from 'react';
import {
  setReduxWorkspaces,
  selectCurrentWorkspace,
  selectAllWorkspaces,
} from '@/modules/workspaces/slices/workspacesSlice';
import WorkspaceApi from '@/modules/workspaces/api/workspace';
import { ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { switchWorkspaces } from '@/modules/workspaces/slices/workspacesSlice';
import UserApi from '@/modules/users/api/user';
import { useHandleError } from '@/modules/workspaces/components/useError';

const WorkspaceSelector = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const workspaces = useAppSelector(selectAllWorkspaces);
  const current = useAppSelector(selectCurrentWorkspace);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { handleError } = useHandleError();

  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      WorkspaceApi.getMany()
        .then((workspace) => dispatch(setReduxWorkspaces(workspace)))
        .catch((error) => handleError(error));
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const setCurrentWorkspace = async (id: number) => {
    try {
      if (!current) return;
      UserApi.setWorkspace(id).then(() => {
        dispatch(
          switchWorkspaces({
            prevWorkspaceId: current.id,
            currWorkspaceId: id,
          })
        );
        navigate(`/workspace/${id}/boards`);
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        toast({
          description: t('workspace.error.setCurrent'),
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="gap-4"
        >
          {t('workspace.title')} <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {current && (
          <>
            <DropdownMenuLabel>{t('workspace.current')}</DropdownMenuLabel>
            <DropdownMenuItem
              key={current.id}
              className="gap-4 pointer-events-none"
            >
              <div className="flex items-center justify-center rounded-sm h-10 w-10 bg-muted font-medium text-lg">
                {current.name.charAt(0)}
              </div>
              <span>{current.name}</span>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuLabel>{t('workspace.yourWorkspaces')}</DropdownMenuLabel>
        {workspaces.map((workspace) => (
          <DropdownMenuItem
            key={workspace.id}
            className="gap-4"
            onClick={() => setCurrentWorkspace(workspace.id)}
          >
            <div className="flex items-center justify-center rounded-sm h-10 w-10 bg-muted font-medium text-lg">
              {workspace.name.charAt(0)}
            </div>
            <span>{workspace.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WorkspaceSelector;
