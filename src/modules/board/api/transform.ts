import { BoardDto, ColumnDto, KanbanBoardDto } from './dto';
import { Board, Column, Task } from '../domain';

export const dtoToBoard = (dto: BoardDto): Board => {
  return dto;
};

export const dtoToColumns = (dto: KanbanBoardDto): Column[] => {
  return dto.columns.map((column) => {
    return { ...column, tasks: column.tasks.map(({ id }) => id) };
  });
};

export const dtoToColumn = (dto: ColumnDto): Column => {
  return {
    ...dto,
    tasks: dto.tasks.map(({ id }) => id),
  };
};

export const dtoToTasks = (dto: KanbanBoardDto): Task[] => {
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
