import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { User } from '@/modules/users/domain/user';

const usersAdapter = createEntityAdapter<User>();

const initialState: EntityState<User, number> = usersAdapter.getInitialState(
  {}
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    updateReduxUser: (state, action: PayloadAction<User>) => {
      const { id, name, email } = action.payload;

      const existingColumn = state.entities[id];

      if (existingColumn) {
        existingColumn.name = name;
        existingColumn.email = email;
      }
    },
    setReduxUsers: (state, action: PayloadAction<User[]>) => {
      usersAdapter.setAll(state, action.payload);
    },
    addNewUser: (state, action: PayloadAction<User>) => {
      usersAdapter.addOne(state, action.payload);
    },
    resetUsers: () => initialState,
  },
});

export const { addNewUser, updateReduxUser, setReduxUsers, resetUsers } =
  usersSlice.actions;

export default usersSlice.reducer;

export const {
  selectAll: selectAllUsers,
  selectIds: selectUsersIds,
  selectById: selectUserById,
} = usersAdapter.getSelectors((state: RootState) => state.users);
