// -----------------------------------------------------------------------------
// Path: src/features/journey-demand/components/manage/my-journey-demand-overview.tsx
// -----------------------------------------------------------------------------
//
// sisiMove — My Journey Demand Overview
//
// Authenticated owner's complete Journey Demand overview.
//
// Architecture
// ------------
//
// This component is presentation-only.
//
// It receives an already-loaded MyJourneyDemand projection and presents the
// information currently known about the owner's Demand.
//
// It does NOT:
//
// - fetch;
// - mutate;
// - authorize;
// - determine lifecycle transitions;
// - determine whether an action is available;
// - convert the owner projection into a public projection;
// - resolve locations;
// - construct API requests;
// - own editing state;
// - own save state;
// - navigate.
//
// The backend projection remains authoritative. In particular, convenience
// flags supplied by the backend are consumed directly rather than recreated
// from status or other fields in this component.
//
// Incomplete DRAFT demands are supported intentionally. A section is rendered
// only when the corresponding projection component exists.
//
// Owner management actions are intentionally outside this component.
//
//     JourneyDemandManagement
//              │
//              ├── lifecycle actions
//              │
//              └── JourneyDemandEditor
//                       │
//                       └── MyJourneyDemandOverview
//
// -----------------------------------------------------------------------------

'use client';

import type { ReactNode } from 'react';

import type { MyJourneyDemand } from '@/features/journey-demand/models';
import { cn } from '@/foundation';

import { MyJourneyDemandStatus } from './my-journey-demand-status';

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
    <div className={cn('min-w-0 space-y-4', className)}>
      {/* ================================================================== */}
      {/* Travel need                                                        */}
      {/* ================================================================== */}

      <section
        className="surface min-w-0 p-4 sm:p-5"
        aria-labelledby="my-journey-demand-travel-need-heading"
      >
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
              Travel need
            </p>

            <h2
              id="my-journey-demand-travel-need-heading"
              className="mt-1 text-lg font-semibold text-foreground sm:text-xl"
            >
              {corridor
                ? `${corridor.originName} → ${corridor.destinationName}`
                : 'Journey Demand'}
            </h2>
          </div>

          <MyJourneyDemandStatus demand={demand} />
        </div>

        <div className="mt-5 min-w-0 space-y-4">
          {corridor ? (
            <DetailRow
              label="Journey requested"
              value={
                <RouteValue
                  origin={corridor.originName}
                  destination={corridor.destinationName}
                />
              }
            />
          ) : null}

          {schedule ? (
            <DetailRow
              label="Departure window"
              value={<DepartureWindowValue schedule={schedule} />}
            />
          ) : null}

          {capacity ? (
            <DetailRow
              label="Seats requested"
              value={
                <CapacityPrimaryValue
                  requestedSeats={capacity.requestedSeats}
                />
              }
            />
          ) : null}
        </div>
      </section>

      {/* ================================================================== */}
      {/* Travel window                                                      */}
      {/* ================================================================== */}

      {schedule ? (
        <TravelWindowSection schedule={schedule} />
      ) : null}

      {/* ================================================================== */}
      {/* Capacity / matching                                                */}
      {/* ================================================================== */}

      {capacity ? (
        <DemandMatchingSection capacity={capacity} />
      ) : null}

      {/* ================================================================== */}
      {/* Pricing                                                            */}
      {/* ================================================================== */}

      {pricing ? (
        <PricingRequirementsSection pricing={pricing} />
      ) : null}

      {/* ================================================================== */}
      {/* Lifecycle                                                          */}
      {/* ================================================================== */}

      <DemandLifecycleSection demand={demand} />
    </div>
  );
}

// =============================================================================
// Travel Need
// =============================================================================

interface RouteValueProps {
  readonly origin: string;
  readonly destination: string;
}

function RouteValue({
  origin,
  destination,
}: RouteValueProps) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-foreground">
      <span className="min-w-0 truncate">
        {origin}
      </span>

      <span
        className="shrink-0 text-foreground-subtle"
        aria-hidden="true"
      >
        →
      </span>

      <span className="min-w-0 truncate">
        {destination}
      </span>
    </div>
  );
}

interface DepartureWindowValueProps {
  readonly schedule: NonNullable<MyJourneyDemand['schedule']>;
}

function DepartureWindowValue({
  schedule,
}: DepartureWindowValueProps) {
  const {
    scheduleWindow,
    timezone,
    isExactDepartureTime,
  } = schedule;

  if (isExactDepartureTime) {
    return (
      <span className="text-sm font-medium text-foreground">
        {formatDateTime(
          scheduleWindow.earliestDeparture,
          timezone,
        )}
      </span>
    );
  }

  return (
    <span className="text-sm font-medium text-foreground">
      {formatDateTime(
        scheduleWindow.earliestDeparture,
        timezone,
      )}
      {' – '}
      {formatDateTime(
        scheduleWindow.latestDeparture,
        timezone,
      )}
    </span>
  );
}

interface CapacityPrimaryValueProps {
  readonly requestedSeats: number;
}

