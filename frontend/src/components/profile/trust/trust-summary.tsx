// -----------------------------------------------------------------------------
// sisiMove — Trust Summary
// -----------------------------------------------------------------------------
//
// Authenticated traveller Trust summary card.
//
// Presentation:
//
//   TRUST VERIFICATION                         MEMBER VERIFIED
//
//   ★ 4.9                                      128 ratings
//
//   Completion rate                            96.5%
//   Cancellation rate                           2.1%
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
//
// Visual language:
// - Compact sisiMove profile surface.
// - Blue accent for Trust identity.
// - Semantic status treatment.
// - Rating remains the visual focal point.
// - Statistics and badges remain delegated to their presentation components.
//
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
      return 'Driver verified';

    case 'MEMBER':
      return 'Member verified';

    case 'NONE':
    default:
      return 'Not verified';
  }
}

// -----------------------------------------------------------------------------
// Trust Status Presentation
// -----------------------------------------------------------------------------

interface TrustStatusPresentation {
  readonly label: string;
  readonly className: string;
  readonly dotClassName: string;
}

function getTrustStatusPresentation(
  status: TravellerTrust['status'],
): TrustStatusPresentation {
  switch (status) {
    case 'ACTIVE':
      return {
        label: 'Active',
        className:
          'border-[var(--success-border)] bg-[var(--success-soft)] text-[var(--success)]',
        dotClassName: 'bg-[var(--success)]',
      };

    case 'SUSPENDED':
      return {
        label: 'Suspended',
        className:
          'border-[var(--warning-border)] bg-[var(--warning-soft)] text-[var(--warning)]',
        dotClassName: 'bg-[var(--warning)]',
      };

    case 'REVOKED':
      return {
        label: 'Revoked',
        className:
          'border-[var(--danger-border)] bg-[var(--danger-soft)] text-[var(--danger)]',
        dotClassName: 'bg-[var(--danger)]',
      };

    default:
      return {
        label: 'Unknown',
        className:
          'border-[var(--border)] bg-[var(--background-subtle)] text-[var(--foreground-muted)]',
        dotClassName: 'bg-[var(--foreground-subtle)]',
      };
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TrustSummary({
  trust,
  onViewReputation,
}: TrustSummaryProps): ReactNode {
  const status = getTrustStatusPresentation(trust.status);

  return (
    <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
      {/* -------------------------------------------------------------------
          Header
          ------------------------------------------------------------------- */}

      <div className="flex flex-col gap-4 border-b border-[var(--border-subtle)] px-5 py-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-full bg-[var(--brand)]"
            />

            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--foreground-muted)]">
              Trust verification
            </p>
          </div>

          <p className="mt-1.5 text-base font-semibold text-[var(--foreground)]">
            {getVerificationLabel(trust.verificationLevel)}
          </p>
        </div>

        <span
          className={[
            'inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full',
            'border px-2.5 py-1 text-xs font-medium',
            status.className,
          ].join(' ')}
        >
          <span
            aria-hidden="true"
            className={['size-1.5 rounded-full', status.dotClassName].join(
              ' ',
            )}
          />

          {status.label}
        </span>
      </div>

      {/* -------------------------------------------------------------------
          Rating
          ------------------------------------------------------------------- */}

      <div className="px-5 py-5">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span
                aria-hidden="true"
                className="text-xl leading-none text-[var(--warning)]"
              >
                ★
              </span>

              <span className="text-3xl font-semibold tracking-tight text-[var(--foreground)]">
                {trust.ratingAverage}
              </span>
            </div>

            <p className="mt-1 text-sm text-[var(--foreground-muted)]">
              {trust.ratingCount.toLocaleString()} ratings
            </p>
          </div>
        </div>

        {/* -----------------------------------------------------------------
            Statistics
            ----------------------------------------------------------------- */}

        <div className="mt-5 border-t border-[var(--border-subtle)] pt-5">
          <TrustStatistics
            ratingAverage={trust.ratingAverage}
            ratingCount={trust.ratingCount}
            completionRate={trust.completionRate}
            cancellationRate={trust.cancellationRate}
          />
        </div>

        {/* -----------------------------------------------------------------
            Badges
            ----------------------------------------------------------------- */}

        {trust.badges.length > 0 ? (
          <div className="mt-5 border-t border-[var(--border-subtle)] pt-5">
            <TrustBadgeList badges={trust.badges} />
          </div>
        ) : null}

        {/* -----------------------------------------------------------------
            Reputation
            ----------------------------------------------------------------- */}

        {onViewReputation !== undefined ? (
          <div className="mt-5 flex justify-end border-t border-[var(--border-subtle)] pt-4">
            <button
              type="button"
              onClick={onViewReputation}
              className={[
                'inline-flex items-center gap-1 rounded-[var(--radius-md)]',
                'px-2 py-1.5 text-sm font-medium',
                'text-[var(--brand)]',
                'transition-colors',
                'hover:bg-[var(--brand-soft)] hover:text-[var(--brand-hover)]',
                'focus-visible:outline-none',
                'focus-visible:ring-2 focus-visible:ring-[var(--brand)]',
                'focus-visible:ring-offset-2',
              ].join(' ')}
            >
              View reputation
              <span aria-hidden="true">→</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}