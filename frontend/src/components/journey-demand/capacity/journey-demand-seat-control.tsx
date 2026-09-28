// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Seat Control
// -----------------------------------------------------------------------------
//
// Controlled numeric control for editing requested Journey Demand seats.
//
// Architecture:
// - Presentation/input component only.
// - Does not fetch data.
// - Does not mutate backend state.
// - Does not call API hooks.
// - Emits the requested numeric value through onChange.
// - Does not decide backend capacity limits.
//
// The parent capacity editor owns validation/persistence policy.
//
// -----------------------------------------------------------------------------

'use client';

import type { ChangeEvent } from 'react';

import { cn } from '@/foundation';

export interface JourneyDemandSeatControlProps {
  readonly value: number;
  readonly onChange?: (value: number) => void;
  readonly min?: number;
  readonly max?: number;
  readonly disabled?: boolean;
  readonly id?: string;
  readonly label?: string;
  readonly className?: string;
}

export function JourneyDemandSeatControl({
  value,
  onChange,
  min = 1,
  max,
  disabled = false,
  id = 'journey-demand-requested-seats',
  label = 'Seats requested',
  className,
}: JourneyDemandSeatControlProps) {
  const handleChange = (
    event: ChangeEvent<HTMLInputElement>,
  ): void => {
    const nextValue = Number(event.target.value);

    if (!Number.isFinite(nextValue)) {
      return;
    }

    onChange?.(nextValue);
  };

  return (
    <label
      htmlFor={id}
      className={cn(
        'grid min-w-0 gap-1.5',
        className,
      )}
    >
      <span className="text-sm font-medium text-foreground">
        {label}
      </span>

      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        {...(max !== undefined ? { max } : {})}
        step={1}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={cn(
          'min-h-10 w-full rounded-[var(--radius-md)]',
          'border border-[var(--border)]',
          'bg-[var(--background)]',
          'px-3 text-sm text-foreground',
          'outline-none transition-colors',
          'focus:border-[var(--brand)]',
          'focus:ring-2 focus:ring-[var(--brand-soft)]',
          'disabled:cursor-not-allowed',
          'disabled:bg-[var(--background-muted)]',
        )}
      />
    </label>
  );
}

