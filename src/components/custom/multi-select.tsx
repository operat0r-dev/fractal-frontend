import * as React from 'react';
import { X, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useTranslation } from 'react-i18next';
import TaskBadge from '@/components/custom/task-badge';

/**
 * Props for MultiSelect component
 */
interface MultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * An array of option objects to be displayed in the multi-select component.
   * Each option object has a label, value, and an optional icon.
   */
  options: {
    /** The text to display for the option. */
    label: string;
    /** The unique value associated with the option. */
    value: string;
    /** Color for the bagde. */
    color?: string;
  }[];

  /**
   * Callback function triggered when the selected values change.
   * Receives an array of the new selected values.
   */
  onValueChange: (value: string[]) => void;

  /** The default selected values when the component mounts. */
  defaultValue?: string[];

  /**
   * Placeholder text to be displayed when no values are selected.
   * Optional, defaults to "Select options".
   */
  placeholder?: string;

  /**
   * The modality of the popover. When set to true, interaction with outside elements
   * will be disabled and only popover content will be visible to screen readers.
   * Optional, defaults to false.
   */
  modalPopover?: boolean;

  /**
   * Additional class names to apply custom styles to the multi-select component.
   * Optional, can be used to add custom styles.
   */
  className?: string;

  onCommandInput?: (value: string) => void;

  shouldFilter?: boolean;

  cacheOptions?: boolean;
}

export const MultiSelect = React.forwardRef<
  HTMLButtonElement,
  MultiSelectProps
>(
  (
    {
      onCommandInput,
      shouldFilter,
      cacheOptions,
      options,
      onValueChange,
      defaultValue = [],
      placeholder = 'Select options',
      modalPopover = false,
      className,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>([]);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState<boolean>(false);
    const cachedOptions = React.useRef<typeof options>([]);
    const { t } = useTranslation();

    const arraysAreEqual = (arr1: string[], arr2: string[]) => {
      if (arr1.length !== arr2.length) return false;

      return arr1.every((element) => arr2.includes(element));
    };

    React.useEffect(() => {
      if (shouldFilter && !arraysAreEqual(defaultValue, selectedValues)) {
        setSelectedValues(defaultValue);
      }
    }, [defaultValue]);

    React.useEffect(() => {
      if (!cacheOptions) return;

      const allOptions = [...cachedOptions.current, ...options];
      const uniqueOptions = allOptions.filter(
        (option, index, self) =>
          index === self.findIndex((o) => o.value === option.value)
      );

      cachedOptions.current = uniqueOptions;
    }, [options]);

    const handleInputKeyDown = (
      event: React.KeyboardEvent<HTMLInputElement>
    ) => {
      if (event.key === 'Enter') {
        setIsPopoverOpen(true);
      } else if (event.key === 'Backspace' && !event.currentTarget.value) {
        const newSelectedValues = [...selectedValues];
        newSelectedValues.pop();
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
    };

    const toggleOption = (option: string) => {
      const newSelectedValues = selectedValues.includes(option)
        ? selectedValues.filter((value) => value !== option)
        : [...selectedValues, option];
      setSelectedValues(newSelectedValues);
      onValueChange(newSelectedValues);
    };

    const handleTogglePopover = () => {
      setIsPopoverOpen((prev) => !prev);
    };

    return (
      <Popover
        open={isPopoverOpen}
        onOpenChange={setIsPopoverOpen}
        modal={modalPopover}
      >
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={handleTogglePopover}
            className={cn(
              'flex w-full p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit',
              className
            )}
          >
            {selectedValues.length > 0 ? (
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-wrap items-center">
                  {selectedValues.map((value) => {
                    const option = cacheOptions
                      ? cachedOptions.current.find((o) => o.value === value)
                      : options.find((o) => o.value === value);
                    const color = option?.color;
                    return (
                      <TaskBadge
                        className="m-1"
                        key={value}
                        color={color}
                        //@ts-ignore
                        name={option.label}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <X
                          className="ml-2 h-4 w-4 cursor-pointer"
                          onClick={() => toggleOption(value)}
                        />
                      </TaskBadge>
                    );
                  })}
                </div>
                <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
              </div>
            ) : (
              <div className="flex items-center justify-between w-full mx-auto">
                <span className="text-sm text-muted-foreground mx-3">
                  {placeholder}
                </span>
                <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 w-[--radix-popover-trigger-width]"
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command shouldFilter={shouldFilter}>
            <CommandInput
              onValueChange={(search) =>
                onCommandInput ? onCommandInput(search) : null
              }
              placeholder={t('general.search')}
              onKeyDown={handleInputKeyDown}
            />
            <CommandList className="w-full">
              <CommandEmpty>{t('general.noResults')}</CommandEmpty>
              <CommandGroup>
                {options
                  .filter((option) => !selectedValues.includes(option.value))
                  .map((option) => (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="cursor-pointer"
                    >
                      <TaskBadge
                        className="m-1"
                        color={option.color}
                        name={option.label}
                      />
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

MultiSelect.displayName = 'MultiSelect';
