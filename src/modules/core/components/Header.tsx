import ThemeModeToggle from './header/ThemeModeToggle';
import Account from './header/Account';
import WorkspaceSelector from './header/WorkspaceSelector';
import { useAppSelector } from '@/hooks';

const Header = () => {
  const user = useAppSelector((state) => state.authData.user);

  return (
    <div className="flex gap-4 justify-end items-center fixed top-0 w-full h-12 border-b bg-background p-4">
      <nav>
        <WorkspaceSelector />
      </nav>
      <ThemeModeToggle />
      <Account user={user} />
    </div>
  );
};

export default Header;
