import { useAppSelector } from '@/store/hooks';
import { selectLabelById } from '../../../labels/slices/labelsSlice';
import TaskBadge from '../../../../components/custom/task-badge';
import { memo } from 'react';

type TaskBadgeWrapperProps = {
  labelId: number;
};

const TaskBadgeWrapper = ({ labelId }: TaskBadgeWrapperProps) => {
  const label = useAppSelector((state) => selectLabelById(state, labelId));

  return (
    <TaskBadge
      key={label.id}
      name={label.name}
      color={label.color}
    />
  );
};

export default memo(TaskBadgeWrapper);
