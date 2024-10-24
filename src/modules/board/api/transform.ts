import { BoardDto, ColumnDto } from './dto';

export const dtoToBoard = (dto: BoardDto) => {
  return {
    ...dto,
    columns: dto?.columns.map(({ id }) => id),
  };
};

export const dtoToColumns = (dto: BoardDto) => {
  return dto.columns.map((column) => {
    return { ...column, tasks: column.tasks.map(({ id }) => id) };
  });
};

export const dtoToColumn = (dto: ColumnDto) => {
  return {
    ...dto,
    tasks: dto.tasks.map(({ id }) => id),
  };
};

export const dtoToTasks = (dto: BoardDto) => {
  return dto.columns
    .map(({ tasks }) =>
      tasks.map(({ labels, user, ...task }) => ({
        ...task,
        labels: labels.map(({ id }) => id),
        user_id: user ? user.id : null,
      }))
    )
    .flat();
};
