
import { cn } from '@/foundation/utils/cn';

export interface ProviderCodeProps {
  code: string;
  className?: string;
}

export function ProviderCode({
  code,
  className,
}: ProviderCodeProps) {
  return (
    <span
      className={cn('font-mono text-sm font-medium', className)}
      title={code}
    >
      {code}
    </span>
  );
}