function CapacityPrimaryValue({
  requestedSeats,
}: CapacityPrimaryValueProps) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-base font-semibold text-foreground">
        {requestedSeats}
      </span>

      <span className="text-sm text-foreground-muted">
        {requestedSeats === 1 ? 'seat' : 'seats'}
      </span>
    </div>
  );
}

// =============================================================================
// Travel Window
// =============================================================================

interface TravelWindowSectionProps {
  readonly schedule: NonNullable<MyJourneyDemand['schedule']>;
}

function TravelWindowSection({
  schedule,
}: TravelWindowSectionProps) {
  const {
    scheduleWindow,
    arrivalWindow,
    timezone,
    hasTargetArrival,
    hasMaximumArrival,
  } = schedule;

  return (
    <section
      className="surface min-w-0 p-4 sm:p-5"
      aria-labelledby="my-journey-demand-travel-window-heading"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
        Travel window
      </p>

      <h2
        id="my-journey-demand-travel-window-heading"
        className="mt-1 text-base font-semibold text-foreground sm:text-lg"
      >
        When you want to travel
      </h2>

      <p className="mt-1 text-sm leading-6 text-foreground-muted">
        Your requested departure window and any arrival constraints.
      </p>

      <div className="mt-5 grid min-w-0 gap-4">
        <DetailCard
          label="Departure window"
          value={formatDateRange(
            scheduleWindow.earliestDeparture,
            scheduleWindow.latestDeparture,
            timezone,
          )}
          description={
            !isSameCalendarDate(
              scheduleWindow.earliestDeparture,
              scheduleWindow.latestDeparture,
              timezone,
            )
              ? 'The requested departure window spans more than one calendar date.'
              : undefined
          }
        />

        {hasTargetArrival && arrivalWindow.targetArrival ? (
          <DetailCard
            label="Arrival preference"
            value={formatDateTime(
              arrivalWindow.targetArrival,
              timezone,
            )}
            description="Your target arrival time."
          />
        ) : null}

        {hasMaximumArrival && arrivalWindow.maximumArrival ? (
          <DetailCard
            label="Latest acceptable arrival"
            value={formatDateTime(
              arrivalWindow.maximumArrival,
              timezone,
            )}
            description="The latest arrival time specified for this travel need."
          />
        ) : null}
      </div>

      <p className="mt-4 text-xs text-foreground-muted">
        Times are shown in the requested travel timezone:{' '}
        <span className="font-medium text-foreground">
          {timezone}
        </span>
        .
      </p>
    </section>
  );
}

// =============================================================================
// Demand Matching
// =============================================================================

interface DemandMatchingSectionProps {
  readonly capacity: NonNullable<MyJourneyDemand['capacity']>;
}

function DemandMatchingSection({
  capacity,
}: DemandMatchingSectionProps) {
  return (
    <section
      className="surface min-w-0 p-4 sm:p-5"
      aria-labelledby="my-journey-demand-matching-heading"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
        Travel demand
      </p>

      <h2
        id="my-journey-demand-matching-heading"
        className="mt-1 text-base font-semibold text-foreground sm:text-lg"
      >
        Your requested capacity
      </h2>

      <p className="mt-1 text-sm leading-6 text-foreground-muted">
        This Demand shows how many seats you are looking for and how
        many have already been matched.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MatchingMetric
          label="Seats requested"
          value={capacity.requestedSeats}
          suffix={
            capacity.requestedSeats === 1
              ? 'seat'
              : 'seats'
          }
          description="Your requirement for this Demand."
        />

        <MatchingMetric
          label="Matched seats"
          value={capacity.matchedSeats}
          suffix={
            capacity.matchedSeats === 1
              ? 'seat'
              : 'seats'
          }
          description="Seats currently connected to Journey supply."
        />

        <MatchingMetric
          label="Remaining"
          value={capacity.remainingSeats}
          suffix={
            capacity.remainingSeats === 1
              ? 'seat'
              : 'seats'
          }
          description="Seats still available to be matched."
        />
      </div>

      <p className="mt-4 text-xs leading-5 text-foreground-muted">
        Matching information is provided by the Journey Demand
        projection.
      </p>
    </section>
  );
}

interface MatchingMetricProps {
  readonly label: string;
  readonly value: number;
  readonly suffix: string;
  readonly description: string;
}

function MatchingMetric({
  label,
  value,
  suffix,
  description,
}: MatchingMetricProps) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-background p-3">
      <p className="text-xs font-medium text-foreground-muted">
        {label}
      </p>

      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-lg font-semibold text-foreground">
          {value}
        </span>

        <span className="text-sm text-foreground-muted">
          {suffix}
        </span>
      </div>

      <p className="mt-1 text-xs leading-5 text-foreground-muted">
        {description}
      </p>
    </div>
  );
}

// =============================================================================
// Pricing
// =============================================================================

interface PricingRequirementsSectionProps {
  readonly pricing: NonNullable<MyJourneyDemand['pricing']>;
}

