// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Seat Control
// -----------------------------------------------------------------------------
//
// Controlled seat quantity control for editing requested Journey Demand seats.
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
  const canDecrease = value > min;
  const canIncrease = max === undefined || value < max;

  const handleDecrease = (): void => {
    if (disabled || !canDecrease) {
      return;
    }

    onChange?.(Math.max(min, value - 1));
  };

  const handleIncrease = (): void => {
    if (disabled || !canIncrease) {
      return;
    }

    onChange?.(
      max === undefined
        ? value + 1
        : Math.min(max, value + 1),
    );
  };

  return (
    <div
      className={cn(
        'grid min-w-0 gap-1.5',
        className,
      )}
    >
      <label
        htmlFor={id}
        className="text-sm font-medium text-foreground"
      >
        {label}
      </label>

      <div
        className={cn(
          'flex min-h-10 w-full items-center overflow-hidden',
          'rounded-[var(--radius-md)]',
          'border border-[var(--border)]',
          'bg-[var(--background)]',
        )}
      >
        <button
          type="button"
          aria-label="Decrease seats requested"
          onClick={handleDecrease}
          disabled={disabled || !canDecrease}
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center',
            'text-lg font-medium text-foreground',
            'transition-colors',
            'hover:bg-[var(--background-muted)]',
            'focus:outline-none',
            'focus:ring-2 focus:ring-inset',
            'focus:ring-[var(--brand-soft)]',
            'disabled:cursor-not-allowed',
            'disabled:opacity-40',
          )}
        >
          −
        </button>

        <output
          id={id}
          aria-live="polite"
          className={cn(
            'flex min-w-0 flex-1 items-center justify-center',
            'px-3 text-sm font-medium text-foreground',
          )}
        >
          {value}
        </output>

        <button
          type="button"
          aria-label="Increase seats requested"
          onClick={handleIncrease}
          disabled={disabled || !canIncrease}
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center',
            'text-lg font-medium text-foreground',
            'transition-colors',
            'hover:bg-[var(--background-muted)]',
            'focus:outline-none',
            'focus:ring-2 focus:ring-inset',
            'focus:ring-[var(--brand-soft)]',
            'disabled:cursor-not-allowed',
            'disabled:opacity-40',
          )}
        >
          +
        </button>
      </div>
    </div>
  );
}