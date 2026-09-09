// -----------------------------------------------------------------------------
// sisiMove — Input
// -----------------------------------------------------------------------------
//
// Reusable text input primitive for the sisiMove design system.
//
// Responsibilities:
// - Consistent input appearance
// - Accessible labeling support
// - Error and helper states
// - Leading/trailing content
// - Native HTML input behavior
//
// The component remains domain-agnostic.
// -----------------------------------------------------------------------------

import type {
  InputHTMLAttributes,
  ReactNode,
} from 'react';

import { cn } from '../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  /**
   * Optional visible label rendered above the input.
   */
  label?: string;

  /**
   * Optional helper text rendered below the input.
   */
  helperText?: string;

  /**
   * Validation or contextual error message.
   */
  error?: string;

  /**
   * Optional content rendered inside the left side of the input.
   */
  leadingContent?: ReactNode;

  /**
   * Optional content rendered inside the right side of the input.
   */
  trailingContent?: ReactNode;

  /**
   * Makes the input container occupy the available width.
   */
  fullWidth?: boolean;
}

// -----------------------------------------------------------------------------
// Input
// -----------------------------------------------------------------------------

export function Input({
  id,
  label,
  helperText,
  error,
  leadingContent,
  trailingContent,
  fullWidth = true,
  className,
  disabled,
  required,
  ...props
}: InputProps) {
  const generatedId = id ?? undefined;

  const describedById = generatedId
    ? error
      ? `${generatedId}-error`
      : helperText
        ? `${generatedId}-helper`
        : undefined
    : undefined;

  const hasError = Boolean(error);
  const hasLeadingContent = Boolean(leadingContent);
  const hasTrailingContent = Boolean(trailingContent);

  return (
    <div
      className={cn(
        'flex flex-col gap-1.5',
        fullWidth && 'w-full',
      )}
    >
      {label && (
        <label
          htmlFor={generatedId}
          className="text-sm font-medium text-[var(--foreground)]"
        >
          {label}

          {required && (
            <span
              aria-hidden="true"
              className="ml-1 text-[var(--danger)]"
            >
              *
            </span>
          )}
        </label>
      )}

      <div className="relative">
        {leadingContent && (
          <span
            aria-hidden="true"
            className={[
              'pointer-events-none',
              'absolute',
              'inset-y-0',
              'left-3',
              'flex',
              'items-center',
              'text-[var(--foreground-muted)]',
            ].join(' ')}
          >
            {leadingContent}
          </span>
        )}

        <input
          {...props}
          id={generatedId}
          disabled={disabled}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={describedById}
          className={cn(
            'min-h-10',
            'w-full',
            'rounded-[var(--radius-md)]',
            'border',
            'bg-[var(--surface)]',
            'px-3',
            'text-sm',
            'text-[var(--foreground)]',
            'placeholder:text-[var(--foreground-subtle)]',
            'transition-colors',
            'duration-150',
            'ease-out',
            'outline-none',
            'border-[var(--border)]',
            'hover:border-[var(--border-strong)]',
            'focus:border-[var(--brand)]',
            'focus:ring-2',
            'focus:ring-[var(--brand)]/10',
            'disabled:cursor-not-allowed',
            'disabled:bg-[var(--background-muted)]',
            'disabled:text-[var(--foreground-muted)]',
            'disabled:opacity-70',
            hasError &&
              [
                'border-[var(--danger)]',
                'focus:border-[var(--danger)]',
                'focus:ring-2',
                'focus:ring-[var(--danger)]/10',
              ].join(' '),
            hasLeadingContent && 'pl-10',
            hasTrailingContent && 'pr-10',
            className,
          )}
        />

        {trailingContent && (
          <span
            aria-hidden="true"
            className={[
              'pointer-events-none',
              'absolute',
              'inset-y-0',
              'right-3',
              'flex',
              'items-center',
              'text-[var(--foreground-muted)]',
            ].join(' ')}
          >
            {trailingContent}
          </span>
        )}
      </div>

      {error ? (
        <p
          id={generatedId ? `${generatedId}-error` : undefined}
          className="text-sm text-[var(--danger)]"
        >
          {error}
        </p>
      ) : helperText ? (
        <p
          id={generatedId ? `${generatedId}-helper` : undefined}
          className="text-sm text-[var(--foreground-muted)]"
        >
          {helperText}
        </p>
      ) : null}
    </div>
  );
}