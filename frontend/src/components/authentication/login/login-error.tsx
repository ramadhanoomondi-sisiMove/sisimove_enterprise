// -----------------------------------------------------------------------------
// sisiMove — Login Error
// -----------------------------------------------------------------------------
//
// Presentation component for login failures.
//
// Responsibilities:
// - Display a safe, user-facing login error.
// - Provide an accessible error region.
//
// This component intentionally does NOT:
// - Interpret backend error codes.
// - Reveal whether an account exists.
// - Reveal authentication/device state.
// - Display raw API/transport errors.
// - Perform retry logic.
// - Reset the login form.
// - Navigate the user.
//
// The authentication API deliberately uses generic credential failures.
// Therefore the UI should provide actionable guidance without exposing
// account-enumeration information.
//
// -----------------------------------------------------------------------------

'use client';

import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface LoginErrorProps {
  /**
   * Indicates whether an error should be displayed.
   *
   * The login form can pass its normalized hook error directly.
   */
  readonly error: Error | null;

  /**
   * Safe fallback message shown to the user.
   *
   * The raw Error.message is intentionally not rendered because it may contain
   * transport, infrastructure, or implementation-specific information.
   */
  readonly fallbackMessage?: string;

  /**
   * Optional visual icon supplied by the presentation layer.
   */
  readonly icon?: ReactNode;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function LoginError({
  error,
  fallbackMessage = 'We could not sign you in. Check your email or phone number and password, then try again.',
  icon,
}: LoginErrorProps) {
  if (!error) {
    return null;
  }

  return (
    <div
      id="login-error"
      role="alert"
      aria-live="assertive"
      className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      {icon ? (
        <span
          aria-hidden="true"
          className="mt-0.5 shrink-0"
        >
          {icon}
        </span>
      ) : null}

      <p className="leading-5">
        {fallbackMessage}
      </p>
    </div>
  );
}

export default LoginError;

