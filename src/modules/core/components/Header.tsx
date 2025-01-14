import Account from './header/Account';
import WorkspaceSelector from './header/WorkspaceSelector';
import { useAppSelector } from '@/store/hooks';
import CreateWorkspaceDialog from './header/CreateWorkspaceDialog';
import { useState } from 'react';

const Header = () => {
  const [open, setOpen] = useState<boolean>(false);
  const user = useAppSelector((state) => state.auth.user);

  return (
    <div className="flex justify-between items-center fixed top-0 w-full h-12 border-b bg-background py-2 px-4">
      <div className="flex items-center h-full gap-4">
        <img
          src="/assets/fractal-logo.svg"
          className="h-full"
          alt=""
        />
        <nav>
          <WorkspaceSelector />
        </nav>
      </div>
      <div className="flex gap-4">
        <Account
          user={user}
          openDialog={() => setOpen(true)}
        />
      </div>
      <CreateWorkspaceDialog
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
};

export default Header;
