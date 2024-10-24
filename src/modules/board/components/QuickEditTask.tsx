import { MultiSelect } from '@/components/custom/multi-select';
import { Label } from '@/components/ui/label';
import TaskApi from '@/modules/tasks/api/task.ts';
import { useHandleError } from '@/modules/workspaces/components/useError';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import LabelsApi from '@/modules/labels/api/label';
import {
  selectAllLabels,
  setReduxLabels,
} from '@/modules/labels/slices/labelsSlice';
import { setCurrentTask, updateTask } from '../slices/tasksSlice';
import AssigneeSelect from './AssigneeSelect';

const QuickEditTask = () => {
  const { t } = useTranslation();
  const { board_id } = useParams();
  const { handleError } = useHandleError();
  const { currentTask } = useAppSelector((state) => state.tasks);
  const labels = useAppSelector(selectAllLabels);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!board_id) return;

    LabelsApi.index(board_id).then((labels) =>
      dispatch(setReduxLabels(labels))
    );
  }, [board_id]);

  const handleLabelChange = async (payload: string[]) => {
    if (!currentTask) return;

    LabelsApi.assign(currentTask.id, {
      label_ids: payload.map((value) => Number(value)),
    })
      .then((task) => {
        dispatch(updateTask(task));
        dispatch(setCurrentTask(task.id));
      })
      .catch((error) => handleError(error));
  };

  const handleAssigneeChange = async (payload: number | null) => {
    if (!currentTask) return;

    TaskApi.assignUser(currentTask.id, {
      user_id: payload,
    })
      .then((task) => {
        dispatch(updateTask(task));
        dispatch(setCurrentTask(task.id));
      })
      .catch((error) => handleError(error));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{t('label.labels')}</Label>
        <MultiSelect
          options={labels.map((label) => {
            return {
              value: String(label.id),
              color: label.color,
              label: label.name,
            };
          })}
          shouldFilter
          onValueChange={handleLabelChange}
          defaultValue={labels
            .filter((label) => currentTask?.labels.includes(label.id))
            .map(({ id }) => String(id))
            .flat()}
          placeholder={t('label.choose')}
        />
      </div>
      <AssigneeSelect
        defaultValue={currentTask?.user_id}
        onValueChange={handleAssigneeChange}
      />
    </div>
  );
};

export default QuickEditTask;
