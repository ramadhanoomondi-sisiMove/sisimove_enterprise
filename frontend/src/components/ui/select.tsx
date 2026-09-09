// -----------------------------------------------------------------------------
// sisiMove — Select
// -----------------------------------------------------------------------------
//
// Reusable native select primitive for the sisiMove design system.
//
// Responsibilities:
// - Consistent select appearance
// - Accessible labeling support
// - Helper and validation states
// - Native HTML select behavior
//
// The component remains domain-agnostic.
// -----------------------------------------------------------------------------

import type {
  ReactNode,
  SelectHTMLAttributes,
} from 'react';

import { cn } from '../../foundation/utils/cn';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  /**
   * Optional visible label rendered above the select.
   */
  label?: string;

  /**
   * Optional helper text rendered below the select.
   */
  helperText?: string;

  /**
   * Validation or contextual error message.
   */
  error?: string;

  /**
   * Options rendered inside the native select element.
   */
  options?: SelectOption[];

  /**
   * Optional content rendered before the select.
   *
   * This is presentation-only and does not affect the native select value.
   */
  leadingContent?: ReactNode;

  /**
   * Makes the select container occupy the available width.
   */
  fullWidth?: boolean;
}

// -----------------------------------------------------------------------------
// Select
// -----------------------------------------------------------------------------

export function Select({
  id,
  label,
  helperText,
  error,
  options,
  leadingContent,
  fullWidth = true,
  className,
  disabled,
  required,
  children,
  ...props
}: SelectProps) {
  const generatedId = id ?? undefined;

  const hasError = Boolean(error);
  const hasLeadingContent = Boolean(leadingContent);

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
        {leadingContent && (
          <span
            aria-hidden="true"
            className={[
              'pointer-events-none',
              'absolute',
              'inset-y-0',
              'left-3',
              'z-10',
              'flex',
              'items-center',
              'text-[var(--foreground-muted)]',
            ].join(' ')}
          >
            {leadingContent}
          </span>
        )}

        <select
          {...props}
          id={generatedId}
          disabled={disabled}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={describedById}
          className={cn(
            'min-h-10',
            'w-full',
            'appearance-none',
            'rounded-[var(--radius-md)]',
            'border',
            'bg-[var(--surface)]',
            'px-3',
            'pr-10',
            'text-sm',
            'text-[var(--foreground)]',
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
            hasLeadingContent && 'pl-10',
            hasError &&
              [
                'border-[var(--danger)]',
                'focus:border-[var(--danger)]',
                'focus:ring-2',
                'focus:ring-[var(--danger)]/10',
              ].join(' '),
            className,
          )}
        >
          {options
            ? options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))
            : children}
        </select>

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
          <svg
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="h-4 w-4"
          >
            <path
              d="m5.5 7.5 4.5 4.5 4.5-4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
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