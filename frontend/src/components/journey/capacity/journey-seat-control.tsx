// -----------------------------------------------------------------------------
// sisiMove — Journey Seat Control
// -----------------------------------------------------------------------------
//
// Compact controlled control for editing Journey total seats.
//
// Responsibilities:
// - Present the current total-seat value.
// - Allow the user to increment or decrement the value.
// - Emit a valid primitive integer value.
//
// This component does NOT:
// - calculate available seats;
// - modify booked seats;
// - enforce Journey domain capacity rules;
// - call the API;
// - persist Journey state.
// -----------------------------------------------------------------------------

import type { ChangeEvent } from "react";

import { Button, Input } from "@/components/ui";
import { cn } from "@/foundation/utils/cn";

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneySeatControlProps {
  readonly value: number;

  readonly onChange: (value: number) => void;

  readonly disabled?: boolean;

  readonly label?: string;

  readonly helperText?: string;

  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneySeatControl({
  value,
  onChange,
  disabled = false,
  label = "Total seats",
  helperText,
  className,
}: JourneySeatControlProps) {
  function decrement(): void {
    if (value <= 0) {
      return;
    }

    onChange(value - 1);
  }

  function increment(): void {
    onChange(value + 1);
  }

  function handleInputChange(
    event: ChangeEvent<HTMLInputElement>,
  ): void {
    const rawValue = event.target.value;

    if (rawValue === "") {
      return;
    }

    const nextValue = Number(rawValue);

    if (!Number.isInteger(nextValue) || nextValue < 0) {
      return;
    }

    onChange(nextValue);
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className={cn("flex", "items-end", "gap-2")}>
        <div className="min-w-0 flex-1">
          <Input
            label={label}
            type="number"
            min={0}
            step={1}
            inputMode="numeric"
            value={String(value)}
            onChange={handleInputChange}
            disabled={disabled}
          />
        </div>

        <div
          className={cn(
            "flex",
            "shrink-0",
            "gap-2",
            "pb-0.5",
          )}
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label="Decrease total seats"
            disabled={disabled || value <= 0}
            onClick={decrement}
          >
            −
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            aria-label="Increase total seats"
            disabled={disabled}
            onClick={increment}
          >
            +
          </Button>
        </div>
      </div>

      {helperText !== undefined && helperText.length > 0 && (
        <p className="text-xs leading-5 text-[var(--foreground-muted)]">
          {helperText}
        </p>
      )}
    </div>
  );
}