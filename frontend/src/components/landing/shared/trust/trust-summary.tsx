// -----------------------------------------------------------------------------
// sisiMove — Trust Summary
// -----------------------------------------------------------------------------
//
// Composite public trust presentation component.
//
// This component presents already-resolved public trust information for a
// Traveller in a compact, reusable form.
//
// Primary trust signals:
//
//   ✓ Verification
//   ★ Rating
//   · Completed journeys
//
// Optional secondary signal:
//
//   Awarded public trust badges
//
// This component is intentionally suitable for dense public surfaces:
//
//   - Journey Marketplace Card
//   - Journey Demand Marketplace Card
//   - Traveller public profile
//
// It receives the already-resolved PublicTravellerTrust model and performs no
// API requests, reference resolution, or trust/business-rule evaluation.
//
// -----------------------------------------------------------------------------
// ARCHITECTURE BOUNDARY
// -----------------------------------------------------------------------------
//
// TrustSummary is presentation-only.
//
// The Trust domain owns the underlying trust information:
//
//   - verification level;
//   - rating average;
//   - rating count;
//   - completed journeys;
//   - awarded public badges.
//
// This component does not:
//
// - fetch Trust data;
// - calculate ratings;
// - determine verification eligibility;
// - infer trust levels;
// - calculate completed journeys;
// - decide which badges a Traveller deserves;
// - expose private trust records.
//
// It simply presents the public values supplied by the read model.
//
// -----------------------------------------------------------------------------
// MARKETPLACE PRESENTATION
// -----------------------------------------------------------------------------
//
// The compact representation is:
//
//   ✓ Verified
//   ★ 4.9 (128)
//   · 2 completed journeys
//
// Public badges, when enabled, appear beneath the primary trust signals:
//
//   [Highly verified] [Reliable traveller]
//
// The trust signals remain grouped vertically so that TrustSummary works
// naturally beneath a vertically-oriented TravellerSummary:
//
//        [avatar]
//        @traveller
//        ✓ Verified
//        ★ 4.9 (128)
//        · 2 completed journeys
//
// -----------------------------------------------------------------------------
// RESPONSIVE BEHAVIOR
// -----------------------------------------------------------------------------
//
// Marketplace cards remain horizontal on small screens.
//
// TrustSummary therefore:
//
// - uses `min-w-0`;
// - allows primary trust signals to wrap;
// - allows badge groups to wrap;
// - prevents individual badges from forcing the column wider;
// - introduces no fixed width;
// - introduces no horizontal scrolling.
//
// -----------------------------------------------------------------------------
// CSS TOKEN POLICY
// -----------------------------------------------------------------------------
//
// Use SisiMove's established design tokens:
//
//   --foreground
//   --foreground-secondary
//   --foreground-muted
//   --border
//   --background-muted
//
// VerificationBadge and RatingSummary own their respective visual details.
//
// TrustSummary only controls composition.
//
// No generic/nonexistent tokens are introduced:
//
//   --primary
//   --muted
//   --muted-foreground
//   --ring
// -----------------------------------------------------------------------------

import type {
  PublicTravellerTrust,
} from '@/features/trust/models';

import { RatingSummary } from './rating-summary';
import { VerificationBadge } from './verification-badge';


// =============================================================================
// Props
// =============================================================================

export interface TrustSummaryProps {
  /**
   * Public Traveller trust read model.
   *
   * The trust representation must already be resolved by the appropriate
   * public read boundary.
   */
  readonly trust: PublicTravellerTrust;

  /**
   * Whether to display awarded public trust badges.
   *
   * Defaults to true.
   */
  readonly showBadges?: boolean;

  /**
   * Optional additional class name.
   */
  readonly className?: string;
}


// =============================================================================
// Helpers
// =============================================================================

