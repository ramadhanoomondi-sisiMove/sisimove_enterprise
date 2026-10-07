// src/features/journey-booking/components/create/journey-booking-snapshot.tsx

// -----------------------------------------------------------------------------
// sisiMove — Journey Booking Snapshot
// -----------------------------------------------------------------------------
//
// Step 2 of the Journey Booking workflow.
//
// Displays the Journey information that will become the historical booking
// snapshot and requires the passenger to explicitly accept it.
//
// Presentation only:
// - No API calls
// - No snapshot creation
// - No pricing
// - No payment
//
// The parent JourneyBookingForm owns persistence and workflow orchestration.
// -----------------------------------------------------------------------------

"use client";

import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneyBookingSnapshotValues {
  readonly originName: string;
  readonly destinationName: string;
  readonly departureAt: string;
  readonly arrivalAt?: string | null;
  readonly timezone: string;
  readonly vehicleMake?: string | null;
  readonly vehicleModel?: string | null;
  readonly vehicleYear?: number | null;
  readonly vehicleColor?: string | null;
  readonly vehicleRegistration?: string | null;
}

export interface JourneyBookingSnapshotProps {
  readonly values: JourneyBookingSnapshotValues;
  readonly accepted: boolean;
  readonly onAcceptedChange: (accepted: boolean) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function formatDateTime(
  value: string,
  timezone: string,
): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  try {
    return new Intl.DateTimeFormat("en-KE", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: timezone,
    }).format(date);
  } catch {
    return value;
  }
}

function getVehicleName(
  values: JourneyBookingSnapshotValues,
): string | null {
  const parts = [
    values.vehicleMake,
    values.vehicleModel,
    values.vehicleYear !== null &&
    values.vehicleYear !== undefined
      ? String(values.vehicleYear)
      : null,
  ].filter(
    (value): value is string =>
      typeof value === "string" &&
      value.trim().length > 0,
  );

  return parts.length > 0 ? parts.join(" ") : null;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyBookingSnapshot({
  values,
  accepted,
  onAcceptedChange,
  disabled = false,
  className,
}: JourneyBookingSnapshotProps) {
  const vehicleName = getVehicleName(values);

  return (
    <section
      aria-labelledby="journey-booking-snapshot-title"
      className={cn("space-y-6", className)}
    >
      {/* ------------------------------------------------------------------- */}
      {/* Header                                                              */}
      {/* ------------------------------------------------------------------- */}

      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--foreground-muted)]">
          Step 2
        </p>

        <h2
          id="journey-booking-snapshot-title"
          className="mt-2 text-xl font-bold tracking-tight text-[var(--foreground)] sm:text-2xl"
        >
          Review your journey
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">
          Check the journey details below before continuing.
          These details will be recorded as part of your booking.
        </p>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Journey Card                                                        */}
      {/* ------------------------------------------------------------------- */}

      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
        {/* Route */}

        <div className="border-b border-[var(--border-subtle)] p-5 sm:p-6">
          <div className="flex items-start gap-4">
            <div
              aria-hidden="true"
              className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand-soft)] text-[var(--brand)]"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="size-5"
              >
                <path
                  d="M5 4.5h10M5 10h7M5 15.5h10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="m13 7 3 3-3 3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-[var(--foreground-muted)]">
                Route
              </p>

              <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                <p className="font-semibold text-[var(--foreground)]">
                  {values.originName}
                </p>

                <span
                  aria-hidden="true"
                  className="hidden text-[var(--foreground-subtle)] sm:inline"
                >
                  →
                </span>

                <p className="font-semibold text-[var(--foreground)]">
                  {values.destinationName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Journey Details */}

        <div className="grid gap-px bg-[var(--border-subtle)] sm:grid-cols-2">
          <div className="bg-[var(--surface)] p-5 sm:p-6">
            <p className="text-xs font-medium text-[var(--foreground-muted)]">
              Departure
            </p>

            <p className="mt-1 font-semibold text-[var(--foreground)]">
              {formatDateTime(
                values.departureAt,
                values.timezone,
              )}
            </p>

            <p className="mt-1 text-xs text-[var(--foreground-subtle)]">
              {values.timezone}
            </p>
          </div>

          <div className="bg-[var(--surface)] p-5 sm:p-6">
            <p className="text-xs font-medium text-[var(--foreground-muted)]">
              Arrival
            </p>

            <p className="mt-1 font-semibold text-[var(--foreground)]">
              {values.arrivalAt
                ? formatDateTime(
                    values.arrivalAt,
                    values.timezone,
                  )
                : "Not specified"}
            </p>
          </div>
        </div>

        {/* Vehicle */}

        {vehicleName !== null && (
          <div className="border-t border-[var(--border-subtle)] p-5 sm:p-6">
            <p className="text-xs font-medium text-[var(--foreground-muted)]">
              Vehicle
            </p>

            <p className="mt-1 font-semibold text-[var(--foreground)]">
              {vehicleName}
            </p>

            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-[var(--foreground-muted)]">
              {values.vehicleColor ? (
                <span>{values.vehicleColor}</span>
              ) : null}

              {values.vehicleRegistration ? (
                <span>
                  {values.vehicleRegistration}
                </span>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Acceptance                                                         */}
      {/* ------------------------------------------------------------------- */}

      <label
        className={cn(
          "flex cursor-pointer items-start gap-3 rounded-[var(--radius-lg)]",
          "border p-4 transition-colors sm:p-5",
          accepted
            ? "border-[var(--brand)] bg-[var(--brand-soft)]"
            : "border-[var(--border)] bg-[var(--surface)]",
          disabled && "cursor-not-allowed opacity-60",
        )}
      >
        <input
          type="checkbox"
          checked={accepted}
          onChange={(event) =>
            onAcceptedChange(event.target.checked)
          }
          disabled={disabled}
          className="mt-0.5 size-4 shrink-0 accent-[var(--brand)]"
        />

        <span className="min-w-0">
          <span className="block text-sm font-semibold text-[var(--foreground)]">
            I accept these journey details
          </span>

          <span className="mt-1 block text-sm leading-5 text-[var(--foreground-secondary)]">
            I have reviewed the route, departure details,
            and vehicle information and want to continue
            with this booking.
          </span>
        </span>
      </label>
    </section>
  );
}