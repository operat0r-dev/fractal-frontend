import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import ColumnApi from '../../api/column';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronRight, EllipsisVertical, Files, Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { predefinedColors } from '../../constants/PredefinedColors';
import { Column } from '../../domain';
import CreateTaskPopover from './CreateTaskPopover.';
import { useAppDispatch } from '@/store/hooks';
import { updateReduxColumn } from '../../slices/columnsSlice';

type props = {
  collapsed: boolean;
  column: Column;
  taskIds: number[];
  onCollapsedChange: () => void;
};

const columnNameFormSchema = z.object({
  name: z.string(),
});

const ControlPanel = ({
  collapsed,
  column,
  onCollapsedChange,
  taskIds,
}: props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const columnNameForm = useForm<z.infer<typeof columnNameFormSchema>>({
    resolver: zodResolver(columnNameFormSchema),
    defaultValues: {
      name: column.name,
    },
  });

  const onColumnNameFormSubmit = async (
    values: z.infer<typeof columnNameFormSchema>
  ) => {
    if (!values.name.length) {
      columnNameForm.setValue('name', column.name);
    }
    ColumnApi.update(column.id, values).then((column) =>
      dispatch(updateReduxColumn(column))
    );
  };

  const handleColorChange = async (color: string) => {
    ColumnApi.update(column.id, { color }).then((column) =>
      dispatch(updateReduxColumn(column))
    );
  };

  return (
    <div
      className={cn(
        collapsed ? 'flex-col gap-4' : 'flex-row',
        'p-2 gap-2 flex items-center justify-between border-t-4 rounded-t bg-background'
      )}
      style={{ borderTopColor: column.color }}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={onCollapsedChange}
        className="flex-shrink-0"
      >
        <ChevronRight
          className={cn(collapsed && 'rotate-180', 'h-4 w-4 duration-200')}
        />
      </Button>
      {collapsed ? (
        <div className="flex flex-col items-center gap-2">
          <div
            className="text-center"
            style={{ color: column.color }}
          >
            <Files className="h-4 w-4" />
            <span className="font-medium text-sm">{taskIds.length}</span>
          </div>
          <p className="font-medium text-sm text-sideways">{column.name}</p>
        </div>
      ) : (
        <Form {...columnNameForm}>
          <form>
            <FormField
              control={columnNameForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="name"
                      className="border-none font-medium"
                      {...field}
                      onBlur={columnNameForm.handleSubmit(
                        onColumnNameFormSubmit
                      )}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      )}
      <div className={cn(collapsed ? 'hidden' : 'flex gap-2 items-center')}>
        <div
          className="inline-flex items-center"
          style={{ color: column.color }}
        >
          <Files className="h-4 w-4" />
          <span className="font-medium text-sm">{taskIds.length}</span>
        </div>
        <CreateTaskPopover
          column={column}
          taskIds={taskIds}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
            >
              <EllipsisVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span>{t('column.changeColor')}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <RadioGroup
                    onValueChange={handleColorChange}
                    defaultValue={column.color}
                    className="grid grid-cols-6 gap-2 p-4"
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
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem>
              <Trash className="h-4 w-4 mr-2" />
              <span>{t('column.delete')}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ControlPanel;
