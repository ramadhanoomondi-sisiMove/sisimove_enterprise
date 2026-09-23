// -----------------------------------------------------------------------------
// sisiMove — Journey Review
// -----------------------------------------------------------------------------
//
// Final review presentation for journey creation.
//
// Responsibilities:
// - Present the complete journey configuration before publication.
// - Group route, schedule, vehicle, capacity, pricing, and preferences.
// - Allow the parent to navigate back to individual creation steps.
// - Delegate the final publication action to the parent.
//
// Non-responsibilities:
// - No API calls.
// - No data fetching.
// - No persistence.
// - No publication logic.
// - No business-rule enforcement.
// - No router usage.
//
// The parent/container owns the creation workflow and decides how the final
// confirmation is persisted or published.
// -----------------------------------------------------------------------------

'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { JourneyReviewSection } from './journey-review-section';

// =============================================================================
// Types
// =============================================================================

export interface JourneyReviewRoute {
  originName: string;
  destinationName: string;
  waypointNames: readonly string[];
}

export interface JourneyReviewSchedule {
  departureAt: string;
  arrivalAt: string | null;
  timezone: string;
}

export interface JourneyReviewVehicle {
  make: string;
  model: string;
  year: number | null;
  color: string | null;
  registration: string | null;
}

export interface JourneyReviewCapacity {
  totalSeats: number;
}

export interface JourneyReviewPricing {
  amount: number;
  currency: string;
}

export interface JourneyReviewPreferences {
  smoking: string;
  pets: string;
  luggage: string;
  conversation: string;
  music: string;
}

export interface JourneyReviewProps {
  route: JourneyReviewRoute | null;
  schedule: JourneyReviewSchedule | null;
  vehicle: JourneyReviewVehicle | null;
  capacity: JourneyReviewCapacity | null;
  pricing: JourneyReviewPricing | null;
  preferences: JourneyReviewPreferences | null;

  /**
   * Called when the provider wants to edit the route step.
   */
  onEditRoute?: () => void;

  /**
   * Called when the provider wants to edit the schedule step.
   */
  onEditSchedule?: () => void;

  /**
   * Called when the provider wants to edit the vehicle step.
   */
  onEditVehicle?: () => void;

  /**
   * Called when the provider wants to edit the capacity step.
   */
  onEditCapacity?: () => void;

  /**
   * Called when the provider wants to edit the pricing step.
   */
  onEditPricing?: () => void;

  /**
   * Called when the provider wants to edit the preferences step.
   */
  onEditPreferences?: () => void;

  /**
   * Called when the provider confirms the reviewed journey.
   *
   * The parent owns the actual publication operation.
   */
  onConfirm: () => void | Promise<void>;

  /**
   * Indicates that the final action is currently being persisted.
   */
  isLoading?: boolean;

  /**
   * Optional error supplied by the parent.
   */
  error?: string | null;
}

// =============================================================================
// Helpers
// =============================================================================

function formatDateTime(
  value: string,
  timezone: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: timezone,
    }).format(date);
  } catch {
    return value;
  }
}

function formatAmount(
  amount: number,
  currency: string,
): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

// =============================================================================
// Component
// =============================================================================

