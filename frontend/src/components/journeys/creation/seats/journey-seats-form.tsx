// -----------------------------------------------------------------------------
// sisiMove — Journey Seats Form
// -----------------------------------------------------------------------------
//
// Presentation-only form for configuring Journey passenger capacity.
//
// Responsibilities:
// - Collect the total passenger-seat capacity.
// - Keep the editable seat count local to the form.
// - Emit changed values through onChange.
// - Emit the complete form value through onSubmit.
//
// This component does NOT:
// - Call the Journey API.
// - Create a JourneyCapacity entity.
// - Generate capacity identifiers.
// - Set booked seats.
// - Calculate available seats.
// - Decide booking availability.
// - Validate Journey lifecycle rules.
// - Own navigation.
//
// `bookedSeats` is intentionally excluded from the provider-facing form.
// A newly configured Journey starts with zero booked seats. Booking state is
// owned by the Journey/Booking workflow and must not be manually entered here.
// -----------------------------------------------------------------------------

'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';

import { Input } from '@/components/ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface JourneySeatsFormInitialValue {
  /**
   * Total passenger seats configured for the Journey.
   */
  totalSeats?: number;
}

export interface JourneySeatsFormSubmitValue {
  /**
   * Total passenger seats configured for the Journey.
   */
  totalSeats: number;
}

export interface JourneySeatsFormProps {
  /**
   * Existing Journey capacity used to initialise the form.
   */
  initialValue?: JourneySeatsFormInitialValue;

  /**
   * Disables the form while the workflow is persisting.
   */
  disabled?: boolean;

  /**
   * Called whenever the user changes the seat count.
   */
  onChange?: (
    value: Partial<JourneySeatsFormSubmitValue>,
  ) => void;

  /**
   * Called when the complete form is submitted.
   */
  onSubmit?: (
    value: JourneySeatsFormSubmitValue,
  ) => void | Promise<void>;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function toInputValue(
  value?: number,
): string {
  if (
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return '';
  }

  return String(value);
}

function parseSeatCount(
  value: string,
): number | null {
  if (!value.trim()) {
    return null;
  }

  const parsed = Number(value);

  if (
    !Number.isInteger(parsed) ||
    parsed <= 0
  ) {
    return null;
  }

  return parsed;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneySeatsForm({
  initialValue,
  disabled = false,
  onChange,
  onSubmit,
}: JourneySeatsFormProps) {
  const [totalSeats, setTotalSeats] =
    useState(() =>
      toInputValue(
        initialValue?.totalSeats,
      ),
    );

  function handleTotalSeatsChange(
    value: string,
  ) {
    setTotalSeats(value);

    const parsed =
      parseSeatCount(value);

    if (parsed === null) {
      onChange?.({
        totalSeats: undefined,
      });

      return;
    }

    onChange?.({
      totalSeats: parsed,
    });
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (disabled) {
      return;
    }

    const parsed =
      parseSeatCount(totalSeats);

    if (parsed === null) {
      return;
    }

    await onSubmit?.({
      totalSeats: parsed,
    });
  }

  const hasValidSeatCount =
    parseSeatCount(totalSeats) !== null;

  return (
    <form
      id="journey-seats-form"
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <Input
        id="journey-seats-total"
        label="Passenger seats"
        helperText="Set the number of passenger seats available on this Journey."
        type="number"
        name="totalSeats"
        min={1}
        step={1}
        inputMode="numeric"
        value={totalSeats}
        onChange={(event) =>
          handleTotalSeatsChange(
            event.target.value,
          )
        }
        disabled={disabled}
        required
      />

      <button
        type="submit"
        disabled={
          disabled ||
          !hasValidSeatCount
        }
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      >
        Save seats
      </button>
    </form>
  );
}