// -----------------------------------------------------------------------------
// sisiMove — Login Error
// -----------------------------------------------------------------------------
//
// Presentation component for login failures.
//
// Responsibilities:
// - Display a safe, user-facing login error.
// - Support explicitly classified, presentation-safe error categories.
// - Keep generic credential failures generic.
// - Provide an accessible error region.
//
// This component intentionally does NOT:
// - Interpret raw backend error codes or messages.
// - Reveal whether an account exists.
// - Reveal authentication, device, or identity lifecycle state.
// - Display raw API/transport errors.
// - Perform retry logic.
// - Reset the login form.
// - Navigate the user.
//
// The login hook is responsible for normalizing errors into safe categories.
// Unknown or unclassified errors always use the generic fallback.
//
// -----------------------------------------------------------------------------

'use client';

import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

/**
 * These are UI-safe categories, not raw backend error codes.
 *
 * Keep credential failures generic to avoid account enumeration.
 * Add another category only when its message is safe to disclose.
 */
export type LoginErrorCategory =
  | 'INVALID_CREDENTIALS'
  | 'NETWORK'
  | 'SERVICE_UNAVAILABLE'
  | 'UNKNOWN';

export interface LoginErrorProps {
  /**
   * Indicates whether an error should be displayed.
   *
   * Pass the normalized hook error here.
   */
  readonly error: Error | null;

  /**
   * Optional safe category produced by the login hook.
   *
   * Never derive this value from Error.message in this component.
   */
  readonly category?: LoginErrorCategory;

  /**
   * Safe fallback for unclassified failures.
   */
  readonly fallbackMessage?: string;

  /**
   * Optional visual icon supplied by the presentation layer.
   */
  readonly icon?: ReactNode;
}

// -----------------------------------------------------------------------------
// Safe presentation messages
// -----------------------------------------------------------------------------

const LOGIN_ERROR_MESSAGES: Readonly<
  Record<LoginErrorCategory, string>
> = {
  INVALID_CREDENTIALS:
    'We could not sign you in. Check your email or phone number and password, then try again.',

  NETWORK:
    'We could not connect. Check your internet connection and try again.',

  SERVICE_UNAVAILABLE:
    'Sign-in is temporarily unavailable. Please try again shortly.',

  UNKNOWN:
    'We could not sign you in. Please try again.',
};

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function LoginError({
  error,
  category = 'UNKNOWN',
  fallbackMessage =
    'We could not sign you in. Check your email or phone number and password, then try again.',
  icon,
}: LoginErrorProps) {
  if (!error) {
    return null;
  }

  const message =
    category === 'UNKNOWN'
      ? fallbackMessage
      : LOGIN_ERROR_MESSAGES[category];

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

      <p className="leading-5">{message}</p>
    </div>
  );
}

export default LoginError;
