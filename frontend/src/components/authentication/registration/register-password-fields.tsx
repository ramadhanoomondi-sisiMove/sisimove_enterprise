// -----------------------------------------------------------------------------
// sisiMove — Registration Password Fields
// -----------------------------------------------------------------------------
//
// Presentation component for the registration password fields.
//
// Fields:
//
//     password
//     confirmPassword
//
// The password and confirmation are frontend registration-form concerns.
// `confirmPassword` MUST NOT be sent to the backend registration endpoint.
//
// Validation remains owned by:
//
//     registerUserSchema
//
// This component does NOT:
//
// - validate password strength;
// - compare passwords;
// - call the registration API;
// - transform password values;
// - store passwords;
// - submit the form.
//
// -----------------------------------------------------------------------------

'use client';

// =============================================================================
// Props
// =============================================================================

export interface RegisterPasswordFieldsProps {
  /**
   * Current password value.
   */
  readonly password: string;

  /**
   * Current password confirmation value.
   */
  readonly confirmPassword: string;

  /**
   * Called when the password changes.
   */
  readonly onPasswordChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;

  /**
   * Called when the password confirmation changes.
   */
  readonly onConfirmPasswordChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;

  /**
   * Password validation error.
   */
  readonly passwordError?: string;

  /**
   * Password confirmation validation error.
   */
  readonly confirmPasswordError?: string;

  /**
   * Disables both fields while registration is being submitted.
   */
  readonly disabled?: boolean;
}

// =============================================================================
// Component
// =============================================================================

export function RegisterPasswordFields({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  passwordError,
  confirmPasswordError,
  disabled = false,
}: RegisterPasswordFieldsProps) {
  const passwordErrorId = 'register-password-error';
  const confirmPasswordErrorId = 'register-confirm-password-error';

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {/* ------------------------------------------------------------------ */}
      {/* Password                                                            */}
      {/* ------------------------------------------------------------------ */}

      <div className="space-y-2">
        <label
          htmlFor="register-password"
          className="block text-sm font-medium text-slate-900"
        >
          Password
        </label>

        <input
          id="register-password"
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChange}
          autoComplete="new-password"
          disabled={disabled}
          aria-invalid={passwordError ? true : undefined}
          aria-describedby={
            passwordError ? passwordErrorId : undefined
          }
          placeholder="Create a password"
          className={[
            'block w-full rounded-xl border bg-white px-4 py-3',
            'text-sm text-slate-900 placeholder:text-slate-400',
            'outline-none transition',
            'focus:ring-2 focus:ring-blue-600',
            disabled
              ? 'cursor-not-allowed border-slate-200 bg-slate-50'
              : passwordError
                ? 'border-red-300 focus:border-red-500'
                : 'border-slate-300 focus:border-blue-600',
          ].join(' ')}
        />

        {passwordError ? (
          <p
            id={passwordErrorId}
            role="alert"
            className="text-xs font-medium text-red-600"
          >
            {passwordError}
          </p>
        ) : (
          <p className="text-xs text-slate-500">
            Use at least 8 characters.
          </p>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Confirm Password                                                    */}
      {/* ------------------------------------------------------------------ */}

      <div className="space-y-2">
        <label
          htmlFor="register-confirm-password"
          className="block text-sm font-medium text-slate-900"
        >
          Confirm password
        </label>

        <input
          id="register-confirm-password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          autoComplete="new-password"
          disabled={disabled}
          aria-invalid={confirmPasswordError ? true : undefined}
          aria-describedby={
            confirmPasswordError
              ? confirmPasswordErrorId
              : undefined
          }
          placeholder="Enter your password again"
          className={[
            'block w-full rounded-xl border bg-white px-4 py-3',
            'text-sm text-slate-900 placeholder:text-slate-400',
            'outline-none transition',
            'focus:ring-2 focus:ring-blue-600',
            disabled
              ? 'cursor-not-allowed border-slate-200 bg-slate-50'
              : confirmPasswordError
                ? 'border-red-300 focus:border-red-500'
                : 'border-slate-300 focus:border-blue-600',
          ].join(' ')}
        />

        {confirmPasswordError ? (
          <p
            id={confirmPasswordErrorId}
            role="alert"
            className="text-xs font-medium text-red-600"
          >
            {confirmPasswordError}
          </p>
        ) : null}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RegisterPasswordFields;