export function JourneyReview({
  route,
  schedule,
  vehicle,
  capacity,
  pricing,
  preferences,
  onEditRoute,
  onEditSchedule,
  onEditVehicle,
  onEditCapacity,
  onEditPricing,
  onEditPreferences,
  onConfirm,
  isLoading = false,
  error = null,
}: JourneyReviewProps) {
  // ---------------------------------------------------------------------------
  // Final review validity
  //
  // This is only a presentation-level completeness check.
  // Backend/application validation remains authoritative.
  // ---------------------------------------------------------------------------

  const isComplete =
    route !== null &&
    schedule !== null &&
    vehicle !== null &&
    capacity !== null &&
    pricing !== null &&
    preferences !== null;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-5">
      {/* ------------------------------------------------------------------ */}
      {/* Review heading                                                       */}
      {/* ------------------------------------------------------------------ */}

      <div>
        <h2 className="text-lg font-semibold text-[var(--foreground)]">
          Review your journey
        </h2>

        <p className="mt-1 text-sm text-[var(--foreground-muted)]">
          Check the journey details before publishing.
        </p>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Route                                                                */}
      {/* ------------------------------------------------------------------ */}

      {route ? (
        <JourneyReviewSection
          title="Route"
          description="The controlled sisiMove corridor and selected stops."
          onEdit={onEditRoute}
        >
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Journey
              </p>

              <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                {route.originName} → {route.destinationName}
              </p>
            </div>

            {route.waypointNames.length > 0 ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                  Stops
                </p>

                <div className="mt-2 flex flex-wrap gap-2">
                  {route.waypointNames.map(
                    (name) => (
                      <span
                        key={name}
                        className="rounded-full bg-[var(--background-subtle)] px-3 py-1 text-xs text-[var(--foreground-secondary)]"
                      >
                        {name}
                      </span>
                    ),
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-[var(--foreground-muted)]">
                No additional stops selected.
              </p>
            )}
          </div>
        </JourneyReviewSection>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Schedule                                                             */}
      {/* ------------------------------------------------------------------ */}

      {schedule ? (
        <JourneyReviewSection
          title="Schedule"
          description="When the journey is planned to depart and arrive."
          onEdit={onEditSchedule}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Departure
              </p>

              <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                {formatDateTime(
                  schedule.departureAt,
                  schedule.timezone,
                )}
              </p>
            </div>

            {schedule.arrivalAt ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                  Expected arrival
                </p>

                <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                  {formatDateTime(
                    schedule.arrivalAt,
                    schedule.timezone,
                  )}
                </p>
              </div>
            ) : null}

            <div className="sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Timezone
              </p>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                {schedule.timezone}
              </p>
            </div>
          </div>
        </JourneyReviewSection>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Vehicle                                                              */}
      {/* ------------------------------------------------------------------ */}

      {vehicle ? (
        <JourneyReviewSection
          title="Vehicle"
          description="The vehicle selected for this journey."
          onEdit={onEditVehicle}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Vehicle
              </p>

              <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">
                {vehicle.make} {vehicle.model}
                {vehicle.year
                  ? ` (${vehicle.year})`
                  : ''}
              </p>
            </div>

            {vehicle.color ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                  Colour
                </p>

                <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                  {vehicle.color}
                </p>
              </div>
            ) : null}

            {vehicle.registration ? (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                  Registration
                </p>

                <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                  {vehicle.registration}
                </p>
              </div>
            ) : null}
          </div>
        </JourneyReviewSection>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Capacity                                                             */}
      {/* ------------------------------------------------------------------ */}

      {capacity ? (
        <JourneyReviewSection
          title="Passenger capacity"
          description="The number of passenger seats available."
          onEdit={onEditCapacity}
        >
          <p className="text-base font-semibold text-[var(--foreground)]">
            {capacity.totalSeats}{' '}
            {capacity.totalSeats === 1
              ? 'passenger seat'
              : 'passenger seats'}
          </p>
        </JourneyReviewSection>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Pricing                                                              */}
      {/* ------------------------------------------------------------------ */}

      {pricing ? (
        <JourneyReviewSection
          title="Passenger contribution"
          description="The contribution toward the shared journey cost."
          onEdit={onEditPricing}
        >
          <p className="text-lg font-semibold text-[var(--foreground)]">
            {formatAmount(
              pricing.amount,
              pricing.currency,
            )}
          </p>
        </JourneyReviewSection>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Preferences                                                          */}
      {/* ------------------------------------------------------------------ */}

      {preferences ? (
        <JourneyReviewSection
          title="Journey preferences"
          description="The travel conditions passengers will see."
          onEdit={onEditPreferences}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Smoking
              </p>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                {preferences.smoking}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Pets
              </p>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                {preferences.pets}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Luggage
              </p>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                {preferences.luggage}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Conversation
              </p>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                {preferences.conversation}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Music
              </p>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                {preferences.music}
              </p>
            </div>
          </div>
        </JourneyReviewSection>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Incomplete configuration                                             */}
      {/* ------------------------------------------------------------------ */}

      {!isComplete ? (
        <Card className="border-[var(--warning)] bg-[var(--warning-soft)] p-4">
          <p className="text-sm font-medium text-[var(--foreground)]">
            Complete all journey details before publishing.
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Some required journey information is still missing.
          </p>
        </Card>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Parent/application error                                             */}
      {/* ------------------------------------------------------------------ */}

      {error ? (
        <p
          role="alert"
          className="rounded-lg bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]"
        >
          {error}
        </p>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Confirmation                                                         */}
      {/* ------------------------------------------------------------------ */}

      <Card className="space-y-4 border-[var(--border-subtle)] bg-[var(--background-subtle)] p-4 sm:p-5">
        <div>
          <p className="text-sm font-semibold text-[var(--foreground)]">
            Ready to publish?
          </p>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Review the details above. Publishing will still be
            subject to the application&apos;s validation and
            lifecycle rules.
          </p>
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            onClick={() => void onConfirm()}
            disabled={
              !isComplete ||
              isLoading
            }
          >
            {isLoading
              ? 'Publishing…'
              : 'Publish journey'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
