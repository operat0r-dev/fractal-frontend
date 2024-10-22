import AddUsersDialog from './dialogs/AddUsersDialog';
import { useAppSelector } from '@/store/hooks';
import { selectAllUsers } from '../../users/slices/usersSlice';
import { DataTable } from '@/components/custom/data-table';
import { columns } from './dataTable/Columns';

const Users = () => {
  const users = useAppSelector(selectAllUsers);

  return (
    <div>
      <h1 className="font-bold text-xl mb-4">Współpracownicy</h1>
      <AddUsersDialog />
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={users}
        />
      </div>
    </div>
  );
};

export default Users;
