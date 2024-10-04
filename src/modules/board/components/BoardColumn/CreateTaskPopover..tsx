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
import useBoardApi from '@/modules/board/api/api';
import { SequenceIncrementor } from '@/modules/board/constants/SequenceConstants';
import type { Task, Column } from '../../types/Board';
import { useTranslation } from 'react-i18next';

type props = {
  column: Column;
  onTaskCreate: (payload: Task) => void;
};

const formSchema = z.object({
  column_id: z.number(),
  title: z.string(),
});

const CreateTaskPopover = ({ column, onTaskCreate }: props) => {
  const { storeTask } = useBoardApi();
  const { t } = useTranslation();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      column_id: column.id,
      title: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await storeTask({
      ...values,
      seq: column.tasks.length
        ? column.tasks[column.tasks.length - 1].seq + SequenceIncrementor
        : SequenceIncrementor,
    });

    onTaskCreate(response);
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
