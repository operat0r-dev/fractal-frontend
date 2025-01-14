import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
} from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Settings, Check } from 'lucide-react';
import { useState } from 'react';
import { selectUserById } from '@/modules/users/slices/usersSlice';
import { useAppSelector } from '@/store/hooks';
import { selectAllUsers } from '@/modules/users/slices/usersSlice';
import { Button } from '@/components/ui/button';

type AssigneeSelectProps = {
  defaultValue?: number | null;
  onValueChange: (payload: number | null) => void;
};

const AssigneeSelect = ({
  defaultValue,
  onValueChange,
}: AssigneeSelectProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const selectedAssignee = useAppSelector((state) =>
    defaultValue ? selectUserById(state, defaultValue) : undefined
  );
  const users = useAppSelector(selectAllUsers);
  const { user } = useAppSelector((state) => state.auth);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Przypisany pracownik</Label>
          <PopoverTrigger asChild>
            <Settings
              className="h-4 w-4 hover:text-muted-foreground cursor-pointer"
              onClick={() => setOpen(true)}
            />
          </PopoverTrigger>
        </div>
        <PopoverAnchor asChild>
          {selectedAssignee ? (
            <div className="flex min-h-10 items-center gap-4 p-2 border rounded-md">
              <div className="text-xs flex items-center justify-center bg-muted h-6 w-6 rounded-full">
                {selectedAssignee.name.charAt(0)}
              </div>
              <p>{selectedAssignee.name}</p>
            </div>
          ) : (
            <div className="text-sm min-h-10 flex items-center px-2 py-1 border rounded-md">
              No one &nbsp; - &nbsp;
              <button
                className="underline text-[#9747FF]"
                onClick={() => onValueChange(user ? user.id : null)}
              >
                assign yourself
              </button>
            </div>
          )}
        </PopoverAnchor>
      </div>

      <PopoverContent
        className="p-1 w-[--radix-popover-trigger-width]"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex flex-col gap-1">
          {selectedAssignee && (
            <button
              className="text-[#9747FF] self-start underline px-4 py-1 text-sm"
              onClick={() => onValueChange(null)}
            >
              Clear assignee
            </button>
          )}
          {users.map((user) => (
            <Button
              key={user.id}
              size="sm"
              variant="ghost"
              className="justify-between text-sm"
              onClick={() => onValueChange(user.id)}
            >
              <div className="flex gap-2 items-center">
                <div className="text-xs flex items-center justify-center bg-muted h-6 w-6 rounded-full">
                  {user.name.charAt(0)}
                </div>
                <span>{user.name}</span>
              </div>
              {selectedAssignee?.id === user.id && (
                <Check className="h-4 w-4" />
              )}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AssigneeSelect;
