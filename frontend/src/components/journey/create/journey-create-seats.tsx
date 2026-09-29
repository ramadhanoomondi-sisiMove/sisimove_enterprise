// -----------------------------------------------------------------------------
// sisiMove — Journey Create Seats
// -----------------------------------------------------------------------------
//
// Presentation-only creation step for collecting Journey capacity.
//
// Responsibilities:
// - collect the total number of passenger seats;
// - emit the primitive numeric value through onChange;
// - render the existing JourneySeatControl.
//
// The parent JourneyCreateForm owns:
// - capacity validation;
// - conversion into the AttachJourneyCapacity command;
// - attachJourneyCapacity();
// - persistence errors;
// - navigation to the next creation step.
//
// The frontend does NOT collect:
// - bookedSeats — initialized/managed by the backend;
// - availableSeats — derived by the backend.
//
// This component therefore mirrors the actual creation command rather than
// exposing persistence-derived capacity fields.
// -----------------------------------------------------------------------------

import { cn } from "@/foundation/utils/cn";
import { JourneySeatControl } from "../capacity/journey-seat-control";

export interface JourneyCreateSeatsProps {
  readonly value: number;
  readonly onChange: (value: number) => void;
  readonly disabled?: boolean;
  readonly className?: string;
}

export function JourneyCreateSeats({
  value,
  onChange,
  disabled = false,
  className,
}: JourneyCreateSeatsProps) {
  return (
    <section
      aria-labelledby="journey-create-seats-title"
      className={cn("space-y-6", className)}
    >
      <div className="space-y-1">
        <h2
          id="journey-create-seats-title"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          How many seats are available?
        </h2>

        <p className="text-sm text-[var(--foreground-secondary)]">
          Set the total number of passenger seats you are making available for
          this journey.
        </p>
      </div>

      <div className="surface-brand p-5">
        <JourneySeatControl
          label="Passenger seats"
          value={value}
          onChange={onChange}
          disabled={disabled}
          helperText="The number of seats passengers can book on this journey."
        />
      </div>
    </section>
  );
}