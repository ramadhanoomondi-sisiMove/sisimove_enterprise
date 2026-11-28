import type { ReactNode } from 'react';

export interface CommissionDirectoryHeaderProps {
  readonly title?: string;
  readonly description?: string;
  readonly actions?: ReactNode;
  readonly className?: string;
}

export function CommissionDirectoryHeader({
  title = 'Commission Directory',
  description = 'View and manage booking and earning commissions.',
  actions,
  className,
}: CommissionDirectoryHeaderProps) {
  return (
    <header
      className={[
        'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="min-w-0 space-y-1">
        <h1 className="text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl">
          {title}
        </h1>

        <p className="max-w-2xl text-sm text-[var(--foreground-secondary)]">
          {description}
        </p>
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {actions}
        </div>
      )}
    </header>
  );
}