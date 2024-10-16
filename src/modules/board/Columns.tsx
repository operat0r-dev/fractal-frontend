import { ColumnDef } from '@tanstack/react-table';

import { ReduxLabel } from '../workspaces/types/stateTypes';
import TaskBadge from '@/components/custom/task-badge';
import { Button } from '@/components/ui/button';

export const columns: ColumnDef<ReduxLabel>[] = [
  {
    accessorKey: 'name',
    header: 'Etykieta',
    cell: ({ row }) => {
      return (
        <TaskBadge
          color={row.original.color}
          name={row.original.name}
        />
      );
    },
  },
  {
    id: 'actions',
    header: 'Akcje',
    cell: ({ row }) => {
      return (
        <Button
          size="sm"
          onClick={() => console.log(row.original.id)}
        >
          Edytuj
        </Button>
      );
    },
  },
];
