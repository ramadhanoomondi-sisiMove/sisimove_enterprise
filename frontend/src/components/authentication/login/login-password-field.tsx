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

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface LoginPasswordFieldProps {
  readonly value: string;
  readonly onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  readonly error?: string;
  readonly disabled?: boolean;
}

// -----------------------------------------------------------------------------
// Eye Icon
// -----------------------------------------------------------------------------

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
      className="h-5 w-5"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Eye Off Icon
// -----------------------------------------------------------------------------

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
      className="h-5 w-5"
    >
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
      <path d="M9.9 5.2A10.9 10.9 0 0 1 12 5c6 0 9.5 7 9.5 7a17.7 17.7 0 0 1-3.1 3.8" />
      <path d="M6.6 6.6C3.9 8.4 2.5 12 2.5 12s3.5 7 9.5 7c1.7 0 3.2-.5 4.5-1.1" />
    </svg>
  );
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

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
    <div className="space-y-2">
      <label
        htmlFor="login-password"
        className="block text-sm font-medium text-slate-900"
      >
        Password
      </label>

      <div className="relative">
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
            'block w-full rounded-lg border bg-white px-4 py-3 pr-12 text-sm text-slate-950',
            'outline-none transition',
            'placeholder:text-slate-400',
            'focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
            'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-slate-300 focus:border-blue-500',
          ].join(' ')}
        />

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
            'absolute inset-y-0 right-0 flex items-center px-3',
            'text-slate-400 transition-colors',
            'hover:text-slate-700',
            'focus:outline-none focus:text-blue-600',
            'disabled:cursor-not-allowed disabled:text-slate-300',
          ].join(' ')}
        >
          {showPassword ? (
            <EyeOffIcon />
          ) : (
            <EyeIcon />
          )}
        </button>
      </div>

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-red-600"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default LoginPasswordField;
