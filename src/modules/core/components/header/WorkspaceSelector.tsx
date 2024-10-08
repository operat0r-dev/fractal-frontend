import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { useEffect } from 'react';
import {
  setWorkspaces,
  currentWorkspace,
} from '@/modules/workspaces/slices/workspaces';
import { useWorkspacesApi } from '@/modules/workspaces/api/WorkspacesApi';
import { ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const WorkspaceSelector = () => {
  const { workspaces } = useAppSelector((state) => state.workspaces);
  const { getUserWorkspaces, setUserWorkspace } = useWorkspacesApi();
  const { toast } = useToast();
  const { t } = useTranslation();
  const current = useAppSelector(currentWorkspace);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchWorkspaces = async () => {
      if (isMounted) {
        try {
          const response = await getUserWorkspaces();
          dispatch(setWorkspaces(response));
        } catch (error) {
          if (error instanceof Error) {
            toast({
              description: t('workspace.error.getMany'),
              variant: 'destructive',
            });
          }
        }
      }
    };

    fetchWorkspaces();

    return () => {
      isMounted = false;
    };
  }, []);

  const setCurrentWorkspace = async (id: number) => {
    try {
      await setUserWorkspace(id);
      dispatch(
        setWorkspaces(
          workspaces.map((workspace) => ({
            ...workspace,
            current: workspace.id === id,
          }))
        )
      );
      navigate(`/workspace/${id}`);
    } catch (error) {
      if (error instanceof Error) {
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
