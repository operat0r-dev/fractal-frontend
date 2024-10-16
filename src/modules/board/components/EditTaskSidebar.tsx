import { MultiSelect } from '@/components/custom/multi-select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { setSidebarOpen } from '@/modules/board/slices/boardSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import useLabelApi from '../api/TaskLabels';
import { selectAllLabels, setReduxLabels } from '../slices/labelsSlice';
import { setCurrentTask, updateTask } from '../slices/tasksSlice';

const EditTaskSidebar = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { index, assign } = useLabelApi();
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.board);
  const labels = useAppSelector(selectAllLabels);
  const { currentTask } = useAppSelector((state) => state.tasks);

  useEffect(() => {
    const fetchLabels = async () => {
      if (!id) return;
      const response = await index(id);
      dispatch(setReduxLabels(response));
    };

    fetchLabels();
  }, [id]);

  const handleLabelChange = async (payload: string[]) => {
    if (!currentTask) return;
    try {
      const response = await assign(String(currentTask.id), {
        label_ids: payload.map((value) => Number(value)),
      });
      dispatch(updateTask(response));
      dispatch(setCurrentTask(response.id));
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: 'destructive',
          description: t('label.error.assign'),
        });
      }
    }
  };

  return (
    <div
      className={cn(
        sidebarOpen && 'translate-x-[-300px]',
        'absolute top-0 -right-[300px] w-[300px] h-full bg-black duration-300 border-l bg-background p-4'
      )}
    >
      <div className="mb-4">
        <Button
          onClick={() => dispatch(setSidebarOpen(false))}
          size="icon"
          variant="ghost"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
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
    </div>
  );
};

export default EditTaskSidebar;
