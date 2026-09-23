// -----------------------------------------------------------------------------
// sisiMove — Journey Vehicle Form
// -----------------------------------------------------------------------------
//
// Vehicle selection form for journey creation.
//
// Architectural rule:
// - Vehicles belong to the authenticated provider's controlled asset/profile
//   data.
// - Providers select an existing vehicle.
// - This component does not create or edit vehicle records.
// - Backend remains authoritative and must validate ownership and availability.
//
// Responsibilities:
// - Present available vehicles.
// - Capture the provider's vehicle selection.
// - Display useful vehicle identification details.
// - Delegate submission to the parent.
//
// Non-responsibilities:
// - No API calls.
// - No vehicle catalogue fetching.
// - No router usage.
// - No persistence.
// - No vehicle mutation.
// - No ownership enforcement.
// - No backend business-rule enforcement.
//
// Backend write operation:
// - POST /journeys/:journeyPublicId/vehicle
//     { vehiclePublicId }
//
// -----------------------------------------------------------------------------

'use client';

import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select } from '@/components/ui/select';

// ----------------------------------------------------------------------------
// Types
// ----------------------------------------------------------------------------

export interface JourneyVehicleOption {
  /**
   * Public identifier of the provider's vehicle.
   */
  publicId: string;

  /**
   * Vehicle manufacturer.
   */
  make: string;

  /**
   * Vehicle model.
   */
  model: string;

  /**
   * Optional model year.
   */
  year: number | null;

  /**
   * Optional vehicle colour.
   */
  color: string | null;

  /**
   * Optional registration displayed according to the application's privacy
   * policy.
   */
  registration: string | null;
}

export interface JourneyVehicleFormValue {
  /**
   * Selected vehicle public identifier.
   */
  vehiclePublicId: string;
}

export interface JourneyVehicleFormProps {
  /**
   * Vehicles available to the authenticated provider.
   */
  vehicles: readonly JourneyVehicleOption[];

  /**
   * Existing vehicle selection, useful when editing or resuming a draft.
   */
  defaultValue?: JourneyVehicleFormValue;

  /**
   * Called after the provider submits a valid selection.
   */
  onSubmit: (
    value: JourneyVehicleFormValue,
  ) => void | Promise<void>;

  /**
   * Indicates that the parent is persisting the selection.
   */
  isLoading?: boolean;

  /**
   * Optional error supplied by the parent.
   */
  error?: string | null;
}

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

function getVehicleLabel(
  vehicle: JourneyVehicleOption,
): string {
  return [
    vehicle.make,
    vehicle.model,
    vehicle.year
      ? `(${vehicle.year})`
      : null,
  ]
    .filter(Boolean)
    .join(' ');
}

// ----------------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------------

export function JourneyVehicleForm({
  vehicles,
  defaultValue,
  onSubmit,
  isLoading = false,
  error = null,
}: JourneyVehicleFormProps) {
  // ---------------------------------------------------------------------------
  // Local selection state
  // ---------------------------------------------------------------------------

  const [vehiclePublicId, setVehiclePublicId] =
    useState(
      defaultValue?.vehiclePublicId ?? '',
    );

  // ---------------------------------------------------------------------------
  // Resolve selected vehicle from the supplied collection.
  // ---------------------------------------------------------------------------

  const selectedVehicle =
    vehicles.find(
      (vehicle) =>
        vehicle.publicId ===
        vehiclePublicId,
    ) ?? null;

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (
      !vehiclePublicId ||
      selectedVehicle === null ||
      isLoading
    ) {
      return;
    }

    await onSubmit({
      vehiclePublicId,
    });
  }

  // ---------------------------------------------------------------------------
  // Derived UI state
  // ---------------------------------------------------------------------------

  const hasVehicles =
    vehicles.length > 0;

  const canSubmit =
    Boolean(vehiclePublicId) &&
    selectedVehicle !== null &&
    !isLoading;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Vehicle selection                                                    */}
      {/* ------------------------------------------------------------------ */}

      <div className="space-y-2">
        <div>
          <label
            htmlFor="journey-vehicle"
            className="text-sm font-semibold text-[var(--foreground)]"
          >
            Journey vehicle
          </label>

          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Select the vehicle you will use for this journey.
          </p>
        </div>

        <Select
          id="journey-vehicle"
          value={vehiclePublicId}
          onChange={(event) =>
            setVehiclePublicId(
              event.target.value,
            )
          }
          disabled={
            isLoading ||
            !hasVehicles
          }
        >
          <option value="">
            {!hasVehicles
              ? 'No vehicles available'
              : 'Select a vehicle'}
          </option>

          {vehicles.map(
            (vehicle) => (
              <option
                key={vehicle.publicId}
                value={
                  vehicle.publicId
                }
              >
                {getVehicleLabel(vehicle)}
              </option>
            ),
          )}
        </Select>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Selected vehicle summary                                             */}
      {/* ------------------------------------------------------------------ */}

      {selectedVehicle ? (
        <Card className="space-y-3 p-4 sm:p-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
              Vehicle
            </p>

            <p className="mt-1 text-base font-semibold text-[var(--foreground)]">
              {getVehicleLabel(
                selectedVehicle,
              )}
            </p>
          </div>

          {selectedVehicle.color ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Colour
              </p>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                {selectedVehicle.color}
              </p>
            </div>
          ) : null}

          {selectedVehicle.registration ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--foreground-muted)]">
                Registration
              </p>

              <p className="mt-1 text-sm text-[var(--foreground-secondary)]">
                {selectedVehicle.registration}
              </p>
            </div>
          ) : null}
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
      {/* Form action                                                          */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex justify-end border-t border-[var(--border-subtle)] pt-4">
        <Button
          type="submit"
          disabled={!canSubmit}
        >
          {isLoading
            ? 'Saving…'
            : 'Continue'}
        </Button>
      </div>
    </form>
  );
}

