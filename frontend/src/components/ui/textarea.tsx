// -----------------------------------------------------------------------------
// sisiMove — Textarea
// -----------------------------------------------------------------------------
//
// Reusable multiline text input primitive for the sisiMove design system.
//
// Responsibilities:
// - Consistent textarea appearance
// - Accessible labeling support
// - Helper and validation states
// - Native textarea behavior
//
// The component remains domain-agnostic.
// -----------------------------------------------------------------------------

import type {
  ReactNode,
  TextareaHTMLAttributes,
} from 'react';

import { cn } from '../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface TextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Optional visible label rendered above the textarea.
   */
  label?: string;

  /**
   * Optional helper text rendered below the textarea.
   */
  helperText?: string;

  /**
   * Validation or contextual error message.
   */
  error?: string;

  /**
   * Optional content rendered alongside the textarea.
   *
   * This is useful for lightweight contextual UI such as a character
   * counter or status indicator.
   */
  trailingContent?: ReactNode;

  /**
   * Makes the textarea container occupy the available width.
   */
  fullWidth?: boolean;
}

// -----------------------------------------------------------------------------
// Textarea
// -----------------------------------------------------------------------------

export function Textarea({
  id,
  label,
  helperText,
  error,
  trailingContent,
  fullWidth = true,
  className,
  disabled,
  required,
  ...props
}: TextareaProps) {
  const generatedId = id ?? undefined;

  const hasError = Boolean(error);
  const hasTrailingContent = Boolean(trailingContent);

  const describedById = generatedId
    ? error
      ? `${generatedId}-error`
      : helperText
        ? `${generatedId}-helper`
        : undefined
    : undefined;

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
        <textarea
          {...props}
          id={generatedId}
          disabled={disabled}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={describedById}
          className={cn(
            'min-h-24',
            'w-full',
            'resize-y',
            'rounded-[var(--radius-md)]',
            'border',
            'bg-[var(--surface)]',
            'px-3',
            'py-2.5',
            'text-sm',
            'leading-6',
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
            'disabled:resize-none',
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
            hasTrailingContent && 'pr-20',
            className,
          )}
        />

        {trailingContent && (
          <div
            aria-hidden="true"
            className={[
              'pointer-events-none',
              'absolute',
              'right-3',
              'bottom-3',
              'text-xs',
              'text-[var(--foreground-muted)]',
            ].join(' ')}
          >
            {trailingContent}
          </div>
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