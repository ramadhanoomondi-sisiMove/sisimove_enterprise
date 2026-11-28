
// src/components/admin/commissions/shared/CommissionLoadingState.tsx

import {
  Skeleton,
  Spinner,
  type SpinnerSize,
} from '@/components/ui';

export type CommissionLoadingVariant =
  | 'spinner'
  | 'skeleton';

export interface CommissionLoadingStateProps {
  readonly variant?: CommissionLoadingVariant;
  readonly message?: string;
  readonly size?: SpinnerSize;
  readonly rows?: number;
  readonly className?: string;
}

export function CommissionLoadingState({
  variant = 'spinner',
  message = 'Loading commissions...',
  size = 'lg',
  rows = 4,
  className,
}: CommissionLoadingStateProps) {
  if (variant === 'skeleton') {
    return (
      <div
        role="status"
        aria-label={message}
        aria-busy="true"
        className={[
          'flex',
          'w-full',
          'flex-col',
          'gap-4',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span className="sr-only">
          {message}
        </span>

        {Array.from(
          { length: Math.max(0, rows) },
          (_, index) => (
            <div
              key={index}
              className="flex w-full items-center gap-4"
            >
              <Skeleton className="h-10 w-10 shrink-0 rounded-full" />

              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>

              <Skeleton className="h-5 w-20" />
            </div>
          ),
        )}
      </div>
    );
  }

  return (
    <div
      className={[
        'flex',
        'w-full',
        'flex-col',
        'items-center',
        'justify-center',
        'gap-3',
        'py-12',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Spinner
        size={size}
        label={message}
      />

      <p
        role="status"
        className="text-sm text-[var(--foreground-muted)]"
      >
        {message}
      </p>
    </div>
  );
}
