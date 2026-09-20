// -----------------------------------------------------------------------------
// sisiMove — Trust Section
// -----------------------------------------------------------------------------
//
// Authenticated traveller profile Trust section.
//
// Data boundary:
//
//   useMyTrust(memberPublicId)
//        ↓
//   TravellerTrust | null | undefined
//        ↓
//   TrustSummary
//        ├── TrustStatistics
//        └── TrustBadgeList
//
// The section owns Trust loading/error/empty states.
// Child components remain presentational.
//
// Architectural note:
// - memberPublicId is an opaque cross-feature identifier.
// - The section does not construct or infer Trust relationships.
// - TrustSummary receives the authenticated TravellerTrust model directly.
//
// Visual language:
// - Compact authenticated-profile section.
// - sisiMove blue accent for section identity.
// - Consistent surface treatment for transient states.
// - TrustSummary owns the detailed Trust presentation.
//
// -----------------------------------------------------------------------------

'use client';

import type { ReactNode } from 'react';

import { useMyTrust } from '@/features/trust/hooks/use-my-trust';

import { TrustSummary } from './trust-summary';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TrustSectionProps {
  readonly memberPublicId: string | undefined;
  readonly onViewReputation?: () => void;
}

// -----------------------------------------------------------------------------
// Loading State
// -----------------------------------------------------------------------------

function TrustLoadingState(): ReactNode {
  return (
    <div
      role="status"
      aria-label="Loading Trust information"
      className={[
        'overflow-hidden rounded-[var(--radius-2xl)]',
        'border border-[var(--border)]',
        'bg-[var(--surface)]',
        'p-5',
        'shadow-[var(--shadow-sm)]',
      ].join(' ')}
    >
      <div className="animate-pulse space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="h-3 w-28 rounded-full bg-[var(--background-muted)]" />
            <div className="h-5 w-36 rounded bg-[var(--background-muted)]" />
          </div>

          <div className="h-7 w-16 rounded-full bg-[var(--background-muted)]" />
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <div className="h-20 rounded-[var(--radius-lg)] bg-[var(--background-subtle)]" />
          <div className="h-20 rounded-[var(--radius-lg)] bg-[var(--background-subtle)]" />
          <div className="h-20 rounded-[var(--radius-lg)] bg-[var(--background-subtle)]" />
        </div>
      </div>

      <span className="sr-only">Loading Trust information…</span>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Informational State
// -----------------------------------------------------------------------------

function TrustMessageState({
  children,
}: {
  readonly children: ReactNode;
}): ReactNode {
  return (
    <div
      role="status"
      className={[
        'rounded-[var(--radius-2xl)]',
        'border border-[var(--border)]',
        'bg-[var(--surface)]',
        'px-5 py-5',
        'shadow-[var(--shadow-sm)]',
      ].join(' ')}
    >
      <p className="text-sm leading-6 text-[var(--foreground-muted)]">
        {children}
      </p>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustSection({
  memberPublicId,
  onViewReputation,
}: TrustSectionProps): ReactNode {
  const {
    data: trust,
    isLoading,
    isError,
  } = useMyTrust(memberPublicId);

  const hasTrust = trust !== null && trust !== undefined;

  return (
    <section className="space-y-5">
      {/* -------------------------------------------------------------------
          Section Header
          ------------------------------------------------------------------- */}

      <div className="flex items-start gap-2">
        <span
          aria-hidden="true"
          className="mt-1.5 size-2 shrink-0 rounded-full bg-[var(--brand)]"
        />

        <div className="min-w-0">
          <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--foreground)]">
            Trust &amp; Reputation
          </h2>

          <p className="mt-1.5 max-w-2xl text-sm leading-6 text-[var(--foreground-muted)]">
            Your reputation, verification status, and travel reliability on
            sisiMove.
          </p>
        </div>
      </div>

      {/* -------------------------------------------------------------------
          Loading
          ------------------------------------------------------------------- */}

      {isLoading ? <TrustLoadingState /> : null}

      {/* -------------------------------------------------------------------
          Error
          ------------------------------------------------------------------- */}

      {!isLoading && isError ? (
        <TrustMessageState>
          Trust information is temporarily unavailable. Please try again
          later.
        </TrustMessageState>
      ) : null}

      {/* -------------------------------------------------------------------
          Empty
          ------------------------------------------------------------------- */}

      {!isLoading && !isError && !hasTrust ? (
        <TrustMessageState>
          Trust information is not available yet.
        </TrustMessageState>
      ) : null}

      {/* -------------------------------------------------------------------
          Trust
          ------------------------------------------------------------------- */}

      {!isLoading && !isError && hasTrust ? (
        <TrustSummary
          trust={trust}
          onViewReputation={onViewReputation}
        />
      ) : null}
    </section>
  );
}