import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { ReduxUser } from '@/modules/users/types/stateTypes';

const usersAdapter = createEntityAdapter<ReduxUser>();

const initialState: EntityState<ReduxUser, number> =
  usersAdapter.getInitialState({});

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    updateReduxUser: (state, action: PayloadAction<ReduxUser>) => {
      const { id, name, email } = action.payload;

      const existingColumn = state.entities[id];

      if (existingColumn) {
        existingColumn.name = name;
        existingColumn.email = email;
      }
    },
    setReduxUsers: (state, action: PayloadAction<ReduxUser[]>) => {
      usersAdapter.setAll(state, action.payload);
    },
    addNewUser: (state, action: PayloadAction<ReduxUser>) => {
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
