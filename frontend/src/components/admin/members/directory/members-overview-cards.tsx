
'use client';

import type { ReactNode } from 'react';

import { useMemberCounts } from '@/features/admin/members/hooks/use-member-counts';
import { useMemberPendingVerificationCount } from '@/features/admin/members/hooks/use-member-verification';

import { Button } from '@/components/ui/button';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface MembersOverviewCardsProps {
  readonly className?: string;
}

interface OverviewCardProps {
  readonly title: string;
  readonly value: unknown;
  readonly isPending: boolean;
  readonly isError: boolean;
  readonly isFetching: boolean;
  readonly onRetry: () => void;
  readonly description: string;
  readonly tone: 'positive' | 'urgent';
}

// -----------------------------------------------------------------------------
// Count Normalization
// -----------------------------------------------------------------------------

function normalizeCount(value: unknown): number | undefined {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value >= 0 ? value : undefined;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);

    return Number.isFinite(parsed) && parsed >= 0
      ? parsed
      : undefined;
  }

  if (typeof value === 'object' && value !== null) {
    const response = value as Record<string, unknown>;

    for (const key of ['count', 'total', 'totalItems', 'data']) {
      const normalized = normalizeCount(response[key]);

      if (normalized !== undefined) {
        return normalized;
      }
    }
  }

  return undefined;
}

// -----------------------------------------------------------------------------
// Overview Card
// -----------------------------------------------------------------------------

function OverviewCard({
  title,
  value,
  isPending,
  isError,
  isFetching,
  onRetry,
  description,
  tone,
}: OverviewCardProps): ReactNode {
  const count = normalizeCount(value);
  const isUrgent = tone === 'urgent';

  const cardClasses = isUrgent
    ? 'border-[var(--danger)]/30 bg-[var(--danger-soft)]'
    : 'border-[var(--success)]/25 bg-[var(--success-soft)]';

  const countClasses = isUrgent
    ? 'text-[var(--danger)]'
    : 'text-[var(--success)]';

  const iconClasses = isUrgent
    ? 'bg-[var(--danger)]/10 text-[var(--danger)]'
    : 'bg-[var(--success)]/10 text-[var(--success)]';

  return (
    <article
      className={[
        'min-w-0 rounded-[var(--radius-xl)] border p-5',
        cardClasses,
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold text-[var(--foreground)]">
              {title}
            </h2>

            {!isPending && !isError && count !== undefined && (
              <span
                className={[
                  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
                  isUrgent
                    ? 'bg-[var(--danger)]/10 text-[var(--danger)]'
                    : 'bg-[var(--success)]/10 text-[var(--success)]',
                ].join(' ')}
              >
                <span
                  aria-hidden="true"
                  className={[
                    'h-1.5 w-1.5 rounded-full',
                    isUrgent
                      ? 'bg-[var(--danger)]'
                      : 'bg-[var(--success)]',
                  ].join(' ')}
                />
                {isUrgent ? 'Action needed' : 'Growing community'}
              </span>
            )}
          </div>

          {isPending ? (
            <div
              role="status"
              aria-label={`Loading ${title.toLowerCase()}`}
              className="mt-3 h-10 w-28 animate-pulse rounded-[var(--radius-md)] bg-[var(--background-muted)]"
            />
          ) : isError ? (
            <p className="mt-3 text-sm font-medium text-[var(--danger)]">
              Count unavailable
            </p>
          ) : (
            <p
              aria-live="polite"
              className={[
                'mt-2 text-4xl font-bold tracking-tight',
                countClasses,
              ].join(' ')}
            >
              {count !== undefined ? count.toLocaleString('en-KE') : '—'}
            </p>
          )}
        </div>

        <div
          aria-hidden="true"
          className={[
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-lg)]',
            iconClasses,
          ].join(' ')}
        >
          {isUrgent ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
              <path d="M10.3 3.9 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="10" cy="7" r="4" />
              <path d="M19 8v6" />
              <path d="M22 11h-6" />
            </svg>
          )}
        </div>
      </div>

      {isError ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isFetching}
          onClick={onRetry}
          className="mt-4"
        >
          {isFetching ? 'Retrying…' : 'Retry'}
        </Button>
      ) : (
        <p className="mt-4 text-xs text-[var(--foreground-secondary)]">
          {description}
        </p>
      )}
    </article>
  );
}

// -----------------------------------------------------------------------------
// Members Overview Cards
// -----------------------------------------------------------------------------

export function MembersOverviewCards({
  className,
}: MembersOverviewCardsProps): ReactNode {
  const memberCounts = useMemberCounts();
  const pendingVerification = useMemberPendingVerificationCount();

  return (
    <section
      aria-label="Members overview"
      className={[
        'grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <OverviewCard
        title="Total members"
        value={memberCounts.data}
        isPending={memberCounts.isPending}
        isError={memberCounts.isError}
        isFetching={memberCounts.isFetching}
        onRetry={() => {
          void memberCounts.refetch();
        }}
        description="All identities reported by the Identity count endpoint."
        tone="positive"
      />

      <OverviewCard
        title="Pending verifications"
        value={pendingVerification.data}
        isPending={pendingVerification.isPending}
        isError={pendingVerification.isError}
        isFetching={pendingVerification.isFetching}
        onRetry={() => {
          void pendingVerification.refetch();
        }}
        description="Verification records awaiting review."
        tone="urgent"
      />
    </section>
  );
}

export default MembersOverviewCards;
