
import { cn } from '@/foundation/utils/cn';

export interface ProviderDateProps {
  date: string;
  className?: string;
  title?: string;
}

export function ProviderDate({
  date,
  className,
  title,
}: ProviderDateProps) {
  return (
    <time
      dateTime={date}
      className={cn('text-sm text-muted-foreground', className)}
      title={title ?? date}
    >
      {date}
    </time>
  );
}
