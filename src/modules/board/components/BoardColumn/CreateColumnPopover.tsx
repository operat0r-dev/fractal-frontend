import { Button } from '@/components/ui/button';
import {
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormControl,
  Form,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { predefinedColors } from '../../constants/PredefinedColors';
import ColumnApi from '@/modules/board/api/column';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { addNewColumn } from '../../slices/columnsSlice';
import { useHandleError } from '@/modules/workspaces/components/useError';

type props = {
  newColumnSeq: number;
};

const CreateColumnPopover = ({ newColumnSeq }: props) => {
  const { t } = useTranslation();
  const { id } = useParams<string>();
  const [open, setOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { handleError } = useHandleError();

  const formSchema = z
    .object({
      board_id: z.number(),
      name: z.string({ message: t('form.required') }),
      color: z.string(),
    })
    .superRefine(({ name }, ctx) => {
      if (!name.length) {
        ctx.addIssue({
          code: 'custom',
          message: t('form.required'),
          path: ['name'],
        });
      }
    });

  const defaultValues = {
    board_id: Number(id),
    name: '',
    color: predefinedColors[0].hsl,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { setError } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    ColumnApi.store({ ...values, seq: newColumnSeq })
      .then((column) => {
        dispatch(addNewColumn(column));
        setOpen(false);
        form.reset(defaultValues);
      })
      .catch((error) =>
        handleError(error, {
          formErrorHandler: setError,
        })
      );
  };

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-[300px]"
        >
          {t('boards.create.column')}
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('column.form.name')}</FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('column.form.color')}</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-6 gap-2"
                    >
                      {predefinedColors.map((color, index) => (
                        <div key={index}>
                          <RadioGroupItem
                            value={color.hsl}
                            id={`color-${index}`}
                            className="peer sr-only"
                          />
                          <Label
                            htmlFor={`color-${index}`}
                            className="flex h-4 w-4 rounded-md border-2 p-4 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                            style={{ backgroundColor: color.hsl }}
                          />
                        </div>
                      ))}
                    </RadioGroup>
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

export default CreateColumnPopover;
