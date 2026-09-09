// -----------------------------------------------------------------------------
// sisiMove — Button
// -----------------------------------------------------------------------------
//
// Reusable button primitive for the sisiMove design system.
//
// Responsibilities:
// - Consistent button appearance
// - Semantic variants
// - Consistent sizing
// - Keyboard/focus accessibility
// - Disabled/loading states
// - Native button behavior
//
// The component intentionally contains no business/domain logic.
// -----------------------------------------------------------------------------

import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';

import { cn } from '../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger';

export type ButtonSize =
  | 'sm'
  | 'md'
  | 'lg';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Visual style of the button.
   */
  variant?: ButtonVariant;

  /**
   * Controls the button's dimensions and typography.
   */
  size?: ButtonSize;

  /**
   * Displays a loading state and prevents interaction.
   */
  loading?: boolean;

  /**
   * Optional content displayed before the button label.
   */
  leadingIcon?: ReactNode;

  /**
   * Optional content displayed after the button label.
   */
  trailingIcon?: ReactNode;

  /**
   * Button contents.
   */
  children: ReactNode;
}

// -----------------------------------------------------------------------------
// Variant Classes
// -----------------------------------------------------------------------------

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-[var(--brand)]',
    'text-[var(--brand-foreground)]',
    'border',
    'border-transparent',
    'hover:bg-[var(--brand-hover)]',
    'active:bg-[var(--brand-hover)]',
  ].join(' '),

  secondary: [
    'bg-[var(--background-muted)]',
    'text-[var(--foreground)]',
    'border',
    'border-transparent',
    'hover:bg-[var(--border)]',
    'active:bg-[var(--border-strong)]',
  ].join(' '),

  outline: [
    'bg-transparent',
    'text-[var(--foreground)]',
    'border',
    'border-[var(--border-strong)]',
    'hover:bg-[var(--background-subtle)]',
    'hover:border-[var(--foreground-subtle)]',
    'active:bg-[var(--background-muted)]',
  ].join(' '),

  ghost: [
    'bg-transparent',
    'text-[var(--foreground-secondary)]',
    'border',
    'border-transparent',
    'hover:bg-[var(--background-subtle)]',
    'hover:text-[var(--foreground)]',
    'active:bg-[var(--background-muted)]',
  ].join(' '),

  danger: [
    'bg-[var(--danger)]',
    'text-[var(--brand-foreground)]',
    'border',
    'border-transparent',
    'hover:opacity-90',
    'active:opacity-80',
  ].join(' '),
};

// -----------------------------------------------------------------------------
// Size Classes
// -----------------------------------------------------------------------------

const sizeClasses: Record<ButtonSize, string> = {
  sm: [
    'min-h-9',
    'px-3',
    'text-sm',
    'rounded-[var(--radius-md)]',
  ].join(' '),

  md: [
    'min-h-10',
    'px-4',
    'text-sm',
    'rounded-[var(--radius-md)]',
  ].join(' '),

  lg: [
    'min-h-12',
    'px-5',
    'text-base',
    'rounded-[var(--radius-lg)]',
  ].join(' '),
};

// -----------------------------------------------------------------------------
// Base Classes
// -----------------------------------------------------------------------------

const baseClasses = [
  'inline-flex',
  'items-center',
  'justify-center',
  'gap-2',
  'font-medium',
  'whitespace-nowrap',
  'select-none',
  'transition-colors',
  'duration-150',
  'ease-out',
  'focus-visible:outline-2',
  'focus-visible:outline-[var(--brand)]',
  'focus-visible:outline-offset-2',
  'disabled:pointer-events-none',
  'disabled:cursor-not-allowed',
  'disabled:opacity-50',
].join(' ');

// -----------------------------------------------------------------------------
// Loading Indicator
// -----------------------------------------------------------------------------

function ButtonSpinner(): ReactNode {
  return (
    <span
      aria-hidden="true"
      className={[
        'h-4',
        'w-4',
        'shrink-0',
        'animate-spin',
        'rounded-full',
        'border-2',
        'border-current',
        'border-t-transparent',
      ].join(' ')}
    />
  );
}

// -----------------------------------------------------------------------------
// Button
// -----------------------------------------------------------------------------

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  leadingIcon,
  trailingIcon,
  disabled,
  children,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
    >
      {loading ? (
        <ButtonSpinner />
      ) : (
        leadingIcon
      )}

      <span>{children}</span>

      {!loading && trailingIcon}
    </button>
  );
}