'use client';

// -----------------------------------------------------------------------------
// sisiMove — Login Password Field
// -----------------------------------------------------------------------------
//
// Presentation component for the login password field.
//
// Responsibilities:
// - Render the password input.
// - Display the field-level validation error.
// - Allow the user to show/hide the password.
// - Forward changes to the owning form.
//
// This component intentionally does NOT:
// - Validate the password.
// - Authenticate the user.
// - Call the login API.
// - Manage login state.
// - Persist credentials.
// - Reveal authentication failure details.
//
// Validation is owned by:
//
//     features/authentication/login/schemas
//
// Authentication is owned by:
//
//     features/authentication/login/hooks
//
// Password visibility is local presentation state and therefore belongs here.
//
// -----------------------------------------------------------------------------

'use client';

import type { ChangeEvent } from 'react';
import { useState } from 'react';

// =============================================================================
// Props
// =============================================================================

export interface LoginPasswordFieldProps {
  readonly value: string;
  readonly onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  readonly error?: string;
  readonly disabled?: boolean;
}

// =============================================================================
// Eye Icon
// =============================================================================

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-[clamp(1rem,1.5vw,1.25rem)] shrink-0"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

// =============================================================================
// Eye Off Icon
// =============================================================================

function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-[clamp(1rem,1.5vw,1.25rem)] shrink-0"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 5.2A10.9 10.9 0 0 1 12 5c6 0 9.5 7 9.5 7a17.7 17.7 0 0 1-3.1 3.8" />
      <path d="M6.6 6.6C3.9 8.4 2.5 12 2.5 12s3.5 7 9.5 7c1.7 0 3.2-.5 4.5-1.1" />
    </svg>
  );
}

// =============================================================================
// Component
// =============================================================================

export function LoginPasswordField({
  value,
  onChange,
  error,
  disabled = false,
}: LoginPasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  const errorId = 'login-password-error';

  const handleTogglePassword = () => {
    setShowPassword((current) => !current);
  };

  return (
    <div className="min-w-0 w-full space-y-[clamp(0.4rem,0.8vw,0.55rem)]">
      {/* ------------------------------------------------------------------- */}
      {/* Label                                                               */}
      {/* ------------------------------------------------------------------- */}

      <label
        htmlFor="login-password"
        className={[
          'block min-w-0',
          'text-[clamp(0.7rem,1.15vw,0.875rem)]',
          'font-medium leading-tight',
          'text-[var(--foreground)]',
        ].join(' ')}
      >
        Password
      </label>

      {/* ------------------------------------------------------------------- */}
      {/* Password input                                                      */}
      {/* ------------------------------------------------------------------- */}

      <div className="relative min-w-0 w-full">
        <input
          id="login-password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete="current-password"
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          placeholder="Your password"
          className={[
            'block min-w-0 w-full',
            'rounded-[clamp(0.45rem,0.8vw,0.65rem)]',
            'border',
            'bg-[var(--surface)]',
            'px-[clamp(0.7rem,1.5vw,1rem)]',
            'py-[clamp(0.6rem,1.2vw,0.8rem)]',
            'pr-[clamp(2.5rem,5vw,3rem)]',
            'text-[clamp(0.7rem,1.15vw,0.875rem)]',
            'leading-tight',
            'text-[var(--foreground)]',
            'outline-none',
            'transition',
            'placeholder:text-[var(--foreground-muted)]',
            'focus:ring-2',
            'focus:ring-offset-0',
            'disabled:cursor-not-allowed',
            'disabled:bg-[var(--background-subtle)]',
            'disabled:text-[var(--foreground-muted)]',
            error
              ? [
                  'border-[var(--danger)]',
                  'focus:border-[var(--danger)]',
                  'focus:ring-[var(--danger)]',
                ].join(' ')
              : [
                  'border-[var(--border)]',
                  'focus:border-[var(--brand)]',
                  'focus:ring-[var(--brand)]',
                ].join(' '),
          ].join(' ')}
        />

        {/* ----------------------------------------------------------------- */}
        {/* Password visibility control                                       */}
        {/* ----------------------------------------------------------------- */}

        <button
          type="button"
          onClick={handleTogglePassword}
          disabled={disabled}
          aria-label={
            showPassword
              ? 'Hide password'
              : 'Show password'
          }
          aria-pressed={showPassword}
          className={[
            'absolute inset-y-0 right-0',
            'flex shrink-0 items-center justify-center',
            'px-[clamp(0.65rem,1.5vw,0.9rem)]',
            'text-[var(--foreground-muted)]',
            'transition-colors duration-150 ease-out',
            'hover:text-[var(--foreground)]',
            'focus:outline-none',
            'focus:text-[var(--brand)]',
            'disabled:cursor-not-allowed',
            'disabled:text-[var(--foreground-subtle)]',
          ].join(' ')}
        >
          {showPassword ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* Validation error                                                    */}
      {/* ------------------------------------------------------------------- */}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className={[
            'min-w-0',
            'break-words',
            'text-[clamp(0.65rem,1vw,0.8rem)]',
            'leading-relaxed',
            'text-[var(--danger)]',
          ].join(' ')}
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default LoginPasswordField;