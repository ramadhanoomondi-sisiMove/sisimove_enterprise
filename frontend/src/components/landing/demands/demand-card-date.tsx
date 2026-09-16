// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Marketplace Date
// -----------------------------------------------------------------------------
//
// Compact schedule column for a public Journey Demand.
//
// IMPORTANT
// ---------
//
// A Journey has one concrete departure:
//
//     departureAt
//
// A Journey Demand does NOT necessarily have a single departure time.
//
// Its public schedule contains:
//
//     earliestDeparture
//     latestDeparture
//     targetArrival
//     maximumArrival
//     timezone
//
// Therefore this component deliberately presents a REQUESTED TIME WINDOW
// rather than pretending that the Demand has a fixed departure.
//
// PRESENTATION BOUNDARY
// ---------------------
//
// This component:
//
// - formats public schedule values
// - displays the requested departure window
// - displays optional arrival requirements
// - uses Intl.DateTimeFormat for timezone-aware presentation
//
// This component does NOT:
//
// - perform booking logic
// - perform matching logic
// - interpret Demand status
// - mutate schedule data
// - determine whether a Demand is joinable
// - determine whether a visitor may participate
//
// RESPONSIVE MARKETPLACE RULE
// ---------------------------
//
// The marketplace card remains a horizontal row at every viewport size.
//
// Therefore this component must:
//
// - remain horizontally contained within its allocated column
// - use min-w-0
// - never define a fixed desktop width
// - never use shrink-0
// - contract spacing and typography at smaller sizes
// - avoid forcing horizontal scrolling
//
// The parent DemandMarketplaceCard owns the column width:
//
//     flex-[0.8]
//
// This component owns only the visual contents of that column.
//
// -----------------------------------------------------------------------------

