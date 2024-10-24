import { CurrentWorkspaceDto } from './dto';

export const dtoToWorkspace = (dto: CurrentWorkspaceDto) => {
  return {
    ...dto,
    boards: dto.boards.map(({ id }) => id),
    users: dto.users.map(({ id }) => id),
  };
};

export const dtoToWorkspaceBoards = (dto: CurrentWorkspaceDto) => {
  return dto.boards;
};

export const dtoToWorkspaceUsers = (dto: CurrentWorkspaceDto) => {
  return dto.users;
};
