import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Form,
  FormControl,
  FormItem,
  FormField,
  FormLabel,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import TaskApi from '@/modules/tasks/api/task';
import { SequenceIncrementor } from '@/modules/board/constants/SequenceConstants';
import { useTranslation } from 'react-i18next';
import { addNewTask, selectTaskById } from '../../slices/tasksSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { ReduxColumn } from '../../types/stateTypes';
import { addColumnTask } from '../../slices/columnsSlice';

type props = {
  column: ReduxColumn;
  taskIds: number[];
};

const formSchema = z.object({
  column_id: z.number(),
  title: z.string(),
});

const CreateTaskPopover = ({ column, taskIds }: props) => {
  const { t } = useTranslation();
  const lastTask = useAppSelector((state) =>
    selectTaskById(state, column.tasks[taskIds.length - 1])
  );
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      column_id: column.id,
      title: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    TaskApi.storeTask({
      ...values,
      seq: taskIds.length
        ? lastTask.seq + SequenceIncrementor
        : SequenceIncrementor,
    }).then((response) => {
      dispatch(addNewTask(response));
      dispatch(
        addColumnTask({ columnId: response.column_id, taskId: response.id })
      );
    });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('task.form.name')}</FormLabel>
                  <FormControl>
                    <Input
                      id="title"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              variant="default"
              onClick={form.handleSubmit(onSubmit)}
            >
              {t('general.submit')}
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};

export default CreateTaskPopover;
