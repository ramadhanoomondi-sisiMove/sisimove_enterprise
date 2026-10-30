
import { cn } from '@/foundation/utils/cn';

export interface ProviderPublicIdProps {
  publicId: string;
  className?: string;
}

export function ProviderPublicId({
  publicId,
  className,
}: ProviderPublicIdProps) {
  return (
    <span
      className={cn('font-mono text-sm text-muted-foreground', className)}
      title={publicId}
    >
      {publicId}
    </span>
  );
}
