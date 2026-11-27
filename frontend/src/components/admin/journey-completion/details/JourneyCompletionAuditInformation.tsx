
import type { HTMLAttributes } from 'react';
import { cn } from '@/foundation/utils/cn';
import { Card, Divider } from '@/components/ui';
import { JourneyCompletionDate } from '../shared/JourneyCompletionDate';

export interface JourneyCompletionAuditInformationProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
  version: number;
}

export default function JourneyCompletionAuditInformation({
  createdAt,
  updatedAt,
  version,
  className,
  ...props
}: JourneyCompletionAuditInformationProps) {
  return (
    <Card className={cn('space-y-4 p-5', className)} {...props}>
      <div>
        <h3 className="text-base font-semibold text-[var(--foreground)]">
          Audit Information
        </h3>
        <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
          Record metadata and version information.
        </p>
      </div>

      <Divider />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Created At
          </p>
          <div className="text-sm text-[var(--foreground)]">
            <JourneyCompletionDate
              value={createdAt}
              format="datetime"
            />
          </div>
        </div>

        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Last Updated
          </p>
          <div className="text-sm text-[var(--foreground)]">
            <JourneyCompletionDate
              value={updatedAt}
              format="datetime"
            />
          </div>
        </div>

        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Record Version
          </p>
          <p className="font-mono text-sm text-[var(--foreground)]">
            {Number.isInteger(version) && version >= 0
              ? `v${version}`
              : '—'}
          </p>
        </div>
      </div>
    </Card>
  );
}
