// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Card Price
// -----------------------------------------------------------------------------
//
// Compact presentation component for the PRICE / SEATS section of a public
// Journey marketplace listing.
//
// MARKETPLACE ROLE
// ----------------
//
// The Journey marketplace row communicates:
//
//   WHEN → WHO → WHERE → VEHICLE → PRICE/SEATS → ACTIONS
//                                      ↑
//                                   this block
//
// This component owns only:
//
//   PRICE / SEATS
//
// Intended presentation:
//
//   Ksh 2,200
//   per seat
//   4 available
//   0 of 4 booked
//
// This is a marketplace summary, not a financial-detail component.
//
// PRESENTATION BOUNDARY
// ---------------------
//
// This component is presentation-only.
//
// It does not:
//
// - determine whether a Journey is bookable;
// - determine booking eligibility;
// - calculate booking totals;
// - calculate commission;
// - calculate fees;
// - calculate Journey revenue;
// - perform currency conversion;
// - fetch Financial or Commercial data;
// - construct booking URLs;
// - mutate Journey capacity;
// - infer business state from seat counts.
//
// The parent supplies the authoritative public Journey read-model values.
//
// MONEY BOUNDARY
// -------------
//
// `amount` is interpreted according to the PublicJourney monetary contract.
//
// This component deliberately does NOT invent a minor-unit convention.
//
// If the public API exposes:
//
//   amount = 2200
//
// for:
//
//   KES 2,200
//
// the formatter displays that public amount directly.
//
// This component never performs currency conversion.
//
// RESPONSIVE MARKETPLACE DENSITY
// ------------------------------
//
// The parent JourneyMarketplaceCard owns:
//
// - the price column width;
// - marketplace column padding;
// - column separators;
// - marketplace row geometry.
//
// This component therefore deliberately does NOT:
//
// - define a fixed marketplace column width;
// - use shrink-0 for the marketplace column;
// - add marketplace-level horizontal padding;
// - add marketplace-level vertical padding.
//
// The important responsive rule is:
//
//   PRICE = atomic / never truncated
//
//   SUPPORTING TEXT = allowed to contract
//
// The price must never disappear character-by-character as the viewport
// becomes narrower. Typography contracts at responsive breakpoints instead.
//
// DESIGN-SYSTEM BOUNDARY
// ----------------------
//
// Uses only sisiMove global design tokens:
//
//   --brand
//   --foreground
//   --foreground-secondary
//   --foreground-muted
//   --foreground-subtle
//
// No generic or nonexistent tokens are introduced.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCardPriceProps {
  /**
   * Price per seat from the public Journey read model.
   *
   * The unit must follow the PublicJourney API contract.
   */
  readonly amount: number;

  /**
   * ISO 4217 currency code.
   *
   * Example:
   *
   *   "KES"
   */
  readonly currency: string;

  /**
   * Number of seats currently available.
   */
  readonly availableSeats: number;

  /**
   * Number of seats already booked.
   */
  readonly bookedSeats?: number | null;

  /**
   * Optional total Journey seat capacity.
   */
  readonly totalSeats?: number | null;

  /**
   * Optional additional styling supplied by the marketplace card.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Formatting helpers
// -----------------------------------------------------------------------------

/**
 * Formats the Journey price for marketplace presentation.
 *
 * No currency conversion or minor-unit conversion is performed here.
 */
function formatPrice(
  amount: number,
  currency: string,
): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;

  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: currency || 'KES',
    maximumFractionDigits: 0,
  }).format(safeAmount);
}

/**
 * Safely formats a seat count.
 *
 * Public read models should normally contain valid non-negative integers.
 * Presentation code still protects the UI from malformed runtime values.
 */
function formatSeatCount(
  value: number | null | undefined,
): string {
  if (
    value === null ||
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return '0';
  }

  return Math.max(0, Math.trunc(value)).toLocaleString('en-KE');
}

/**
 * Determines whether an optional numeric value is actually available.
 */
