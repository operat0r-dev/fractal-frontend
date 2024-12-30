import { Badge, BadgeProps } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface TaskBagdeProps extends BadgeProps {
  color?: string;
  name: string;
  icon?: React.ComponentType<{ className?: string }>;
}

const hslToHsla = (hsl: string, alpha: number) => {
  const match = hsl.match(/\d+/g);
  if (!match) return;
  
  const hslArray = match.map(Number);

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
        color: color ?? '',
        borderColor: color ?? '',
        backgroundColor: color ? hslToHsla(color, 0.2) : '',
      }}
    >
      {name}
      {children}
    </Badge>
  );
};

export default TaskBadge;
