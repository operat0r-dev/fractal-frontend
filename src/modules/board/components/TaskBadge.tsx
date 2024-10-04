import { Badge, BadgeProps } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TaskBagdeProps extends BadgeProps {
  color: string;
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const hslToHsla = (hsl: string, alpha: number) => {
  const hslArray = hsl.match(/\d+/g).map(Number);

  return `hsla(${hslArray[0]}, ${hslArray[1]}%, ${hslArray[2]}%, ${alpha})`;
};

const TaskBadge = ({
  color,
  name,
  className,
  children,
  ...props
}: TaskBagdeProps) => {
  return (
    <Badge
      {...props}
      className={cn('font-medium text-xs rounded-full', className)}
      style={{
        color,
        borderColor: color,
        backgroundColor: hslToHsla(color, 0.2),
      }}
    >
      {name}
      {children}
    </Badge>
  );
};

export default TaskBadge;
