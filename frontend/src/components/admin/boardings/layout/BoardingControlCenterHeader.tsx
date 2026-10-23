// src/features/admin/boardings/layout/BoardingControlCenterHeader.tsx

import { Activity, ShieldCheck } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/foundation/utils/cn';

export interface BoardingControlCenterHeaderProps {
  title?: string;
  description?: string;
  lastUpdatedAt?: string | null;
  className?: string;
}

export function BoardingControlCenterHeader({
  title = 'Boarding Control Center',
  description = 'Monitor boarding operations, participants, and journey progress.',
  lastUpdatedAt,
  className,
}: BoardingControlCenterHeaderProps) {
  const formattedLastUpdated = lastUpdatedAt
    ? new Date(lastUpdatedAt).toLocaleString()
    : null;

  const validLastUpdated =
    formattedLastUpdated &&
    !Number.isNaN(Date.parse(lastUpdatedAt!));

  return (
    <header
      className={cn(
        'flex flex-col gap-5 border-b border-[var(--border)] pb-6',
        'sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
    >
      <div className="min-w-0">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--brand-soft)] text-[var(--brand)]">
            <Activity aria-hidden="true" className="h-5 w-5" />
          </span>

          <Badge variant="brand">
            <ShieldCheck
              aria-hidden="true"
              className="mr-1 inline h-3.5 w-3.5"
            />
            Admin operations
          </Badge>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
          {title}
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">
          {description}
        </p>
      </div>

      {validLastUpdated && (
        <p className="shrink-0 text-xs text-[var(--foreground-muted)]">
          Updated {formattedLastUpdated}
        </p>
      )}
    </header>
  );
}
