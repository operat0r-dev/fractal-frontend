import Account from './header/Account';
import WorkspaceSelector from './header/WorkspaceSelector';
import { useAppSelector } from '@/hooks';

const Header = () => {
  const user = useAppSelector((state) => state.authData.user);

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
        <Account user={user} />
      </div>
    </div>
  );
};

export default Header;
