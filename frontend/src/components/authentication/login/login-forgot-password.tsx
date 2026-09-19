// -----------------------------------------------------------------------------
// sisiMove — Login Forgot Password
// -----------------------------------------------------------------------------
//
// Presentation component for the password-recovery entry point.
//
// Responsibilities:
// - Present the "Forgot password?" action.
// - Navigate to a caller-supplied password-recovery route.
//
// This component intentionally does NOT:
// - Implement password recovery.
// - Call a recovery API.
// - Validate an identity.
// - Send an OTP.
// - Reset a password.
// - Manage authentication state.
//
// The destination is supplied by the parent because the current routing
// contract does not define a password-recovery route yet. This prevents the
// presentation layer from inventing or coupling itself to an unconfirmed URL.
//
// -----------------------------------------------------------------------------

'use client';

import Link from 'next/link';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface LoginForgotPasswordProps {
  /**
   * Route used to begin password recovery.
   *
   * Keep this explicit until the authentication routing contract defines the
   * canonical password-recovery route.
   */
  readonly href: string;

  /**
   * Optional custom label for the recovery action.
   */
  readonly label?: string;

  /**
   * Allows the parent to prevent interaction while another authentication
   * operation is in progress.
   */
  readonly disabled?: boolean;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function LoginForgotPassword({
  href,
  label = 'Forgot password?',
  disabled = false,
}: LoginForgotPasswordProps) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className="text-sm font-medium text-slate-400"
      >
        {label}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="text-sm font-medium text-blue-600 underline-offset-4 transition-colors hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {label}
    </Link>
  );
}

export default LoginForgotPassword;

