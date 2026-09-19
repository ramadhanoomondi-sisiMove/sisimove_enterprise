// -----------------------------------------------------------------------------
// sisiMove — Registration Error
// -----------------------------------------------------------------------------
//
// Presentation component for registration-level errors.
//
// Responsibilities:
//
// - display a registration error;
// - provide accessible status semantics.
//
// This component does NOT:
//
// - call the registration API;
// - interpret HTTP responses;
// - manage registration state;
// - perform navigation;
// - contain registration business rules.
//
// Error normalization belongs to useRegisterUser().
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

// =============================================================================
// Props
// =============================================================================

export interface RegisterErrorProps {
  /**
   * Normalized registration error.
   *
   * When null, nothing is rendered.
   */
  readonly error: Error | null;

  /**
   * Optional custom fallback message.
   *
   * This allows the registration surface to avoid exposing raw technical
   * messages when a generic user-facing message is preferred.
   */
  readonly fallbackMessage?: string;

  /**
   * Optional content rendered before the error message.
   */
  readonly icon?: ReactNode;
}

// =============================================================================
// Component
// =============================================================================

export function RegisterError({
  error,
  fallbackMessage = 'We could not create your account. Please check your details and try again.',
  icon,
}: RegisterErrorProps) {
  // ---------------------------------------------------------------------------
  // No Error
  // ---------------------------------------------------------------------------
  //
  // Keeping the component null-safe makes the registration form composition
  // simple:
  //
  //     <RegisterError error={error} />
  //
  // No conditional rendering is required at the call site.
  //
  // ---------------------------------------------------------------------------

  if (!error) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // User-facing Message
  // ---------------------------------------------------------------------------
  //
  // The API client already converts transport failures into Error instances.
  // However, raw technical errors should not automatically become part of the
  // product's permanent UX contract.
  //
  // The current default therefore uses a stable product-level message.
  //
  // ---------------------------------------------------------------------------

  return (
    <div
      role="alert"
      aria-live="polite"
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
    >
      <div className="flex items-start gap-3">
        {icon ? (
          <span
            aria-hidden="true"
            className="mt-0.5 shrink-0"
          >
            {icon}
          </span>
        ) : null}

        <p>{fallbackMessage}</p>
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RegisterError;

