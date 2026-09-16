// -----------------------------------------------------------------------------
// sisiMove — Journey Marketplace Card Date
// -----------------------------------------------------------------------------
//
// Compact presentation component for the departure date/time displayed in a
// public Journey marketplace listing.
//
// MARKETPLACE ROLE
// ---------------
//
// The Journey marketplace row communicates:
//
//   WHEN → WHO → WHERE → VEHICLE → PRICE/SEATS → ACTIONS
//
// This component owns only the `WHEN` portion.
//
// Its visual hierarchy is:
//
//   TUE
//   16
//   SEP 2026
//   23:33
//
// PRESENTATION BOUNDARY
// ---------------------
//
// This component is presentation-only.
//
// It deliberately does not:
//
// - determine whether a Journey is upcoming;
// - determine whether a Journey is bookable;
// - calculate Journey duration;
// - determine Journey availability;
// - fetch Journey data;
// - construct URLs;
// - contain Journey business rules;
// - modify the supplied date.
//
// The parent supplies the Journey departure value and, optionally, the
// timezone in which that departure should be presented.
//
// DATE / TIMEZONE HANDLING
// ------------------------
//
// The incoming value may be:
//
//   - an ISO date string;
//   - a Date instance.
//
// The component formats the value for the public marketplace using:
//
//   en-KE
//
// When an IANA timezone is supplied, the timestamp is explicitly presented
// in that timezone. This prevents the browser's local timezone from silently
// becoming the presentation timezone for a real-world Journey departure.
//
// When no timezone is supplied, Intl.DateTimeFormat uses the runtime's
// timezone. The public read model should preferably provide an explicit
// Journey timezone.
//
// RESPONSIVE MARKETPLACE DENSITY
// ------------------------------
//
// The marketplace parent owns:
//
// - column width;
// - column padding;
// - column separators;
// - marketplace row geometry.
//
// This component owns only the density of its internal date content.
//
// Consequently it deliberately does NOT:
//
// - define a fixed width;
// - use shrink-0 for the marketplace column;
// - add marketplace-level horizontal padding;
// - add marketplace-level vertical padding;
// - control the complete marketplace row.
//
// Its typography and internal spacing contract progressively:
//
//   mobile → small → medium → large
//
// This keeps the date block visually proportional with the other marketplace
// columns.
//
// DESIGN-SYSTEM BOUNDARY
// ----------------------
//
// Uses only sisiMove global design tokens:
//
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

export interface JourneyCardDateProps {
  /**
   * Journey departure date/time.
   *
   * This represents the actual departure instant supplied by the public
   * Journey read model.
   */
  readonly departureAt: string | Date;

  /**
   * Optional IANA timezone used when presenting the departure.
   *
   * Examples:
   *
   *   "Africa/Nairobi"
   *   "Africa/Kampala"
   *
   * When omitted, Intl.DateTimeFormat uses the runtime's timezone.
   */
  readonly timeZone?: string;

