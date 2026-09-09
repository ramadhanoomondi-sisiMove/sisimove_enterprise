// -----------------------------------------------------------------------------
// sisiMove — Error State
// -----------------------------------------------------------------------------
//
// Reusable error-state primitive for the sisiMove design system.
//
// Responsibilities:
// - Communicate recoverable loading or data errors
// - Provide optional supporting information
// - Provide retry and secondary actions
// - Remain domain-agnostic
//
// -----------------------------------------------------------------------------

import type {
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';

import { cn } from '../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface ErrorStateAction
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Action label.
   */
  label: string;

  /**
   * Optional content rendered before the action label.
   */
  leadingContent?: ReactNode;

  /**
   * Visual treatment for the action.
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export interface ErrorStateProps {
  /**
   * Optional visual element displayed above the title.
   */
  icon?: ReactNode;

  /**
   * Main error heading.
   */
  title?: string;

  /**
   * Supporting error description.
   */
  description?: string;

  /**
   * Optional retry action.
   */
  retryAction?: ErrorStateAction;

  /**
   * Optional secondary action.
   */
  secondaryAction?: ErrorStateAction;

  /**
   * Additional classes for the root element.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Action
// -----------------------------------------------------------------------------

function ErrorStateActionButton({
  action,
}: {
  action: ErrorStateAction;
}) {
  const {
    label,
    leadingContent,
    variant = 'primary',
    className,
    type = 'button',
    ...props
  } = action;

  return (
    <button
      {...props}
      type={type}
      className={cn(
        'inline-flex',
        'min-h-10',
        'items-center',
        'justify-center',
        'gap-2',
        'rounded-[var(--radius-md)]',
        'px-4',
        'text-sm',
        'font-medium',
        'transition-colors',
        'duration-150',
        'ease-out',
        'outline-none',
        'focus-visible:ring-2',
        'focus-visible:ring-[var(--brand)]/30',
        'disabled:cursor-not-allowed',
        'disabled:opacity-60',

        variant === 'primary' && [
          'bg-[var(--brand)]',
          'text-[var(--brand-foreground)]',
          'hover:bg-[var(--brand-hover)]',
        ].join(' '),

        variant === 'secondary' && [
          'bg-[var(--background-muted)]',
          'text-[var(--foreground)]',
          'hover:bg-[var(--background-subtle)]',
        ].join(' '),

        variant === 'outline' && [
          'border',
          'border-[var(--border)]',
          'bg-[var(--surface)]',
          'text-[var(--foreground)]',
          'hover:border-[var(--border-strong)]',
          'hover:bg-[var(--background-muted)]',
        ].join(' '),

        variant === 'ghost' && [
          'bg-transparent',
          'text-[var(--foreground-secondary)]',
          'hover:bg-[var(--background-muted)]',
          'hover:text-[var(--foreground)]',
        ].join(' '),

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

      <span>{label}</span>
    </button>
  );
}

// -----------------------------------------------------------------------------
// Error State
// -----------------------------------------------------------------------------

export function ErrorState({
  icon,
  title = 'Something went wrong',
  description = 'We could not complete your request. Please try again.',
  retryAction,
  secondaryAction,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex',
        'w-full',
        'flex-col',
        'items-center',
        'justify-center',
        'px-6',
        'py-12',
        'text-center',
        className,
      )}
    >
      {icon && (
        <div
          aria-hidden="true"
          className={[
            'mb-4',
            'flex',
            'h-12',
            'w-12',
            'items-center',
            'justify-center',
            'rounded-[var(--radius-full)]',
            'bg-[var(--danger-soft)]',
            'text-[var(--danger)]',
          ].join(' ')}
        >
          {icon}
        </div>
      )}

      <h2 className="text-base font-semibold text-[var(--foreground)]">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--foreground-muted)]">
          {description}
        </p>
      )}

      {(retryAction || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {retryAction && (
            <ErrorStateActionButton action={retryAction} />
          )}

          {secondaryAction && (
            <ErrorStateActionButton action={secondaryAction} />
          )}
        </div>
      )}
    </div>
  );
}