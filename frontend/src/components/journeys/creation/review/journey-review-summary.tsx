// frontend/src/features/journey/components/journeys/creation/review/journey-review-summary.tsx

import type {
  Journey,
  JourneyAsset,
  JourneyCapacity,
  JourneyCorridor,
  JourneyPreferences,
  JourneyPricing,
  JourneySchedule,
  JourneyVehicle,
  JourneyWaypoint,
} from '@/features/journey/models';

// ============================================================
// JOURNEY REVIEW SUMMARY
// ============================================================
//
// Presentation-only summary of the current Journey configuration.
//
// This component:
// - receives already-loaded Journey data;
// - renders the configured Journey components;
// - performs no API calls;
// - performs no mutations;
// - performs no navigation;
// - does not determine whether the Journey may be published.
//
// The workflow container remains responsible for retrieving the
// Journey and invoking the publish command.
//
// ============================================================

export interface JourneyReviewSummaryProps {
  journey: Journey;

  corridor?: JourneyCorridor | null;

  waypoints?: readonly JourneyWaypoint[];

  schedule?: JourneySchedule | null;

  vehicle?: JourneyVehicle | null;

  capacity?: JourneyCapacity | null;

  pricing?: JourneyPricing | null;

  preferences?: JourneyPreferences | null;

  assets?: readonly JourneyAsset[];

  className?: string;
}

// ============================================================
// Formatting helpers
// ============================================================

function formatDateTime(value?: string | null): string {
  if (!value) {
    return 'Not configured';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatOptional(value?: string | number | null): string {
  if (value === undefined || value === null || value === '') {
    return 'Not provided';
  }

  return String(value);
}

// ============================================================
// Shared presentation primitives
// ============================================================

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const headingId = `${title
    .toLowerCase()
    .replace(/\s+/g, '-')}-heading`;

  return (
    <section
      aria-labelledby={headingId}
      className="surface p-4"
    >
      <h3
        id={headingId}
        className="text-sm font-semibold text-[var(--foreground)]"
      >
        {title}
      </h3>

      <div className="mt-4">{children}</div>
    </section>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[var(--border-subtle)] py-2 last:border-b-0">
      <dt className="text-sm text-[var(--foreground-muted)]">
        {label}
      </dt>

      <dd className="text-right text-sm font-medium text-[var(--foreground)]">
        {value}
      </dd>
    </div>
  );
}

// ============================================================
// Component
// ============================================================

export function JourneyReviewSummary({
  journey,
  corridor,
  waypoints = [],
  schedule,
  vehicle,
  capacity,
  pricing,
  preferences,
  assets = [],
  className,
}: JourneyReviewSummaryProps) {
  return (
    <div className={['space-y-4', className].filter(Boolean).join(' ')}>
      {/* --------------------------------------------------------
          Route
          -------------------------------------------------------- */}

      <Section title="Route">
        <dl>
          <DetailRow
            label="From"
            value={corridor?.originName ?? 'Not configured'}
          />

          <DetailRow
            label="To"
            value={corridor?.destinationName ?? 'Not configured'}
          />

          <DetailRow
            label="Waypoints"
            value={
              waypoints.length > 0
                ? `${waypoints.length} configured`
                : 'None'
            }
          />
        </dl>
      </Section>

      {/* --------------------------------------------------------
          Schedule
          -------------------------------------------------------- */}

      <Section title="Schedule">
        <dl>
          <DetailRow
            label="Departure"
            value={formatDateTime(schedule?.departureAt)}
          />

          <DetailRow
            label="Arrival"
            value={formatDateTime(schedule?.arrivalAt)}
          />

          <DetailRow
            label="Timezone"
            value={schedule?.timezone ?? 'Not configured'}
          />
        </dl>
      </Section>

      {/* --------------------------------------------------------
          Vehicle
          -------------------------------------------------------- */}

      <Section title="Vehicle">
        <dl>
          <DetailRow
            label="Vehicle"
            value={
              vehicle
                ? `${vehicle.make} ${vehicle.model}`
                : 'Not configured'
            }
          />

          <DetailRow
            label="Year"
            value={formatOptional(vehicle?.year)}
          />

          <DetailRow
            label="Color"
            value={formatOptional(vehicle?.color)}
          />

          <DetailRow
            label="Registration"
            value={formatOptional(vehicle?.registration)}
          />
        </dl>
      </Section>

      {/* --------------------------------------------------------
          Capacity
          -------------------------------------------------------- */}

      <Section title="Seats">
        <dl>
          <DetailRow
            label="Available seats"
            value={
              capacity
                ? capacity.totalSeats - capacity.bookedSeats
                : 'Not configured'
            }
          />

          <DetailRow
            label="Total seats"
            value={capacity?.totalSeats ?? 'Not configured'}
          />
        </dl>
      </Section>

      {/* --------------------------------------------------------
          Pricing
          -------------------------------------------------------- */}

      <Section title="Pricing">
        <dl>
          <DetailRow
            label="Cost sharing amount"
            value={
              pricing
                ? `${pricing.currency} ${pricing.amount.toLocaleString(
                    'en-KE',
                  )}`
                : 'Not configured'
            }
          />
        </dl>
      </Section>

      {/* --------------------------------------------------------
          Preferences
          -------------------------------------------------------- */}

      <Section title="Preferences">
        <dl>
          <DetailRow
            label="Smoking"
            value={preferences?.smoking ?? 'Not configured'}
          />

          <DetailRow
            label="Pets"
            value={preferences?.pets ?? 'Not configured'}
          />

          <DetailRow
            label="Luggage"
            value={preferences?.luggage ?? 'Not configured'}
          />

          <DetailRow
            label="Conversation"
            value={
              preferences?.conversation ?? 'Not configured'
            }
          />

          <DetailRow
            label="Music"
            value={preferences?.music ?? 'Not configured'}
          />
        </dl>
      </Section>

      {/* --------------------------------------------------------
          Photos
          -------------------------------------------------------- */}

      <Section title="Photos">
        <dl>
          <DetailRow
            label="Journey photos"
            value={
              assets.length > 0
                ? `${assets.length} added`
                : 'No photos added'
            }
          />
        </dl>
      </Section>

      {/* --------------------------------------------------------
          Publication notice
          -------------------------------------------------------- */}

      <div className="surface-brand p-4">
        <p className="text-sm font-medium text-[var(--foreground)]">
          Ready to publish?
        </p>

        <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
          Publishing makes this Journey available to travellers in
          the SisiMove marketplace.
        </p>
      </div>
    </div>
  );
}