  /**
   * Optional additional styling supplied by the marketplace card.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Formatted date model
// -----------------------------------------------------------------------------

interface FormattedDepartureDate {
  readonly weekday: string;
  readonly day: string;
  readonly monthYear: string;
  readonly time: string;
}

// -----------------------------------------------------------------------------
// Date formatter
// -----------------------------------------------------------------------------

/**
 * Formats the individual values used by the marketplace date block.
 *
 * The values remain separate rather than becoming one localized date string
 * because the marketplace intentionally gives each part a different visual
 * weight.
 */
function formatDepartureDate(
  departureAt: string | Date,
  timeZone?: string,
): FormattedDepartureDate | null {
  const date =
    departureAt instanceof Date
      ? departureAt
      : new Date(departureAt);

  // ---------------------------------------------------------------------------
  // Invalid runtime value
  // ---------------------------------------------------------------------------
  //
  // A malformed timestamp should not cause the entire marketplace to fail
  // during rendering.
  //
  // The upstream public read model should normally guarantee a valid
  // timestamp. This is only a presentation-level defensive fallback.
  // ---------------------------------------------------------------------------

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const formatterOptions: Intl.DateTimeFormatOptions = {
    ...(timeZone ? { timeZone } : {}),
  };

  const weekday = new Intl.DateTimeFormat('en-KE', {
    ...formatterOptions,
    weekday: 'short',
  }).format(date);

  const day = new Intl.DateTimeFormat('en-KE', {
    ...formatterOptions,
    day: '2-digit',
  }).format(date);

  const monthYear = new Intl.DateTimeFormat('en-KE', {
    ...formatterOptions,
    month: 'short',
    year: 'numeric',
  }).format(date);

  const time = new Intl.DateTimeFormat('en-KE', {
    ...formatterOptions,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);

  return {
    weekday: weekday.toUpperCase(),
    day,
    monthYear: monthYear.toUpperCase(),
    time,
  };
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCardDate({
  departureAt,
  timeZone,
  className,
}: JourneyCardDateProps) {
  const formatted = formatDepartureDate(departureAt, timeZone);

  // ---------------------------------------------------------------------------
  // Invalid runtime value
  // ---------------------------------------------------------------------------
  //
  // Keep the fallback compact so a malformed record does not distort the
  // marketplace row.
  //
  // This component does not attempt to repair or reinterpret the supplied
  // timestamp.
  // ---------------------------------------------------------------------------

  if (!formatted) {
    return (
      <div
        className={[
          'flex',
          'min-w-0',
          'flex-col',
          'justify-center',
          'gap-0.5',
          'sm:gap-1',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        aria-label="Departure date unavailable"
      >
        <span
          className={[
            'text-[9px]',
            'sm:text-[10px]',
            'md:text-xs',
            'font-medium',
            'uppercase',
            'tracking-[0.06em]',
            'text-[var(--foreground-subtle)]',
          ].join(' ')}
        >
          Departure
        </span>

        <span
          className={[
            'text-[11px]',
            'sm:text-xs',
            'md:text-sm',
            'font-medium',
            'leading-tight',
            'text-[var(--foreground-muted)]',
          ].join(' ')}
        >
          Date unavailable
        </span>
      </div>
    );
  }

  return (
    <div
      className={[
        'flex',
        'min-w-0',
        'flex-col',
        'justify-center',
        'gap-0',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      aria-label={`Departure ${formatted.weekday} ${formatted.day} ${formatted.monthYear} at ${formatted.time}`}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Weekday                                                              */}
      {/* ------------------------------------------------------------------- */}

      <span
        className={[
          'text-[9px]',
          'sm:text-[10px]',
          'md:text-xs',
          'font-semibold',
          'uppercase',
          'tracking-[0.06em]',
          'sm:tracking-[0.08em]',
          'text-[var(--foreground-muted)]',
          'leading-none',
        ].join(' ')}
      >
        {formatted.weekday}
      </span>

      {/* ------------------------------------------------------------------- */}
      {/* Day                                                                  */}
      {/* ------------------------------------------------------------------- */}

      <span
        className={[
          'mt-0.5',
          'text-xl',
          'sm:text-[1.375rem]',
          'md:text-2xl',
          'font-semibold',
          'leading-none',
          'tracking-tight',
          'text-[var(--foreground)]',
        ].join(' ')}
      >
        {formatted.day}
      </span>

      {/* ------------------------------------------------------------------- */}
      {/* Month + year                                                         */}
      {/* ------------------------------------------------------------------- */}

      <span
        className={[
          'mt-0.5',
          'sm:mt-1',
          'text-[9px]',
          'sm:text-[10px]',
          'md:text-xs',
          'font-medium',
          'uppercase',
          'tracking-[0.04em]',
          'sm:tracking-wide',
          'text-[var(--foreground-secondary)]',
          'leading-tight',
        ].join(' ')}
      >
        {formatted.monthYear}
      </span>

      {/* ------------------------------------------------------------------- */}
      {/* Departure time                                                       */}
      {/* ------------------------------------------------------------------- */}

      <span
        className={[
          'mt-1',
          'sm:mt-1.5',
          'text-[11px]',
          'sm:text-xs',
          'md:text-sm',
          'font-semibold',
          'leading-none',
          'tabular-nums',
          'text-[var(--foreground)]',
        ].join(' ')}
      >
        {formatted.time}
      </span>
    </div>
  );
}