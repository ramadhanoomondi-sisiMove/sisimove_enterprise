// -----------------------------------------------------------------------------
// sisiMove — Skeleton
// -----------------------------------------------------------------------------
//
// Reusable loading placeholder for the sisiMove design system.
//
// Responsibilities:
// - Represent loading content without layout jumps
// - Support arbitrary dimensions through className
// - Support rounded and rectangular shapes
// - Respect reduced-motion preferences
//
// The component remains domain-agnostic.
// -----------------------------------------------------------------------------

import type {
  HTMLAttributes,
} from 'react';

import { cn } from '../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type SkeletonRadius =
  | 'none'
  | 'sm'
  | 'md'
  | 'lg'
  | 'full';

export interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * Controls the placeholder's corner radius.
   */
  radius?: SkeletonRadius;
}

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------

const radiusClasses: Record<SkeletonRadius, string> = {
  none: 'rounded-none',
  sm: 'rounded-[var(--radius-sm)]',
  md: 'rounded-[var(--radius-md)]',
  lg: 'rounded-[var(--radius-lg)]',
  full: 'rounded-[var(--radius-full)]',
};

// -----------------------------------------------------------------------------
// Skeleton
// -----------------------------------------------------------------------------

export function Skeleton({
  radius = 'md',
  className,
  role = 'status',
  'aria-label': ariaLabel = 'Loading',
  ...props
}: SkeletonProps) {
  return (
    <div
      {...props}
      role={role}
      aria-label={ariaLabel}
      aria-busy="true"
      className={cn(
        'animate-pulse',
        'bg-[var(--background-muted)]',
        radiusClasses[radius],
        className,
      )}
    />
  );
}