import WorkspaceName from './components/WorkspaceName';
import WorkspaceBoards from './components/WorkspaceBoards';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { useWorkspacesApi } from './api/WorkspacesApi';
import { useParams } from 'react-router-dom';
import type { Workspace } from './types/types';

const Workspace = () => {
  const [workspace, setWorkspace] = useState<Workspace | undefined>(undefined);
  const { getWorkspace } = useWorkspacesApi();
  const { id } = useParams();

  useEffect(() => {
    const fetchWorkspace = async () => {
      if (!id) return;

      const response = await getWorkspace(id);
      setWorkspace(response);
    };

    fetchWorkspace();
  }, [id]);

  return (
    <div className="container">
      <div className="p-8">
        <WorkspaceName workspace={workspace} />
      </div>
      <Separator />
      <div className="p-8">
        <h2 className="font-bold text-xl mb-4">Boards</h2>
        <WorkspaceBoards boards={workspace?.boards} />
      </div>
    </div>
  );
};

export default Workspace;
