import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch } from '@/hooks';
import { logout } from '@/modules/auth/slices/auth';
import { useNavigate } from 'react-router-dom';
import { User } from '@/modules/auth/interfaces/types';
import { ExternalLink, Users } from 'lucide-react';

type AccountProps = {
  user: User | null;
};

const Account = (props: AccountProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full h-8 w-8">
          <span className="sr-only">My account</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="p-4">
        <DropdownMenuLabel>My account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex gap-4 items-center mb-2">
          <div className="rounded-full h-9 w-9 bg-muted"></div>
          <div>
            <p className="font-medium">{props.user?.name}</p>
            <p className="text-sm">{props.user?.email}</p>
          </div>
        </div>
        <DropdownMenuItem
          onClick={() => navigate('/settings')}
          className="justify-between">
          Manage account
          <ExternalLink className="h-4 w-4" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            dispatch(logout());
            navigate('/login');
          }}>
          Logout
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="gap-4"
          onClick={() => {
            navigate('/add-workspace');
          }}>
          <Users className="h-4 w-4" />
          Create workspace
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Account;
