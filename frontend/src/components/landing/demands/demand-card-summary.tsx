// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Marketplace Summary
// -----------------------------------------------------------------------------
//
// Compact marketplace summary for a public Journey Demand.
//
// The summary communicates the information that matters when browsing demand:
//
//     - seats still looking for supply
//     - total requested seats
//     - matched seats
//     - active participants
//     - price expectation
//     - lifecycle state
//
// This is intentionally NOT a generic "details" component.
//
// A marketplace card should remain scannable. Detailed Demand information
// belongs on the Demand detail page.
//
// PRESENTATION BOUNDARY
// ---------------------
//
// This component:
//
// - renders supplied public Demand read-model values;
// - counts active participants for display;
// - formats price values;
// - formats the public lifecycle label.
//
// This component does NOT:
//
// - fetch data;
// - determine matching;
// - determine booking eligibility;
// - perform state transitions;
// - mutate Demand state;
// - decide whether a Demand is joinable.
//
// The parent DemandMarketplaceCard owns the horizontal marketplace column
// allocation. This component owns only the summary content inside that
// allocation.
//
// -----------------------------------------------------------------------------

import type {
  PublicJourneyDemandCapacity,
  PublicJourneyDemandParticipant,
  PublicJourneyDemandPricing,
  PublicJourneyDemandStatus,
} from '@/features/journey-demands/models';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface DemandCardSummaryProps {
  /**
   * Public Demand capacity representation.
   */
  readonly capacity: PublicJourneyDemandCapacity;

  /**
   * Public Demand pricing representation.
   */
  readonly pricing: PublicJourneyDemandPricing;

  /**
   * Public Demand participants.
   */
  readonly participants: readonly PublicJourneyDemandParticipant[];

  /**
   * Public Demand lifecycle state.
   */
  readonly status: PublicJourneyDemandStatus;

  /**
   * Optional presentation class.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatPrice(
  amount: number | null,
  currency: string,
): string | null {
  if (amount === null) {
    return null;
  }

  return `${currency} ${amount.toLocaleString('en-KE')}`;
}

function getStatusLabel(
  status: PublicJourneyDemandStatus,
): string {
  switch (status) {
    case 'OPEN':
      return 'Open';

    case 'MATCHED':
      return 'Matched';

    case 'CONVERTED':
      return 'Converted';

    case 'FULFILLED':
      return 'Fulfilled';

    default:
      return status;
  }
}

function getStatusClassName(
  status: PublicJourneyDemandStatus,
): string {
  switch (status) {
    case 'OPEN':
      return [
        'border',
        'border-[var(--brand)]',
        'bg-[var(--brand-soft)]',
        'text-[var(--brand)]',
      ].join(' ');

    case 'MATCHED':
      return [
        'border',
        'border-[var(--border-strong)]',
        'bg-[var(--background-muted)]',
        'text-[var(--foreground-secondary)]',
      ].join(' ');

    case 'CONVERTED':
    case 'FULFILLED':
      return [
        'border',
        'border-[var(--border-strong)]',
        'bg-[var(--background-subtle)]',
        'text-[var(--foreground-muted)]',
      ].join(' ');

    default:
      return [
        'border',
        'border-[var(--border)]',
        'bg-[var(--background-subtle)]',
        'text-[var(--foreground-secondary)]',
      ].join(' ');
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function DemandCardSummary({
  capacity,
  pricing,
  participants,
  status,
  className,
}: DemandCardSummaryProps) {
  // ---------------------------------------------------------------------------
  // Active participant count
  // ---------------------------------------------------------------------------
  //
  // Participant status is already supplied by the public Demand read model.
  // Counting ACTIVE participants here is presentation-level aggregation only;
  // it does not change or interpret the Demand lifecycle.
  // ---------------------------------------------------------------------------

  const activeParticipantCount = participants.filter(
    (participant) => participant.status === 'ACTIVE',
  ).length;

  // ---------------------------------------------------------------------------
  // Price presentation
  // ---------------------------------------------------------------------------

  const preferredPrice = formatPrice(
    pricing.preferredPricePerSeat,
    pricing.currency,
  );

  const maximumPrice = formatPrice(
    pricing.maximumPricePerSeat,
    pricing.currency,
  );

  const priceLabel = preferredPrice
    ? `${preferredPrice} preferred`
    : maximumPrice
      ? `Up to ${maximumPrice}`
      : null;

  return (
    <div
      className={[
        // -------------------------------------------------------------------
        // Summary content boundary
        // -------------------------------------------------------------------
        //
        // The parent DemandMarketplaceCard controls the horizontal column
        // allocation and outer responsive section padding.
        //
        // Do not add flex-1, min-width values, or marketplace-level padding
        // here.
        //
        'flex',
        'min-w-0',
        'flex-col',
        'justify-center',
        'overflow-hidden',

        // -------------------------------------------------------------------
        // Internal proportional density
        // -------------------------------------------------------------------
        //
        // The summary contains several information groups, so its internal
        // spacing is slightly larger than the Route column while still
        // contracting on smaller screens.
        //
        'gap-1.5',
        'sm:gap-2',
        'md:gap-2.5',

        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Remaining requirement                                              */}
      {/* ------------------------------------------------------------------ */}

      <div className="min-w-0">
        <p
          className={[
            'text-[9px]',
            'sm:text-[10px]',
            'md:text-xs',
            'font-medium',
            'uppercase',
            'tracking-wide',
            'leading-tight',
            'text-[var(--foreground-muted)]',
          ].join(' ')}
        >
          Looking for
        </p>

        <p
          className={[
            'mt-0.5',
            'truncate',
            'text-[11px]',
            'sm:text-xs',
            'md:text-sm',
            'font-semibold',
            'leading-tight',
            'text-[var(--foreground)]',
          ].join(' ')}
        >
          {capacity.remainingSeats}{' '}
          {capacity.remainingSeats === 1 ? 'seat' : 'seats'} still needed
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Capacity facts                                                     */}
      {/* ------------------------------------------------------------------ */}

      <div
        className={[
          'flex',
          'min-w-0',
          'flex-wrap',
          'items-center',
          'gap-x-1',
          'sm:gap-x-1.5',
          'md:gap-x-2',
          'gap-y-0.5',
          'text-[9px]',
          'sm:text-[10px]',
          'md:text-xs',
          'leading-tight',
          'text-[var(--foreground-secondary)]',
        ].join(' ')}
      >
        <span className="truncate">
          {capacity.requestedSeats}{' '}
          {capacity.requestedSeats === 1 ? 'seat' : 'seats'} requested
        </span>

        <span
          aria-hidden="true"
          className="shrink-0 text-[var(--foreground-subtle)]"
        >
          ·
        </span>

        <span className="truncate">
          {capacity.matchedSeats} matched
        </span>

        {activeParticipantCount > 0 && (
          <>
            <span
              aria-hidden="true"
              className="shrink-0 text-[var(--foreground-subtle)]"
            >
              ·
            </span>

            <span className="truncate">
              {activeParticipantCount}{' '}
              {activeParticipantCount === 1
                ? 'participant'
                : 'participants'}
            </span>
          </>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Price expectation                                                  */}
      {/* ------------------------------------------------------------------ */}

      {priceLabel && (
        <div className="min-w-0">
          <p
            className={[
              'text-[9px]',
              'sm:text-[10px]',
              'md:text-xs',
              'leading-tight',
              'text-[var(--foreground-muted)]',
            ].join(' ')}
          >
            Price expectation
          </p>

          <p
            className={[
              'mt-0.5',
              'truncate',
              'text-[11px]',
              'sm:text-xs',
              'md:text-sm',
              'font-semibold',
              'leading-tight',
              'text-[var(--foreground)]',
            ].join(' ')}
            title={priceLabel}
          >
            {priceLabel}
          </p>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Public lifecycle state                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="min-w-0">
        <span
          className={[
            'inline-flex',
            'max-w-full',
            'items-center',
            'rounded-full',

            // ---------------------------------------------------------------
            // Responsive badge density
            // ---------------------------------------------------------------

            'px-1.5',
            'py-0.5',
            'sm:px-2',
            'sm:py-0.5',
            'md:px-2.5',
            'md:py-1',

            // ---------------------------------------------------------------
            // Responsive typography
            // ---------------------------------------------------------------

            'text-[9px]',
            'sm:text-[10px]',
            'md:text-xs',
            'font-medium',
            'leading-tight',

            getStatusClassName(status),
          ].join(' ')}
        >
          {getStatusLabel(status)}
        </span>
      </div>
    </div>
  );
}