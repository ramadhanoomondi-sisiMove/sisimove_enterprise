// -----------------------------------------------------------------------------
// sisiMove — Empty State
// -----------------------------------------------------------------------------
//
// Reusable empty-state primitive for the sisiMove design system.
//
// Responsibilities:
// - Communicate that a collection or view has no content
// - Provide optional supporting text
// - Provide optional visual content
// - Support a primary and secondary action
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

export interface EmptyStateAction
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * Action label.
   */
  label: string;

  /**
   * Optional visual content rendered before the action label.
   */
  leadingContent?: ReactNode;

  /**
   * Visual treatment for the action.
   */
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export interface EmptyStateProps {
  /**
   * Optional visual element displayed above the title.
   */
  icon?: ReactNode;

  /**
   * Main empty-state heading.
   */
  title: string;

  /**
   * Optional supporting description.
   */
  description?: string;

  /**
   * Optional primary action.
   */
  primaryAction?: EmptyStateAction;

  /**
   * Optional secondary action.
   */
  secondaryAction?: EmptyStateAction;

  /**
   * Additional classes for the root element.
   */
  className?: string;
}

// -----------------------------------------------------------------------------
// Action
// -----------------------------------------------------------------------------

function EmptyStateActionButton({
  action,
}: {
  action: EmptyStateAction;
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
// Empty State
// -----------------------------------------------------------------------------

export function EmptyState({
  icon,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div
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
            'bg-[var(--brand-soft)]',
            'text-[var(--brand)]',
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

      {(primaryAction || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {primaryAction && (
            <EmptyStateActionButton action={primaryAction} />
          )}

          {secondaryAction && (
            <EmptyStateActionButton action={secondaryAction} />
          )}
        </div>
      )}
    </div>
  );
}