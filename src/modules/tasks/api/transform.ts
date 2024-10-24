import { TaskDto } from './dto';

export const dtoToTask = (dto: TaskDto) => {
  return {
    ...dto,
    label_ids: dto.labels.map(({ id }) => id),
    user_id: dto.user ? dto.user.id : null,
  };
};

export const dtoToLabels = (dto: TaskDto) => {
  return dto.labels;
};
