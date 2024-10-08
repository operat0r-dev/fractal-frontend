import { cn } from '@/lib/utils';
import { useAppSelector } from '@/hooks';
import { useAppDispatch } from '@/hooks';
import { Button } from '@/components/ui/button';
import { setSidebarOpen } from '@/modules/board/slices/boardSlice';
import { X } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multi-select';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useLabelApi from '../api/TaskLabels';
import { useToast } from '@/hooks/use-toast';
import { setReduxLabels } from '../slices/labelsSlice';
import { selectAllLabels } from '../slices/labelsSlice';
import { updateTask, setCurrentTask } from '../slices/tasksSlice';

const EditTaskSidebar = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const { index, assign } = useLabelApi();
  const { sidebarOpen } = useAppSelector((state) => state.board);
  const labels = useAppSelector(selectAllLabels);
  const { currentTask } = useAppSelector((state) => state.tasks);
  const dispatch = useAppDispatch();
  const { toast } = useToast();

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
        'absolute top-0 -right-[300px] w-[300px] h-full bg-black duration-300 border-l bg-background p-2'
      )}
    >
      <Button
        onClick={() => dispatch(setSidebarOpen(false))}
        size="icon"
        variant="ghost"
      >
        <X className="h-4 w-4" />
      </Button>
      <MultiSelect
        options={labels.map((label) => {
          return {
            value: String(label.id),
            color: label.color,
            label: label.name,
          };
        })}
        onValueChange={handleLabelChange}
        defaultValue={labels
          .filter((label) => currentTask?.labels.includes(label.id))
          .map(({ id }) => String(id))
          .flat()}
        placeholder={t('label.choose')}
        variant="inverted"
      />
    </div>
  );
};

export default EditTaskSidebar;
