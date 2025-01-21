import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import LoadingButton from '@/components/ui/loading-button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import BoardApi from '@/modules/board/api/board';
import { useAppDispatch } from '@/store/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { updateBoard } from '../../slices/boardsSlice';
import { useHandleError } from '../useError';
import { Label } from '@/components/ui/label';
import { predefinedColors } from '@/modules/board/constants/PredefinedColors';
import { Edit } from 'lucide-react';

interface EditBoardDialogProps {
  id: number;
  name: string;
  color: string;
}

const EditBoardDialog = ({ id, name, color }: EditBoardDialogProps) => {
  const [open, setOpen] = useState<boolean>();
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const formSchema = z
    .object({
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
      color,
    },
  });

  const { setError } = form;
  const { handleError } = useHandleError();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);

    BoardApi.update(id, values)
      .then((board) => {
        dispatch(updateBoard(board));
        setLoading(false);
        setOpen(false);
      })
      .catch((error) => {
        handleError<z.infer<typeof formSchema>>(error, {
          formErrorHandler: setError,
        });
        setLoading(false);
      });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          className="absolute top-2 right-2 bg-transparent shadow-none hover:bg-black/10 transition-colors duration-300"
          size="icon"
        >
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('boards.edit.title')}</DialogTitle>
          <DialogDescription>{t('boards.edit.description')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('boards.form.name')}</FormLabel>
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
                  <FormLabel>{t('boards.form.color')}</FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            {t('general.cancel')}
          </Button>
          <LoadingButton
            loading={loading}
            variant="default"
            onClick={form.handleSubmit(onSubmit)}
          >
            {t('general.submit')}
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditBoardDialog;
