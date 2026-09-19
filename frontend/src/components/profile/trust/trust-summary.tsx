// -----------------------------------------------------------------------------
// sisiMove — Trust Summary
// -----------------------------------------------------------------------------
//
// Authenticated traveller Trust summary card.
//
// Presentation:
//
//   TRUST VERIFICATION        MEMBER VERIFIED
//
//   ★ 4.9                     128 ratings
//
//   Completion rate            96.5%
//   Cancellation rate           2.1%
//
//   [ Identity verified ] [ Reliable traveller ] [ Highly rated ]
//
// The component receives the already-loaded TravellerTrust model.
//
// It does not perform API calls.
//
// Architectural note:
// - TravellerTrust is the authenticated Trust model.
// - TrustSummary presents the model but does not calculate or interpret
//   Trust-domain statistics.
// - Trust status is surfaced separately from verification level because
//   verification and profile lifecycle are distinct Trust concepts.
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import type { TravellerTrust } from '@/features/trust/models/traveller-trust';

import { TrustBadgeList } from './trust-badge-list';
import { TrustStatistics } from './trust-statistics';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TrustSummaryProps {
  readonly trust: TravellerTrust;
  readonly onViewReputation?: () => void;
}

// -----------------------------------------------------------------------------
// Verification Label
// -----------------------------------------------------------------------------

function getVerificationLabel(
  level: TravellerTrust['verificationLevel'],
): string {
  switch (level) {
    case 'DRIVER':
      return 'DRIVER VERIFIED';

    case 'MEMBER':
      return 'MEMBER VERIFIED';

    case 'NONE':
    default:
      return 'NOT VERIFIED';
  }
}

// -----------------------------------------------------------------------------
// Trust Status Label
// -----------------------------------------------------------------------------

function getTrustStatusLabel(
  status: TravellerTrust['status'],
): string {
  switch (status) {
    case 'ACTIVE':
      return 'Active';

    case 'SUSPENDED':
      return 'Suspended';

    case 'REVOKED':
      return 'Revoked';

    default:
      return 'Unknown';
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustSummary({
  trust,
  onViewReputation,
}: TrustSummaryProps): ReactNode {
  return (
    <div className="rounded-xl border border-border bg-background p-6">
      {/* ---------------------------------------------------------------- */ }
      {/* Trust Header                                                     */ }
      {/* ---------------------------------------------------------------- */ }

      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-muted-foreground">
            Trust verification
          </div>

          <div className="mt-1 text-base font-semibold">
            {getVerificationLabel(trust.verificationLevel)}
          </div>
        </div>

        <span className="shrink-0 text-sm text-muted-foreground">
          {getTrustStatusLabel(trust.status)}
        </span>
      </div>

      {/* ---------------------------------------------------------------- */ }
      {/* Statistics                                                       */ }
      {/* ---------------------------------------------------------------- */ }

      <div className="mt-6">
        <TrustStatistics
          ratingAverage={trust.ratingAverage}
          ratingCount={trust.ratingCount}
          completionRate={trust.completionRate}
          cancellationRate={trust.cancellationRate}
        />
      </div>

      {/* ---------------------------------------------------------------- */ }
      {/* Badges                                                           */ }
      {/* ---------------------------------------------------------------- */ }

      {trust.badges.length > 0 ? (
        <div className="mt-6">
          <TrustBadgeList badges={trust.badges} />
        </div>
      ) : null}

      {/* ---------------------------------------------------------------- */ }
      {/* Reputation                                                       */ }
      {/* ---------------------------------------------------------------- */ }

      {onViewReputation !== undefined ? (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onViewReputation}
            className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
          >
            View reputation →
          </button>
        </div>
      ) : null}
    </div>
  );
}