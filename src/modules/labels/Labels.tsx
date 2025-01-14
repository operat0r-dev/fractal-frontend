import { DataTable } from '@/components/custom/data-table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormLabel,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { RadioGroupItem } from '@radix-ui/react-radio-group';
import { ColumnDef } from '@tanstack/react-table';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { z } from 'zod';
import TaskBadge from '../../components/custom/task-badge';
import LabelApi from '@/modules/labels/api/label';
import { predefinedColors } from '../board/constants/PredefinedColors';
import { Label as TaskLabel } from './domain';

const formSchema = z.object({
  name: z.string(),
  color: z.string(),
  board_id: z.number(),
  label_id: z.number().nullable(),
});

const Labels = () => {
  const [labels, setLabels] = useState<TaskLabel[]>([]);
  const { board_id } = useParams();
  const [open, setOpen] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const { t } = useTranslation();
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = false;

    if (isMounted || !board_id) return;

    LabelApi.index(board_id).then((labels) => {
      setLabels(labels);
      isMounted = true;
    });

    return () => {
      isMounted = false;
    };
  }, [board_id]);

  const defaultValues = {
    name: '',
    color: predefinedColors[0].hsl,
    board_id: Number(board_id),
    label_id: null,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const [name, color] = form.watch(['name', 'color']);

  const resetToDefault = () => {
    form.reset({ ...defaultValues });
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (editMode && values.label_id) {
      await handleEdit(values);
    } else {
      await handleStore(values);
    }
  };

  const handleEdit = async (payload: z.infer<typeof formSchema>) => {
    const { label_id, ...rest } = payload;
    if (!label_id) return;

    LabelApi.update(label_id, { ...rest })
      .then(({ id, color, name }) => {
        setLabels((prevLabels) =>
          prevLabels.map((label) => {
            if (label.id === id) {
              return { ...label, color, name };
            }
            return label;
          })
        );

        closeDialog();
        setEditMode(false);
        resetToDefault();
      })
      .catch((error) => {
        if (error instanceof Error) {
          toast({
            description: t('label.error.edit'),
            variant: 'destructive',
          });
        }
      });
  };

  const handleStore = async (payload: z.infer<typeof formSchema>) => {
    LabelApi.store(payload)
      .then((label) => {
        setLabels((prevLabels) => {
          return [...prevLabels, label];
        });
        closeDialog();
        resetToDefault();
      })
      .catch((error) => {
        if (error instanceof Error) {
          toast({
            description: t('label.error.create'),
            variant: 'destructive',
          });
        }
      });
  };

  const openDialog = (payload: TaskLabel) => {
    form.reset({
      ...payload,
      label_id: payload.id,
    });
    setEditMode(true);
    setOpen(true);
  };

  const closeDialog = () => {
    setOpen(false);
    resetToDefault();
  };

  const onOpenChange = (state: boolean) => {
    setOpen(state);
    if (!state) {
      resetToDefault();
    }
  };

  const columns: ColumnDef<TaskLabel>[] = [
    {
      accessorKey: 'name',
      header: 'Etykieta',
      cell: ({ row }) => {
        return (
          <TaskBadge
            color={row.original.color}
            name={row.original.name}
          />
        );
      },
    },
    {
      id: 'actions',
      header: 'Akcje',
      cell: ({ row }) => {
        return (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => openDialog(row.original)}
          >
            {t('general.edit')}
          </Button>
        );
      },
    },
  ];

  return (
    <div className="container p-8">
      <h1 className="font-bold text-xl mb-4">{t('label.labels')}</h1>
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogTrigger asChild>
          <Button variant="secondary">{t('label.create')}</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader className="space-y-4">
            <DialogTitle>{t('label.create')}</DialogTitle>
            <TaskBadge
              className="w-min whitespace-nowrap"
              color={color}
              name={name.length ? name : t('label.preview')}
            />
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('label.form.name')} *</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kolor *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-6 place-items-center"
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
                              className="cursor-pointer flex h-8 w-16 rounded-md border-2 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                              style={{ backgroundColor: color.hsl }}
                            />
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
          <DialogFooter>
            <Button
              onClick={() => setOpen(false)}
              variant="secondary"
            >
              {t('general.cancel')}
            </Button>
            <Button onClick={form.handleSubmit(onSubmit)}>
              {t('general.submit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="mt-4">
        <DataTable
          columns={columns}
          data={labels}
        />
      </div>
    </div>
  );
};

export default Labels;
