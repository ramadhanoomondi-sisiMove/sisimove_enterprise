// -----------------------------------------------------------------------------
// sisiMove — Card
// -----------------------------------------------------------------------------
//
// Reusable surface/card primitive for the sisiMove design system.
//
// Responsibilities:
// - Provide consistent surface styling
// - Support semantic visual variants
// - Support optional padding and interaction states
// - Remain domain-agnostic
//
// -----------------------------------------------------------------------------

import type {
  HTMLAttributes,
  ReactNode,
} from 'react';

import { cn } from '../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type CardVariant =
  | 'default'
  | 'muted'
  | 'outlined';

export type CardPadding =
  | 'none'
  | 'sm'
  | 'md'
  | 'lg';

export interface CardProps
  extends HTMLAttributes<HTMLDivElement> {
  /**
   * Visual surface variant.
   */
  variant?: CardVariant;

  /**
   * Internal card spacing.
   */
  padding?: CardPadding;

  /**
   * Optional content rendered at the top of the card.
   */
  header?: ReactNode;

  /**
   * Optional content rendered at the bottom of the card.
   */
  footer?: ReactNode;

  /**
   * Makes the card visually interactive.
   *
   * This only changes presentation. Navigation and actions remain
   * the responsibility of the consuming component.
   */
  interactive?: boolean;

  /**
   * Card content.
   */
  children: ReactNode;
}

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------

const variantClasses: Record<CardVariant, string> = {
  default: [
    'border',
    'border-[var(--border)]',
    'bg-[var(--surface)]',
  ].join(' '),

  muted: [
    'border',
    'border-[var(--border-subtle)]',
    'bg-[var(--background-muted)]',
  ].join(' '),

  outlined: [
    'border',
    'border-[var(--border-strong)]',
    'bg-transparent',
  ].join(' '),
};

const paddingClasses: Record<CardPadding, string> = {
  none: 'p-0',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

// -----------------------------------------------------------------------------
// Card
// -----------------------------------------------------------------------------

export function Card({
  variant = 'default',
  padding = 'md',
  header,
  footer,
  interactive = false,
  children,
  className,
  ...props
}: CardProps) {
  const hasHeader = Boolean(header);
  const hasFooter = Boolean(footer);

  return (
    <div
      {...props}
      className={cn(
        'rounded-[var(--radius-lg)]',
        'shadow-[var(--shadow-sm)]',
        'transition-colors',
        'duration-150',
        'ease-out',
        variantClasses[variant],
        paddingClasses[padding],
        interactive && [
          'cursor-pointer',
          'hover:border-[var(--border-strong)]',
          'hover:shadow-[var(--shadow-md)]',
        ].join(' '),
        className,
      )}
    >
      {hasHeader && (
        <div
          className={cn(
            'flex',
            'items-center',
            'justify-between',
            'gap-3',
            padding !== 'none' && 'mb-4',
          )}
        >
          {header}
        </div>
      )}

      <div>{children}</div>

      {hasFooter && (
        <div
          className={cn(
            'flex',
            'items-center',
            'justify-between',
            'gap-3',
            padding !== 'none' && 'mt-4',
          )}
        >
          {footer}
        </div>
      )}
    </div>
  );
}