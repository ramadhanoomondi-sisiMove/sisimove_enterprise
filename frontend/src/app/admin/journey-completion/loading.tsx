
import { Skeleton } from '@/components/ui';

import { cn } from '@/foundation/utils/cn';

export interface JourneyCompletionLoadingStateProps {
  rows?: number;
  className?: string;
}

export function JourneyCompletionLoadingState({
  rows = 4,
  className,
}: JourneyCompletionLoadingStateProps) {
  const safeRows = Math.max(1, Math.floor(rows));

  return (
    <div
      role="status"
      aria-label="Loading journey completions"
      aria-busy="true"
      className={cn('w-full space-y-3', className)}
    >
      {Array.from({ length: safeRows }, (_, index) => (
        <div
          key={index}
          className={[
            'flex',
            'items-center',
            'gap-4',
            'rounded-[var(--radius-lg)]',
            'border',
            'border-[var(--border)]',
            'bg-[var(--surface)]',
            'p-4',
          ].join(' ')}
        >
          <Skeleton
            radius="full"
            className="h-10 w-10 shrink-0"
          />

          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>

          <Skeleton className="h-6 w-20 shrink-0" />
        </div>
      ))}

      <span className="sr-only">Loading records...</span>
    </div>
  );
}

export default function JourneyCompletionLoading() {
  return <JourneyCompletionLoadingState />;
}
