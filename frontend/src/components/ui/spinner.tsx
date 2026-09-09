// -----------------------------------------------------------------------------
// sisiMove — Spinner
// -----------------------------------------------------------------------------
//
// Reusable loading spinner for the sisiMove design system.
//
// Responsibilities:
// - Indicate an active loading state
// - Support semantic sizes
// - Provide accessible status text
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

export type SpinnerSize =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg';

export interface SpinnerProps
  extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Spinner size.
   */
  size?: SpinnerSize;

  /**
   * Accessible loading label.
   */
  label?: string;
}

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------

const sizeClasses: Record<SpinnerSize, string> = {
  xs: 'h-3 w-3 border',
  sm: 'h-4 w-4 border-2',
  md: 'h-5 w-5 border-2',
  lg: 'h-6 w-6 border-2',
};

// -----------------------------------------------------------------------------
// Spinner
// -----------------------------------------------------------------------------

export function Spinner({
  size = 'md',
  label = 'Loading',
  className,
  ...props
}: SpinnerProps) {
  return (
    <span
      {...props}
      role="status"
      aria-label={label}
      className={cn(
        'inline-block',
        'shrink-0',
        'animate-spin',
        'rounded-[var(--radius-full)]',
        'border-[var(--border)]',
        'border-t-[var(--brand)]',
        sizeClasses[size],
        className,
      )}
    />
  );
}