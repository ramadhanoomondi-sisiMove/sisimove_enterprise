
import { cn } from '@/foundation/utils/cn';

import { JourneyCompletionPublicId } from '../shared/JourneyCompletionPublicId';
import { JourneyCompletionStatusBadge } from '../shared/JourneyCompletionStatusBadge';
import { JourneyCompletionDate } from '../shared/JourneyCompletionDate';

import type { AdminJourneyCompletionStatus } from '@/features/admin/journey-completion';

export interface JourneyCompletionIdentityPanelProps {
  publicId: string;
  status: AdminJourneyCompletionStatus;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
  className?: string;
}

export function JourneyCompletionIdentityPanel({
  publicId,
  status,
  createdAt,
  updatedAt,
  className,
}: JourneyCompletionIdentityPanelProps) {
  return (
    <section
      aria-labelledby="journey-completion-identity-heading"
      className={cn(
        'min-w-0 rounded-xl border border-[var(--border)]',
        'bg-[var(--surface)] p-5 shadow-sm',
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Journey completion
            </p>

            <h2
              id="journey-completion-identity-heading"
              className="mt-1 text-base font-semibold text-[var(--foreground)]"
            >
              Completion record
            </h2>
          </div>

          <JourneyCompletionPublicId
            publicId={publicId}
            maxLength={32}
          />
        </div>

        <div className="shrink-0">
          <JourneyCompletionStatusBadge
            status={status}
            size="md"
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 border-t border-[var(--border-subtle)] pt-4 sm:grid-cols-2">
        <div className="min-w-0 space-y-1">
          <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
            Created
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
            Last updated
          </p>

          <div className="text-sm text-[var(--foreground)]">
            <JourneyCompletionDate
              value={updatedAt}
              format="datetime"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default JourneyCompletionIdentityPanel;
