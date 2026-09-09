// -----------------------------------------------------------------------------
// sisiMove — Divider
// -----------------------------------------------------------------------------
//
// Reusable divider primitive for the sisiMove design system.
//
// Responsibilities:
// - Separate related content visually
// - Support horizontal and vertical orientations
// - Support optional accessible labeling
// - Remain domain-agnostic
//
// -----------------------------------------------------------------------------

import type {
  HTMLAttributes,
} from 'react';

import { cn } from '../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type DividerOrientation =
  | 'horizontal'
  | 'vertical';

export interface DividerProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * Divider orientation.
   */
  orientation?: DividerOrientation;

  /**
   * Optional visible label displayed in the divider.
   *
   * Labels are intended for horizontal dividers.
   */
  label?: string;
}

// -----------------------------------------------------------------------------
// Divider
// -----------------------------------------------------------------------------

export function Divider({
  orientation = 'horizontal',
  label,
  className,
  role = 'separator',
  ...props
}: DividerProps) {
  const isHorizontal =
    orientation === 'horizontal';

  if (!isHorizontal) {
    return (
      <div
        {...props}
        role={role}
        aria-orientation="vertical"
        className={cn(
          'w-px',
          'self-stretch',
          'bg-[var(--border)]',
          className,
        )}
      />
    );
  }

  if (!label) {
    return (
      <div
        {...props}
        role={role}
        aria-orientation="horizontal"
        className={cn(
          'h-px',
          'w-full',
          'bg-[var(--border)]',
          className,
        )}
      />
    );
  }

  return (
    <div
      {...props}
      role={role}
      aria-orientation="horizontal"
      className={cn(
        'flex',
        'w-full',
        'items-center',
        'gap-3',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="h-px flex-1 bg-[var(--border)]"
      />

      <span className="shrink-0 text-xs font-medium text-[var(--foreground-muted)]">
        {label}
      </span>

      <span
        aria-hidden="true"
        className="h-px flex-1 bg-[var(--border)]"
      />
    </div>
  );
}