function PricingRequirementsSection({
  pricing,
}: PricingRequirementsSectionProps) {
  return (
    <section
      className="surface min-w-0 p-4 sm:p-5"
      aria-labelledby="my-journey-demand-pricing-heading"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
        Price requirements
      </p>

      <h2
        id="my-journey-demand-pricing-heading"
        className="mt-1 text-base font-semibold text-foreground sm:text-lg"
      >
        What you are prepared to pay
      </h2>

      <p className="mt-1 text-sm leading-6 text-foreground-muted">
        This is the maximum amount you are prepared to pay per seat.
        It is a Demand requirement, not a confirmed Journey fare.
      </p>

      {pricing.hasMaximumPrice &&
      pricing.maximumPricePerSeat !== undefined ? (
        <div className="mt-5 grid min-w-0 gap-3 sm:grid-cols-2">
          <PriceCard
            label="Maximum price / seat"
            amount={pricing.maximumPricePerSeat}
            currency={pricing.currency}
            description="The highest amount you specified for one seat."
          />
        </div>
      ) : null}

      {pricing.isUnconstrained ? (
        <p className="mt-4 text-sm text-foreground-muted">
          No maximum price constraint has been specified for this
          Demand.
        </p>
      ) : null}

      <p className="mt-4 text-xs leading-5 text-foreground-muted">
        {pricing.currency} is the currency provided by the Demand
        projection. A final Journey fare, if a Journey is matched,
        is determined separately from this travel request.
      </p>
    </section>
  );
}

interface PriceCardProps {
  readonly label: string;
  readonly amount: number;
  readonly currency: string;
  readonly description: string;
}

function PriceCard({
  label,
  amount,
  currency,
  description,
}: PriceCardProps) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-background p-4">
      <p className="text-xs font-medium text-foreground-muted">
        {label}
      </p>

      <p className="mt-1 text-lg font-semibold text-foreground">
        {formatMoney(amount, currency)}
      </p>

      <p className="mt-1 text-xs leading-5 text-foreground-muted">
        {description}
      </p>
    </div>
  );
}

// =============================================================================
// Lifecycle
// =============================================================================

interface DemandLifecycleSectionProps {
  readonly demand: MyJourneyDemand;
}

function DemandLifecycleSection({
  demand,
}: DemandLifecycleSectionProps) {
  return (
    <section
      className="surface min-w-0 p-4 sm:p-5"
      aria-labelledby="my-journey-demand-lifecycle-heading"
    >
      <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
        Demand lifecycle
      </p>

      <h2
        id="my-journey-demand-lifecycle-heading"
        className="mt-1 text-base font-semibold text-foreground sm:text-lg"
      >
        Where this travel request stands
      </h2>

      <p className="mt-1 text-sm leading-6 text-foreground-muted">
        This is the current lifecycle state of your travel need.
      </p>

      <div className="mt-5 rounded-lg border border-border bg-background p-4">
        <div className="flex min-w-0 items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium text-foreground-muted">
              Current status
            </p>

            <p className="mt-1 text-sm font-semibold text-foreground">
              {formatStatus(demand.status)}
            </p>
          </div>

          <MyJourneyDemandStatus demand={demand} />
        </div>

        {demand.hasMatchedJourney &&
        demand.matchedJourneyPublicId ? (
          <div className="mt-4 border-t border-border pt-4">
            <p className="text-xs font-medium text-foreground-muted">
              Matched Journey
            </p>

            <p className="mt-1 break-all text-sm font-medium text-foreground">
              {demand.matchedJourneyPublicId}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}

// =============================================================================
// Generic Detail Presentation
// =============================================================================

interface DetailRowProps {
  readonly label: string;
  readonly value: ReactNode;
}

function DetailRow({
  label,
  value,
}: DetailRowProps) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-foreground-muted">
        {label}
      </p>

      <div className="mt-1 min-w-0">
        {value}
      </div>
    </div>
  );
}

interface DetailCardProps {
  readonly label: string;
  readonly value: string;
  readonly description?: string;
}

function DetailCard({
  label,
  value,
  description,
}: DetailCardProps) {
  return (
    <div className="min-w-0 rounded-lg border border-border bg-background p-4">
      <p className="text-xs font-medium text-foreground-muted">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-foreground">
        {value}
      </p>

      {description ? (
        <p className="mt-1 text-xs leading-5 text-foreground-muted">
          {description}
        </p>
      ) : null}
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

function formatDateTime(
  value: Date,
  timezone: string,
): string {
  return new Intl.DateTimeFormat('en-KE', {
    timeZone: timezone,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(value);
}

function formatDateRange(
  earliest: Date,
  latest: Date,
  timezone: string,
): string {
  const formatter = new Intl.DateTimeFormat('en-KE', {
    timeZone: timezone,
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return `${formatter.format(earliest)} – ${formatter.format(latest)}`;
}

function isSameCalendarDate(
  first: Date,
  second: Date,
  timezone: string,
): boolean {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return formatter.format(first) === formatter.format(second);
}

function formatMoney(
  amount: number,
  currency: string,
): string {
  try {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString('en-KE')}`;
  }
}