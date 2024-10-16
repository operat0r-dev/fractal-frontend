import { buttonVariants } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { NavLink, useParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import EditWorkspaceDialog from './dialogs/EditWorkspaceDialog';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentWorkspace } from '../slices/workspacesSlice';

const Navigation = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const workspace = useAppSelector(selectCurrentWorkspace);

  const links = [
    {
      label: t('workspace.navigation.boards'),
      route: `/workspace/${id}/boards`,
    },
    {
      label: t('workspace.navigation.members'),
      route: `/workspace/${id}/users`,
      icon: UserPlus,
    },
  ];

  return (
    <div className="max-w-[300px] border-r p-2">
      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center rounded-sm h-12 w-12 bg-muted">
            <span className="font-bold text-xl">
              {workspace?.name.charAt(0)}
            </span>
          </div>
          <p className="text-lg font-medium">{workspace?.name}</p>
        </div>
        <EditWorkspaceDialog />
      </div>
      <Separator className="my-4" />
      <div className="space-y-2">
        {links.map((link, index) => (
          <NavLink
            key={index}
            to={link.route}
            className={({ isActive }) =>
              cn(
                buttonVariants({ variant: isActive ? 'secondary' : 'ghost' }),
                'w-full justify-between'
              )
            }
          >
            {link.label}
            {link.icon ? <link.icon className="h-4 w-4 ml-4" /> : null}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
