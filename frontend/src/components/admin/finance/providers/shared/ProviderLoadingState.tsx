
import { Skeleton } from '@/components/ui';

export interface ProviderLoadingStateProps {
  label?: string;
  className?: string;
}

export function ProviderLoadingState({
  label = 'Loading payment providers',
  className = 'h-8 w-full',
}: ProviderLoadingStateProps) {
  return (
    <Skeleton
      className={className}
      aria-label={label}
    />
  );
}
