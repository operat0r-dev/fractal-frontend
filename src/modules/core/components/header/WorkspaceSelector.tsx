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
  userWorkspaces,
  currentWorkspace,
} from '@/modules/workspaces/slices/workspaces';
import { useWorkspacesApi } from '@/modules/workspaces/api/WorkspacesApi';
import { ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const WorkspaceSelector = () => {
  const { workspaces } = useAppSelector((state) => state.workspaces);
  const { getUserWorkspaces, setUserWorkspace } = useWorkspacesApi();
  const { toast } = useToast();
  const otherWorkspaces = useAppSelector(userWorkspaces);
  const current = useAppSelector(currentWorkspace);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkspaces = async () => {
      const response = await getUserWorkspaces();
      dispatch(setWorkspaces(response));
    };

    fetchWorkspaces();
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
      toast({
        description: 'An error occured when setting current workspace',
        variant: 'success',
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="gap-4">
          Workspaces <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {current && (
          <>
            <DropdownMenuLabel>Current workspace</DropdownMenuLabel>
            <DropdownMenuItem
              key={current.id}
              className="gap-4 pointer-events-none">
              <div className="flex items-center justify-center rounded-sm h-10 w-10 bg-muted font-medium text-lg">
                {current.name.charAt(0)}
              </div>
              <span>{current.name}</span>
            </DropdownMenuItem>
          </>
        )}
        {otherWorkspaces.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Your workspaces</DropdownMenuLabel>
            {otherWorkspaces.map((workspace) => (
              <DropdownMenuItem
                key={workspace.id}
                className="gap-4"
                onClick={() => setCurrentWorkspace(workspace.id)}>
                <div className="flex items-center justify-center rounded-sm h-10 w-10 bg-muted font-medium text-lg">
                  {workspace.name.charAt(0)}
                </div>
                <span>{workspace.name}</span>
              </DropdownMenuItem>
            ))}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default WorkspaceSelector;