function hasNumericValue(
  value: number | null | undefined,
): value is number {
  return (
    value !== null &&
    value !== undefined &&
    Number.isFinite(value)
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCardPrice({
  amount,
  currency,
  availableSeats,
  bookedSeats,
  totalSeats,
  className,
}: JourneyCardPriceProps) {
  const formattedPrice = formatPrice(amount, currency);
  const formattedAvailableSeats = formatSeatCount(availableSeats);

  const hasBookedSeats = hasNumericValue(bookedSeats);
  const hasTotalSeats = hasNumericValue(totalSeats);

  return (
    <div
      className={[
        // -------------------------------------------------------------------
        // Price column content boundary
        // -------------------------------------------------------------------
        //
        // The parent owns the marketplace column geometry and outer padding.
        // This component only controls its internal content.
        //
        'flex',
        'min-w-0',
        'flex-col',
        'justify-center',
        'gap-0',

        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Price                                                               */}
      {/* ------------------------------------------------------------------- */}
      {/*
       * IMPORTANT:
       *
       * Do NOT use `truncate` here.
       *
       * A price is an atomic marketplace value. Clipping it to:
       *
       *   K...
       *
       * or:
       *
       *   K
       *
       * destroys the meaning of the value.
       *
       * `whitespace-nowrap` keeps the monetary value together while the
       * responsive font size allows the value itself to contract.
       *
       * `w-fit` prevents the price from behaving like a full-width text
       * region inside the flex column.
       */}
      <span
        className={[
          'w-fit',
          'max-w-full',
          'whitespace-nowrap',
          'text-base',
          'sm:text-lg',
          'md:text-xl',
          'lg:text-2xl',
          'font-semibold',
          'leading-tight',
          'tracking-tight',
          'tabular-nums',
          'text-[var(--foreground)]',
        ].join(' ')}
      >
        {formattedPrice}
      </span>

      {/* ------------------------------------------------------------------- */}
      {/* Pricing unit                                                        */}
      {/* ------------------------------------------------------------------- */}

      <span
        className={[
          'mt-0.5',
          'w-fit',
          'max-w-full',
          'whitespace-nowrap',
          'text-[9px]',
          'sm:text-[10px]',
          'md:text-xs',
          'font-medium',
          'leading-tight',
          'text-[var(--foreground-muted)]',
        ].join(' ')}
      >
        per seat
      </span>

      {/* ------------------------------------------------------------------- */}
      {/* Available seats                                                     */}
      {/* ------------------------------------------------------------------- */}

      <div
        className={[
          'mt-1.5',
          'sm:mt-2',
          'md:mt-2.5',
          'flex',
          'min-w-0',
          'items-center',
          'gap-1',
          'sm:gap-1.5',
        ].join(' ')}
      >
        {/* Availability indicator. */}
        <span
          className={[
            'h-1',
            'w-1',
            'sm:h-1.5',
            'sm:w-1.5',
            'shrink-0',
            'rounded-full',
            'bg-[var(--brand)]',
          ].join(' ')}
          aria-hidden="true"
        />

        <span
          className={[
            'min-w-0',
            'truncate',
            'text-[10px]',
            'sm:text-[11px]',
            'md:text-xs',
            'font-medium',
            'leading-tight',
            'text-[var(--foreground-secondary)]',
          ].join(' ')}
        >
          {formattedAvailableSeats} available
        </span>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Booking occupancy                                                   */}
      {/* ------------------------------------------------------------------- */}

      {hasBookedSeats && hasTotalSeats && (
        <span
          className={[
            'mt-0.5',
            'w-fit',
            'max-w-full',
            'whitespace-nowrap',
            'text-[9px]',
            'sm:text-[10px]',
            'md:text-xs',
            'leading-tight',
            'tabular-nums',
            'text-[var(--foreground-subtle)]',
          ].join(' ')}
        >
          {formatSeatCount(bookedSeats)} of{' '}
          {formatSeatCount(totalSeats)} booked
        </span>
      )}
    </div>
  );
}