/**
 * Format completed journey statistics for compact public presentation.
 *
 * This value deliberately remains separate from RatingSummary because:
 *
 *     completedJourneys !== ratingCount
 *
 * They represent different public trust signals.
 *
 * Domain validation remains outside this presentation component.
 */
function formatCompletedJourneys(
  completedJourneys: number,
): string {
  if (
    !Number.isFinite(completedJourneys) ||
    completedJourneys < 0
  ) {
    return '0 completed journeys';
  }

  const count = Math.floor(
    completedJourneys,
  );

  const formattedCount = count.toLocaleString(
    'en-KE',
  );

  return `${formattedCount} completed ${
    count === 1
      ? 'journey'
      : 'journeys'
  }`;
}


// =============================================================================
// Component
// =============================================================================

/**
 * Render compact public Traveller trust information.
 *
 * TrustSummary composes existing trust presentation primitives but does not
 * own their individual visual or domain responsibilities.
 */
export function TrustSummary({
  trust,
  showBadges = true,
  className,
}: TrustSummaryProps) {
  const completedJourneys =
    formatCompletedJourneys(
      trust.completedJourneys,
    );

  return (
    <div
      className={[
        // -------------------------------------------------------------------
        // Root
        // -------------------------------------------------------------------
        //
        // TrustSummary is intentionally a vertical group. This makes it
        // compose naturally below TravellerSummary when the provider card
        // uses vertical Traveller presentation.
        //
        'flex',
        'min-w-0',
        'flex-col',
        'gap-1.5',

        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Primary trust signals                                               */}
      {/* ------------------------------------------------------------------- */}
      {/*
        The individual trust signals remain inline where space permits and
        wrap naturally when the provider column becomes narrow.
        
        TrustSummary does not force the marketplace card to grow horizontally.
      */}
      <div
        className={[
          'flex',
          'min-w-0',
          'flex-wrap',
          'items-center',
          'gap-x-2',
          'gap-y-1',
        ].join(' ')}
      >
        {/* ----------------------------------------------------------------- */}
        {/* Verification                                                       */}
        {/* ----------------------------------------------------------------- */}
        <VerificationBadge
          verificationLevel={
            trust.verificationLevel
          }
        />

        {/* ----------------------------------------------------------------- */}
        {/* Rating                                                             */}
        {/* ----------------------------------------------------------------- */}
        <RatingSummary
          ratingAverage={
            trust.ratingAverage
          }
          ratingCount={
            trust.ratingCount
          }
        />

        {/* ----------------------------------------------------------------- */}
        {/* Completed journeys                                                 */}
        {/* ----------------------------------------------------------------- */}
        <span
          className={[
            'inline-flex',
            'min-w-0',
            'max-w-full',
            'items-center',

            'text-xs',
            'leading-5',
            'text-[var(--foreground-muted)]',
          ].join(' ')}
          aria-label={completedJourneys}
        >
          <span
            aria-hidden="true"
            className="shrink-0"
          >
            ·
          </span>

          <span className="ml-1 truncate">
            {completedJourneys}
          </span>
        </span>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Public trust badges                                                 */}
      {/* ------------------------------------------------------------------- */}
      {showBadges &&
      trust.badges.length > 0 ? (
        <div
          className={[
            'flex',
            'min-w-0',
            'max-w-full',
            'flex-wrap',
            'gap-1.5',
          ].join(' ')}
          aria-label="Public trust badges"
        >
          {trust.badges.map((badge) => (
            <span
              key={badge.publicId}
              title={
                badge.description ??
                badge.name
              }
              className={[
                'inline-flex',
                'min-w-0',
                'max-w-full',
                'items-center',

                'rounded-full',
                'border',
                'border-[var(--border)]',

                'bg-[var(--background-muted)]',

                'px-2',
                'py-0.5',

                'text-[11px]',
                'font-medium',
                'leading-4',
                'text-[var(--foreground-secondary)]',
              ].join(' ')}
            >
              <span className="truncate">
                {badge.name}
              </span>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}