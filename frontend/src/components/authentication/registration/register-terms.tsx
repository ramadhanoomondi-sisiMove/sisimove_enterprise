// -----------------------------------------------------------------------------
// sisiMove — Registration Terms
// -----------------------------------------------------------------------------
//
// Presentation component for the registration terms and privacy consent.
//
// Responsibilities:
//
// - render the terms/privacy checkbox;
// - expose its checked state through the standard input event;
// - display a validation error when supplied;
// - provide accessible association between the checkbox and its labels.
//
// This component does NOT:
//
// - validate registration;
// - submit the form;
// - call the registration API;
// - decide whether consent is required;
// - contain registration business rules.
//
// The registration schema remains the source of truth for:
//
//     termsAccepted === true
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// Next.js
// -----------------------------------------------------------------------------

import Link from 'next/link';

// -----------------------------------------------------------------------------
// Authentication — Constants
// -----------------------------------------------------------------------------

import { AUTHENTICATION_ROUTES } from '@/features/authentication/constants';

// =============================================================================
// Props
// =============================================================================

export interface RegisterTermsProps {
  /**
   * Current consent value.
   */
  readonly checked: boolean;

  /**
   * Called when the user changes the consent checkbox.
   */
  readonly onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;

  /**
   * Validation message associated with the terms field.
   */
  readonly error?: string;

  /**
   * Disables the consent control while registration is being submitted.
   */
  readonly disabled?: boolean;
}

// =============================================================================
// Component
// =============================================================================

export function RegisterTerms({
  checked,
  onChange,
  error,
  disabled = false,
}: RegisterTermsProps) {
  const errorId = 'register-terms-error';

  return (
    <div className="space-y-2">
      {/* ------------------------------------------------------------------ */}
      {/* Consent                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex items-start gap-3">
        <input
          id="register-terms"
          name="termsAccepted"
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-700 focus:ring-2 focus:ring-blue-600 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"
        />

        <label
          htmlFor="register-terms"
          className="text-sm leading-6 text-slate-600"
        >
          I agree to the{' '}
          <Link
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-900 underline underline-offset-2 hover:text-blue-700"
          >
            Terms
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-slate-900 underline underline-offset-2 hover:text-blue-700"
          >
            Privacy Policy
          </Link>
          .
        </label>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Validation Error                                                    */}
      {/* ------------------------------------------------------------------ */}

      {error ? (
        <p
          id={errorId}
          role="alert"
          className="ml-7 text-xs font-medium text-red-600"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RegisterTerms;