import type { PublicJourneyDemandSchedule } from '@/features/journey-demands/models';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface DemandCardDateProps {
  /**
   * Public requested schedule.
   */
  readonly schedule: PublicJourneyDemandSchedule;

  /**
   * Optional presentation class.
   */
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Formatting helpers
// -----------------------------------------------------------------------------

function parseDate(value: string): Date | null {
  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

interface FormattedDate {
  readonly weekday: string;
  readonly day: string;
  readonly monthYear: string;
  readonly time: string;
}

function formatDate(
  value: string,
  timezone: string,
): FormattedDate | null {
  const date = parseDate(value);

  if (!date) {
    return null;
  }

  const dateFormatter = new Intl.DateTimeFormat('en-KE', {
    timeZone: timezone,
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const timeFormatter = new Intl.DateTimeFormat('en-KE', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const parts = dateFormatter.formatToParts(date);

  const weekday =
    parts.find((part) => part.type === 'weekday')?.value ?? '';

  const day =
    parts.find((part) => part.type === 'day')?.value ?? '';

  const month =
    parts.find((part) => part.type === 'month')?.value ?? '';

  const year =
    parts.find((part) => part.type === 'year')?.value ?? '';

  return {
    weekday: weekday.toUpperCase(),
    day,
    monthYear: `${month} ${year}`.toUpperCase(),
    time: timeFormatter.format(date),
  };
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function DemandCardDate({
  schedule,
  className,
}: DemandCardDateProps) {
  const earliest = formatDate(
    schedule.earliestDeparture,
    schedule.timezone,
  );

  const latest = formatDate(
    schedule.latestDeparture,
    schedule.timezone,
  );

  const targetArrival = schedule.targetArrival
    ? formatDate(schedule.targetArrival, schedule.timezone)
    : null;

  const maximumArrival = schedule.maximumArrival
    ? formatDate(schedule.maximumArrival, schedule.timezone)
    : null;

  // ---------------------------------------------------------------------------
  // Invalid / unavailable schedule
  // ---------------------------------------------------------------------------
  //
  // The public read model should normally contain valid schedule values.
  // Nevertheless, the presentation boundary should fail gracefully instead
  // of throwing during rendering when an unexpected API value reaches it.
  // ---------------------------------------------------------------------------

  if (!earliest || !latest) {
    return (
      <div
        className={[
          'flex',
          'min-w-0',
          'flex-col',
          'justify-center',
          'gap-0.5',
          'text-center',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <p
          className={[
            'text-[9px]',
            'sm:text-[10px]',
            'md:text-xs',
            'font-medium',
            'uppercase',
            'tracking-wide',
            'text-[var(--foreground-muted)]',
          ].join(' ')}
        >
          Travel
        </p>

        <p
          className={[
            'min-w-0',
            'text-[10px]',
            'sm:text-[11px]',
            'md:text-xs',
            'font-medium',
            'leading-tight',
            'text-[var(--foreground)]',
          ].join(' ')}
        >
          Schedule unavailable
        </p>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Departure window
  // ---------------------------------------------------------------------------

  const sameCalendarDate =
    earliest.day === latest.day &&
    earliest.monthYear === latest.monthYear;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div
      className={[
        'flex',
        'min-w-0',
        'flex-col',
        'justify-center',
        'overflow-hidden',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Requested departure window                                        */}
      {/* ------------------------------------------------------------------ */}

      <p
        className={[
          'text-[9px]',
          'sm:text-[10px]',
          'md:text-xs',
          'font-medium',
          'uppercase',
          'tracking-wide',
          'text-[var(--foreground-muted)]',
        ].join(' ')}
      >
        Travel
      </p>

      <p
        className={[
          'mt-0.5',
          'text-[9px]',
          'sm:text-[10px]',
          'md:text-xs',
          'font-semibold',
          'uppercase',
          'leading-tight',
          'text-[var(--foreground-secondary)]',
        ].join(' ')}
      >
        {earliest.weekday}
      </p>

      <p
        className={[
          'text-xl',
          'sm:text-[22px]',
          'md:text-2xl',
          'font-semibold',
          'leading-none',
          'text-[var(--foreground)]',
        ].join(' ')}
      >
        {earliest.day}
      </p>

      <p
        className={[
          'mt-0.5',
          'truncate',
          'text-[9px]',
          'sm:text-[10px]',
          'md:text-xs',
          'font-medium',
          'uppercase',
          'leading-tight',
          'text-[var(--foreground-muted)]',
        ].join(' ')}
      >
        {earliest.monthYear}
      </p>

      <p
        className={[
          'mt-1',
          'truncate',
          'text-[11px]',
          'sm:text-xs',
          'md:text-sm',
          'font-semibold',
          'leading-tight',
          'text-[var(--foreground)]',
        ].join(' ')}
      >
        {sameCalendarDate
          ? `${earliest.time}–${latest.time}`
          : `${earliest.time}–`}
      </p>

      {!sameCalendarDate && (
        <p
          className={[
            'mt-0.5',
            'truncate',
            'text-[9px]',
            'sm:text-[10px]',
            'md:text-xs',
            'leading-tight',
            'text-[var(--foreground-muted)]',
          ].join(' ')}
        >
          until {latest.weekday} {latest.day}
        </p>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Arrival requirement                                                */}
      {/* ------------------------------------------------------------------ */}
      {targetArrival || maximumArrival ? (
        <div
          className={[
            'mt-1.5',
            'sm:mt-2',
            'border-t',
            'border-[var(--border-subtle)]',
            'pt-1.5',
            'sm:pt-2',
          ].join(' ')}
        >
          <p
            className={[
              'text-[8px]',
              'sm:text-[9px]',
              'md:text-[10px]',
              'font-medium',
              'uppercase',
              'tracking-wide',
              'text-[var(--foreground-subtle)]',
            ].join(' ')}
          >
            Arrival
          </p>

          {targetArrival && (
            <p
              className={[
                'truncate',
                'text-[9px]',
                'sm:text-[10px]',
                'md:text-xs',
                'font-medium',
                'leading-tight',
                'text-[var(--foreground-secondary)]',
              ].join(' ')}
            >
              Target {targetArrival.time}
            </p>
          )}

          {!targetArrival && maximumArrival && (
            <p
              className={[
                'truncate',
                'text-[9px]',
                'sm:text-[10px]',
                'md:text-xs',
                'font-medium',
                'leading-tight',
                'text-[var(--foreground-secondary)]',
              ].join(' ')}
            >
              By {maximumArrival.time}
            </p>
          )}

          {targetArrival && maximumArrival && (
            <p
              className={[
                'truncate',
                'text-[9px]',
                'sm:text-[10px]',
                'md:text-[11px]',
                'leading-tight',
                'text-[var(--foreground-muted)]',
              ].join(' ')}
            >
              By {maximumArrival.time}
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}