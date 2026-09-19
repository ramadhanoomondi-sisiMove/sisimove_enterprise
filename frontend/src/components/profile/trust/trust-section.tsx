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
    <section className="space-y-4">
      {/* ------------------------------------------------------------------ */}
      {/* Section Header                                                     */}
      {/* ------------------------------------------------------------------ */}

      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide">
          Trust &amp; Reputation
        </h2>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Loading                                                            */}
      {/* ------------------------------------------------------------------ */}

      {isLoading ? (
        <div className="rounded-xl border border-border bg-background p-6">
          <div className="text-sm text-muted-foreground">
            Loading Trust information…
          </div>
        </div>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Error                                                              */}
      {/* ------------------------------------------------------------------ */}

      {!isLoading && isError ? (
        <div className="rounded-xl border border-border bg-background p-6">
          <div className="text-sm text-muted-foreground">
            Trust information is temporarily unavailable.
          </div>
        </div>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Empty                                                              */}
      {/* ------------------------------------------------------------------ */}

      {!isLoading && !isError && !hasTrust ? (
        <div className="rounded-xl border border-border bg-background p-6">
          <div className="text-sm text-muted-foreground">
            Trust information is not available yet.
          </div>
        </div>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Trust                                                              */}
      {/* ------------------------------------------------------------------ */}

      {!isLoading && !isError && hasTrust ? (
        <TrustSummary
          trust={trust}
          onViewReputation={onViewReputation}
        />
      ) : null}
    </section>
  );
}