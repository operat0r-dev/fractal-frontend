import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@/modules/auth/interfaces/types';
import { logout } from '@/modules/auth/slices/auth';
import { useAppDispatch } from '@/store/hooks';
import { ExternalLink, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

type AccountProps = {
  user: User | null;
  openDialog: () => void;
};

const Account = ({ user, openDialog }: AccountProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full h-8 w-8"
        >
          <span className="uppercase">{user?.email.charAt(0)}</span>
          <span className="sr-only">{t('accountDropdown.myAccount')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="p-2"
      >
        <DropdownMenuLabel>{t('accountDropdown.myAccount')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex gap-4 items-center mb-2">
          <div className="flex items-center justify-center rounded-full h-9 w-9 bg-muted">
            <span className="uppercase">{user?.email.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium">{user?.name}</p>
            <p className="text-sm">{user?.email}</p>
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
          onClick={openDialog}
        >
          <Users className="h-4 w-4" />
          {t('accountDropdown.createWorkspace')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Account;
