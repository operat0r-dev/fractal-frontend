import { Skeleton } from '@/components/ui/skeleton';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { useAppSelector } from '@/store/hooks';
import { selectAllUsers } from '../../users/slices/usersSlice';
import { selectCurrentWorkspace } from '../slices/workspacesSlice';

const Banner = () => {
  const workspace = useAppSelector(selectCurrentWorkspace);
  const users = useAppSelector(selectAllUsers);

  if (!workspace) {
    return (
      <div className="flex gap-4 items-center">
        <Skeleton className="rounded-sm h-12 w-12 bg-muted font-medium text-lg" />
        <Skeleton className="w-[100px] h-4" />
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center rounded-sm h-12 w-12 bg-muted">
          <span className="font-bold text-xl">{workspace?.name.charAt(0)}</span>
        </div>
        <div>
          <p className="text-lg font-medium">{workspace?.name}</p>
          <p className="text-sm font-light">{workspace?.description}</p>
        </div>
      </div>
      <div className="flex">
        {users.map((user, index) => (
          <HoverCard key={user.id}>
            <HoverCardTrigger>
              <div
                style={{ transform: `translate(-${index * 15}px)` }}
                className="flex items-center justify-center bg-muted h-10 w-10 rounded-full border-2 border-black"
              >
                {user.name.charAt(0)}
              </div>
            </HoverCardTrigger>
            <HoverCardContent>
              <p className="font-bold">{user.name}</p>
              <p>{user.email}</p>
            </HoverCardContent>
          </HoverCard>
        ))}
      </div>
    </div>
  );
};

export default Banner;
