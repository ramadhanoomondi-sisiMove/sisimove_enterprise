// -----------------------------------------------------------------------------
// sisiMove — Badge
// -----------------------------------------------------------------------------
//
// Reusable status / metadata badge for the sisiMove design system.
//
// Responsibilities:
// - Compact semantic status presentation
// - Consistent typography and spacing
// - Optional leading/trailing content
// - Domain-agnostic presentation
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

export type BadgeVariant =
  | 'default'
  | 'brand'
  | 'success'
  | 'warning'
  | 'danger'
  | 'outline';

export type BadgeSize =
  | 'sm'
  | 'md';

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement> {
  /**
   * Visual semantic variant.
   */
  variant?: BadgeVariant;

  /**
   * Badge size.
   */
  size?: BadgeSize;

  /**
   * Optional content rendered before the badge label.
   */
  leadingContent?: ReactNode;

  /**
   * Optional content rendered after the badge label.
   */
  trailingContent?: ReactNode;

  /**
   * Badge content.
   */
  children: ReactNode;
}

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------

const variantClasses: Record<BadgeVariant, string> = {
  default: [
    'bg-[var(--background-muted)]',
    'text-[var(--foreground-secondary)]',
  ].join(' '),

  brand: [
    'bg-[var(--brand-soft)]',
    'text-[var(--brand)]',
  ].join(' '),

  success: [
    'bg-[var(--success-soft)]',
    'text-[var(--success)]',
  ].join(' '),

  warning: [
    'bg-[var(--warning-soft)]',
    'text-[var(--warning)]',
  ].join(' '),

  danger: [
    'bg-[var(--danger-soft)]',
    'text-[var(--danger)]',
  ].join(' '),

  outline: [
    'border',
    'border-[var(--border)]',
    'bg-transparent',
    'text-[var(--foreground-secondary)]',
  ].join(' '),
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: [
    'min-h-5',
    'px-2',
    'text-[11px]',
    'leading-4',
  ].join(' '),

  md: [
    'min-h-6',
    'px-2.5',
    'text-xs',
    'leading-4',
  ].join(' '),
};

// -----------------------------------------------------------------------------
// Badge
// -----------------------------------------------------------------------------

export function Badge({
  variant = 'default',
  size = 'md',
  leadingContent,
  trailingContent,
  children,
  className,
  ...props
}: BadgeProps) {
  const hasLeadingContent = Boolean(leadingContent);
  const hasTrailingContent = Boolean(trailingContent);

  return (
    <span
      {...props}
      className={cn(
        'inline-flex',
        'w-fit',
        'shrink-0',
        'items-center',
        'justify-center',
        'gap-1.5',
        'rounded-[var(--radius-full)]',
        'font-medium',
        'whitespace-nowrap',
        'select-none',
        variantClasses[variant],
        sizeClasses[size],
        hasLeadingContent && 'pl-2',
        hasTrailingContent && 'pr-2',
        className,
      )}
    >
      {leadingContent && (
        <span
          aria-hidden="true"
          className="inline-flex shrink-0 items-center"
        >
          {leadingContent}
        </span>
      )}

      <span>{children}</span>

      {trailingContent && (
        <span
          aria-hidden="true"
          className="inline-flex shrink-0 items-center"
        >
          {trailingContent}
        </span>
      )}
    </span>
  );
}