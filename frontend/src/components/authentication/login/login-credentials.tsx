// -----------------------------------------------------------------------------
// sisiMove — Login Credentials
// -----------------------------------------------------------------------------
//
// Presentation component for the primary login identifier.
//
// The backend login contract accepts:
//
//     emailOrPhoneNumber
//
// This field therefore deliberately allows either an email address or a phone
// number. It does not attempt to determine which one the user entered.
//
// Responsibilities:
// - Render the email/phone login identifier field.
// - Forward controlled input changes to the owning form.
// - Display field-level validation errors.
// - Communicate the disabled state.
//
// This component intentionally does NOT:
// - Validate the identifier.
// - Normalize the identifier.
// - Determine whether it is an email or phone number.
// - Call the login API.
// - Authenticate the user.
// - Manage authentication state.
// - Persist credentials.
//
// Validation is owned by:
//
//     features/authentication/login/schemas
//
// Authentication is owned by:
//
//     features/authentication/login/hooks
//
// -----------------------------------------------------------------------------

'use client';

import type { ChangeEvent } from 'react';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface LoginCredentialsProps {
  readonly value: string;
  readonly onChange: (
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  readonly error?: string;
  readonly disabled?: boolean;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function LoginCredentials({
  value,
  onChange,
  error,
  disabled = false,
}: LoginCredentialsProps) {
  const errorId = 'login-credentials-error';

  return (
    <div className="space-y-2">
      <label
        htmlFor="login-email-or-phone"
        className="block text-sm font-medium text-slate-900"
      >
        Email or phone number
      </label>

      <input
        id="login-email-or-phone"
        name="emailOrPhoneNumber"
        type="text"
        inputMode="email"
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete="username"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        placeholder="Email or phone number"
        className={[
          'block w-full rounded-lg border bg-white px-4 py-3 text-sm text-slate-950',
          'outline-none transition',
          'placeholder:text-slate-400',
          'focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
          'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-slate-300 focus:border-blue-500',
        ].join(' ')}
      />

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

export default LoginCredentials;

