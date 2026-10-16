// -----------------------------------------------------------------------------
// sisiMove — Admin Member Trust Panel
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Display a member's trust-profile information.
// - Present trust status and verification level separately.
// - Show an optional trust score only when supplied by the backend mapping.
// - Handle loading, error, and empty states.
//
// Non-responsibilities:
// - Fetching trust profiles or trust events.
// - Calculating trust scores.
// - Inferring trust status from Identity or Verification status.
// - Changing trust-profile state.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import {
  MemberTrustIndicator,
  type MemberTrustStatus,
} from '@/components/admin/members/primitives/member-trust-indicator';

import { MemberDataSection } from '@/components/admin/members/primitives/member-data-section';
import { Button } from '@/components/ui/button';
import { cn } from '@/foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MemberTrustPanelData {
  readonly status: MemberTrustStatus;
  readonly verificationLevel?: string | null;
  readonly trustScore?: number | null;
  readonly lastEvaluatedAt?: string | null;
  readonly reason?: string | null;
  readonly notes?: string | null;
}

export interface MemberTrustPanelProps {
  readonly trust: MemberTrustPanelData | null;
  readonly isLoading?: boolean;
  readonly error?: string | null;
  readonly onRetry?: () => void;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatTimestamp(value?: string | null): string {
  if (!value?.trim()) {
    return 'Not recorded';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Unavailable';
  }

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function TrustField({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string;
}): ReactNode {
  return (
    <div className="min-w-0 space-y-1">
      <dt className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
        {label}
      </dt>

      <dd className="break-words text-sm text-[var(--foreground)]">
        {value}
      </dd>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Loading State
// -----------------------------------------------------------------------------

function TrustLoadingState(): ReactNode {
  return (
    <div
      className="space-y-4"
      role="status"
      aria-label="Loading member trust information"
    >
      <div className="flex items-center gap-3">
        <div className="size-9 animate-pulse rounded-full bg-[var(--background-muted)]" />

        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-[var(--background-muted)]" />
          <div className="h-3 w-24 animate-pulse rounded bg-[var(--background-muted)]" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="space-y-2"
          >
            <div className="h-3 w-24 animate-pulse rounded bg-[var(--background-muted)]" />
            <div className="h-4 w-36 animate-pulse rounded bg-[var(--background-muted)]" />
          </div>
        ))}
      </div>

      <span className="sr-only">Loading member trust information…</span>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function MemberTrustPanel({
  trust,
  isLoading = false,
  error,
  onRetry,
  className,
}: MemberTrustPanelProps): ReactNode {
  return (
    <MemberDataSection
      title="Trust"
      description="Trust-profile status and available evaluation information."
      className={className}
    >
      {isLoading ? (
        <TrustLoadingState />
      ) : error ? (
        <div
          role="alert"
          className="rounded-[var(--radius-lg)] border border-[var(--danger)]/25 bg-[var(--danger-soft)] p-4"
        >
          <p className="text-sm font-medium text-[var(--foreground)]">
            Trust information could not be loaded.
          </p>

          <p className="mt-1 break-words text-sm text-[var(--foreground-secondary)]">
            {error}
          </p>

          {onRetry ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-3"
            >
              Try again
            </Button>
          ) : null}
        </div>
      ) : !trust ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--border)] px-4 py-8 text-center">
          <p className="text-sm font-medium text-[var(--foreground)]">
            No trust profile available
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
            Trust information has not been supplied for this member.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--foreground)]">
                Trust profile status
              </p>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                This status is independent of the member's account status.
              </p>
            </div>

            <MemberTrustIndicator
              status={trust.status}
              verificationLevel={trust.verificationLevel}
              size="sm"
            />
          </div>

          <dl
            className={cn(
              'grid grid-cols-1 gap-x-6 gap-y-5',
              'sm:grid-cols-2',
            )}
          >
            <TrustField
              label="Trust verification level"
              value={trust.verificationLevel?.trim() || 'Not recorded'}
            />

            <TrustField
              label="Last evaluated"
              value={formatTimestamp(trust.lastEvaluatedAt)}
            />

            {typeof trust.trustScore === 'number' &&
            Number.isFinite(trust.trustScore) ? (
              <TrustField
                label="Trust score"
                value={String(trust.trustScore)}
              />
            ) : null}

            <TrustField
              label="Trust reason"
              value={trust.reason?.trim() || 'Not recorded'}
            />
          </dl>

          {trust.notes?.trim() ? (
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] p-4">
              <h3 className="text-sm font-semibold text-[var(--foreground)]">
                Notes
              </h3>

              <p className="mt-2 whitespace-pre-line break-words text-sm text-[var(--foreground-secondary)]">
                {trust.notes.trim()}
              </p>
            </div>
          ) : null}
        </div>
      )}
    </MemberDataSection>
  );
}

export default MemberTrustPanel;
