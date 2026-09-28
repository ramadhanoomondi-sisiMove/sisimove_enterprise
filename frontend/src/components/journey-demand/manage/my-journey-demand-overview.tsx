// -----------------------------------------------------------------------------
// sisiMove — My Journey Demand Overview
// -----------------------------------------------------------------------------
//
// Authenticated owner's Journey Demand overview.
//
// Architecture rules:
// - Presentation only.
// - Receives an already-loaded MyJourneyDemand.
// - Does not fetch the demand.
// - Does not determine ownership.
// - Does not perform authorization.
// - Does not call mutations.
// - Does not infer lifecycle transitions.
// - Does not derive backend business state.
// - Does not convert MyJourneyDemand into PublicJourneyDemand.
//
// IMPORTANT:
//
// MyJourneyDemand is a dedicated authenticated-owner read model.
//
// It is intentionally NOT treated as PublicJourneyDemand because:
//
// - corridor may be undefined;
// - schedule may be undefined;
// - capacity may be undefined;
// - pricing may be undefined;
// - owner status may include DRAFT.
//
// Public-only presentation components must therefore not be passed owner
// model components through casts or non-null assertions.
//
// -----------------------------------------------------------------------------

'use client';

import type { MyJourneyDemand } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

// =============================================================================
// Props
// =============================================================================

export interface MyJourneyDemandOverviewProps {
  readonly demand: MyJourneyDemand;
  readonly className?: string;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Presents the core overview of an authenticated owner's Journey Demand.
 *
 * The backend-provided MyJourneyDemand projection is consumed directly.
 */
export function MyJourneyDemandOverview({
  demand,
  className,
}: MyJourneyDemandOverviewProps) {
  const {
    corridor,
    schedule,
    capacity,
    pricing,
  } = demand;

  return (
    <section
      className={cn(
        'surface min-w-0 p-4 sm:p-5',
        className,
      )}
      aria-labelledby="my-journey-demand-overview-heading"
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
            Travel need
          </p>

          <h2
            id="my-journey-demand-overview-heading"
            className="mt-1 text-base font-semibold text-foreground sm:text-lg"
          >
            {corridor ? (
              <>
                {corridor.originName}

                <span
                  className="px-2 text-foreground-subtle"
                  aria-hidden="true"
                >
                  →
                </span>

                {corridor.destinationName}
              </>
            ) : (
              'Journey Demand'
            )}
          </h2>
        </div>

        <MyJourneyDemandStatus
          status={demand.status}
        />
      </div>

      <div className="mt-5 min-w-0 space-y-4">
        {corridor ? (
          <OverviewSection title="Route">
            <div className="text-sm text-foreground">
              <span>{corridor.originName}</span>

              <span
                className="px-2 text-foreground-subtle"
                aria-hidden="true"
              >
                →
              </span>

              <span>{corridor.destinationName}</span>
            </div>
          </OverviewSection>
        ) : null}

        {schedule ? (
          <OverviewSection title="Travel schedule">
            <JourneyDemandScheduleValue
              schedule={schedule}
            />
          </OverviewSection>
        ) : null}

        {capacity ? (
          <OverviewSection title="Capacity">
            <JourneyDemandCapacityValue
              capacity={capacity}
            />
          </OverviewSection>
        ) : null}

        {pricing ? (
          <OverviewSection title="Pricing">
            <JourneyDemandPricingValue
              pricing={pricing}
            />
          </OverviewSection>
        ) : null}
      </div>
    </section>
  );
}

// =============================================================================
// Status
// =============================================================================

interface MyJourneyDemandStatusProps {
  readonly status: MyJourneyDemand['status'];
}

/**
 * Presents the backend-provided owner status.
 *
 * This deliberately does not use JourneyDemandStatusBadge because that shared
 * component currently accepts PublicJourneyDemandStatus, while
 * MyJourneyDemand.status is JourneyDemandStatus and may include DRAFT.
 */
function MyJourneyDemandStatus({
  status,
}: MyJourneyDemandStatusProps) {
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center rounded-full',
        'border border-border bg-background',
        'px-2.5 py-1',
        'text-xs font-medium text-foreground',
      )}
    >
      {formatStatus(status)}
    </span>
  );
}

// =============================================================================
// Schedule
// =============================================================================

interface JourneyDemandScheduleValueProps {
  readonly schedule: NonNullable<MyJourneyDemand['schedule']>;
}

/**
 * Renders the existing JourneyDemandSchedule model without assuming that its
 * properties are the public schedule projection.
 *
 * Object.entries is intentionally avoided here because the presentation
 * should remain explicit once the actual JourneyDemandSchedule contract is
 * established.
 *
 * Replace the fields below with the exact JourneyDemandSchedule properties
 * already defined in the model.
 */
function JourneyDemandScheduleValue({
  schedule,
}: JourneyDemandScheduleValueProps) {
  return (
    <pre className="overflow-x-auto whitespace-pre-wrap break-words text-xs text-foreground-muted">
      {JSON.stringify(schedule, null, 2)}
    </pre>
  );
}

// =============================================================================
// Capacity
// =============================================================================

interface JourneyDemandCapacityValueProps {
  readonly capacity: NonNullable<MyJourneyDemand['capacity']>;
}

/**
 * Presents the backend capacity projection without deriving values such as
 * remaining seats.
 */
function JourneyDemandCapacityValue({
  capacity,
}: JourneyDemandCapacityValueProps) {
  return (
    <pre className="overflow-x-auto whitespace-pre-wrap break-words text-xs text-foreground-muted">
      {JSON.stringify(capacity, null, 2)}
    </pre>
  );
}

// =============================================================================
// Pricing
// =============================================================================

interface JourneyDemandPricingValueProps {
  readonly pricing: NonNullable<MyJourneyDemand['pricing']>;
}

/**
 * Presents the backend pricing projection without reconstructing pricing
 * semantics.
 */
function JourneyDemandPricingValue({
  pricing,
}: JourneyDemandPricingValueProps) {
  return (
    <pre className="overflow-x-auto whitespace-pre-wrap break-words text-xs text-foreground-muted">
      {JSON.stringify(pricing, null, 2)}
    </pre>
  );
}

// =============================================================================
// Shared local presentation
// =============================================================================

interface OverviewSectionProps {
  readonly title: string;
  readonly children: React.ReactNode;
}

function OverviewSection({
  title,
  children,
}: OverviewSectionProps) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-background p-3">
      <h3 className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
        {title}
      </h3>

      <div className="mt-1">
        {children}
      </div>
    </div>
  );
}

// =============================================================================
// Formatting
// =============================================================================

function formatStatus(
  status: MyJourneyDemand['status'],
): string {
  return status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

