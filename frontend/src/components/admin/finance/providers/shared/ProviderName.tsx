
import { cn } from '@/foundation/utils/cn';

export interface ProviderNameProps {
  name: string;
  className?: string;
}

export function ProviderName({
  name,
  className,
}: ProviderNameProps) {
  return (
    <span
      className={cn('font-medium text-foreground', className)}
      title={name}
    >
      {name}
    </span>
  );
}
