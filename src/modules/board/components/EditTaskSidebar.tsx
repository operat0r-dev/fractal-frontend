import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/hooks';
import { useAppDispatch } from '@/hooks';
import { Button } from '@/components/ui/button';
import { setSidebarOpen } from '@/modules/board/slices/boardSlice';
import { X } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multi-select';
import { Cat, Dog, Rabbit, Turtle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const frameworksList = [
  { value: 'react', label: 'React', icon: Turtle, color: 'hsl(200, 90%, 66%)' },
  { value: 'angular', label: 'Angular', icon: Cat, color: 'hsl(0, 90%, 66%)' },
  { value: 'vue', label: 'Vue', icon: Dog, color: 'hsl(140, 90%, 66%)' },
  {
    value: 'svelte',
    label: 'Svelte',
    icon: Rabbit,
    color: 'hsl(30, 90%, 66%)',
  },
];

const EditTaskSidebar = () => {
  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([
    'react',
    'angular',
  ]);
  const { t } = useTranslation();
  const open = useAppSelector((state) => state.board.sidebarOpen);
  const dispatch = useAppDispatch();

  return (
    <div
      className={cn(
        open && 'translate-x-[-300px]',
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
        options={frameworksList}
        onValueChange={setSelectedFrameworks}
        defaultValue={selectedFrameworks}
        placeholder={t('label.choose')}
        variant="inverted"
      />
    </div>
  );
};

export default EditTaskSidebar;
