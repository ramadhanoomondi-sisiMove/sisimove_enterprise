'use client';

// -----------------------------------------------------------------------------
// sisiMove — Login Form
// -----------------------------------------------------------------------------
//
// Authentication form orchestration boundary.
//
// Responsibilities:
// - Own login form state.
// - Validate credentials with authenticateLoginSchema.
// - Present field-level validation errors.
// - Invoke useAuthenticateLogin for authentication.
// - Present authentication errors.
// - Expose successful authentication to the parent through onSuccess.
// - Present the password-recovery entry point.
//
// Non-responsibilities:
// - No direct HTTP requests.
// - No device fingerprint handling.
// - No token/session persistence.
// - No authentication-context manipulation.
// - No routing.
//
// -----------------------------------------------------------------------------

import type { ChangeEvent, FormEvent } from 'react';
import { useCallback, useState } from 'react';

import {
  authenticateLoginSchema,
  useAuthenticateLogin,
  type AuthenticateLoginResponse,
} from '@/features/authentication/login';

import { LoginCredentials } from './login-credentials';
import { LoginError } from './login-error';
import { LoginFormHeader } from './login-form-header';
import { LoginForgotPassword } from './login-forgot-password';
import { LoginPasswordField } from './login-password-field';
import { LoginSubmit } from './login-submit';

// =============================================================================
// Props
// =============================================================================

export interface LoginFormProps {
  /**
   * Route used by the forgot-password presentation.
   *
   * Password recovery is not configured yet. The temporary "#" default keeps
   * the entry point visible while the recovery route is being designed.
   */
  readonly forgotPasswordHref?: string;

  /**
   * Called after the authentication workflow succeeds.
   *
   * The form does not redirect itself. The page/application boundary decides
   * where an authenticated user should go next.
   */
  readonly onSuccess?: (
    response: AuthenticateLoginResponse,
  ) => void | Promise<void>;

  /**
   * Optional consumer-supplied classes for the form root.
   */
  readonly className?: string;
}

// =============================================================================
// Field Errors
// =============================================================================

interface LoginFieldErrors {
  readonly emailOrPhoneNumber?: string;
  readonly password?: string;
}

/**
 * Mutable version used only while constructing validation errors.
 *
 * The public LoginFieldErrors contract remains readonly.
 */
interface MutableLoginFieldErrors {
  emailOrPhoneNumber?: string;
  password?: string;
}

// =============================================================================
// Local Form State
// =============================================================================
//
// The authentication feature contract is readonly.
//
// React-controlled form state must be mutable because the values change as
// the user types. Therefore the form owns this separate mutable presentation
// state.
//
// The readonly authentication contract is created only when calling login().
// =============================================================================

interface LoginFormState {
  emailOrPhoneNumber: string;
  password: string;
}

const INITIAL_FORM_VALUES: LoginFormState = {
  emailOrPhoneNumber: '',
  password: '',
};

// =============================================================================
// Field Error Helpers
// =============================================================================

function createInitialFieldErrors(): LoginFieldErrors {
  return {};
}

function getFieldErrors(
  issues: readonly {
    readonly path: readonly PropertyKey[];
    readonly message: string;
  }[],
): LoginFieldErrors {
  /**
   * This object is intentionally mutable while we construct it.
   *
   * It is returned as the readonly LoginFieldErrors contract.
   */
  const errors: MutableLoginFieldErrors = {};

  for (const issue of issues) {
    const field = issue.path[0];

    if (
      field === 'emailOrPhoneNumber' &&
      errors.emailOrPhoneNumber === undefined
    ) {
      errors.emailOrPhoneNumber = issue.message;
      continue;
    }

    if (
      field === 'password' &&
      errors.password === undefined
    ) {
      errors.password = issue.message;
    }
  }

  return errors;
}

// =============================================================================
// Login Form
// =============================================================================

export function LoginForm({
  forgotPasswordHref = '#',
  onSuccess,
  className,
}: LoginFormProps) {
  // ===========================================================================
  // Local Form State
  // ===========================================================================

  const [values, setValues] = useState<LoginFormState>(
    INITIAL_FORM_VALUES,
  );

  const [fieldErrors, setFieldErrors] =
    useState<LoginFieldErrors>(
      createInitialFieldErrors,
    );

  // ===========================================================================
  // Authentication Hook
  // ===========================================================================

  const {
    login,
    isLoading,
    data,
    error,
    reset,
  } = useAuthenticateLogin();

  // ===========================================================================
  // Credentials Change
  // ===========================================================================

  const handleCredentialsChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setValues((current) => ({
        ...current,
        emailOrPhoneNumber: value,
      }));

      setFieldErrors((current) => {
        if (current.emailOrPhoneNumber === undefined) {
          return current;
        }

        const next = { ...current };

        delete next.emailOrPhoneNumber;

        return next;
      });

      reset();
    },
    [reset],
  );

  // ===========================================================================
  // Password Change
  // ===========================================================================

  const handlePasswordChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      setValues((current) => ({
        ...current,
        password: value,
      }));

      setFieldErrors((current) => {
        if (current.password === undefined) {
          return current;
        }

        const next = { ...current };

        delete next.password;

        return next;
      });

      reset();
    },
    [reset],
  );

  // ===========================================================================
  // Submit
  // ===========================================================================

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      // Prevent duplicate submissions.
      if (isLoading) {
        return;
      }

      // Clear previous validation and authentication errors.
      setFieldErrors(createInitialFieldErrors());
      reset();

      // -----------------------------------------------------------------------
      // Validate
      // -----------------------------------------------------------------------

      const result =
        authenticateLoginSchema.safeParse(values);

      if (!result.success) {
        setFieldErrors(
          getFieldErrors(result.error.issues),
        );

        return;
      }

      // -----------------------------------------------------------------------
      // Authenticate
      // -----------------------------------------------------------------------

      try {
        /*
         * result.data is already validated by authenticateLoginSchema.
         *
         * We create a fresh object here instead of modifying the readonly
         * feature contract.
         */
        const response = await login({
          emailOrPhoneNumber:
            result.data.emailOrPhoneNumber,

          password:
            result.data.password,
        });

        // ---------------------------------------------------------------------
        // Successful Authentication
        // ---------------------------------------------------------------------

        if (onSuccess) {
          await onSuccess(response);
        }
      } catch {
        // ---------------------------------------------------------------------
        // Authentication errors are normalized by useAuthenticateLogin().
        //
        // The normalized error is exposed through the hook's `error` state
        // and presented by LoginError.
        //
        // Raw transport/backend details are intentionally not handled here.
        // ---------------------------------------------------------------------
      }
    },
    [
      isLoading,
      login,
      onSuccess,
      reset,
      values,
    ],
  );

  // ===========================================================================
  // Successful Authentication
  // ===========================================================================
  //
  // The authentication hook has already established the authentication
  // session.
  //
  // The parent page receives the successful response through onSuccess and
  // owns navigation.
  //
  // ===========================================================================

  if (data?.success === true) {
    return null;
  }

  // ===========================================================================
  // Form
  // ===========================================================================

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={className ?? 'space-y-6'}
    >
      <LoginFormHeader />

      <div className="space-y-5">
        {/* -------------------------------------------------------------------
            Credentials
            ------------------------------------------------------------------- */}

        <LoginCredentials
          value={values.emailOrPhoneNumber}
          onChange={handleCredentialsChange}
          error={fieldErrors.emailOrPhoneNumber}
          disabled={isLoading}
        />

        {/* -------------------------------------------------------------------
            Password
            ------------------------------------------------------------------- */}

        <LoginPasswordField
          value={values.password}
          onChange={handlePasswordChange}
          error={fieldErrors.password}
          disabled={isLoading}
        />

        {/* -------------------------------------------------------------------
            Password Recovery
            ------------------------------------------------------------------- */}

        <div className="flex justify-end">
          <LoginForgotPassword
            href={forgotPasswordHref}
            disabled={isLoading}
          />
        </div>

        {/* -------------------------------------------------------------------
            Authentication Error
            ------------------------------------------------------------------- */}

        <LoginError error={error} />

        {/* -------------------------------------------------------------------
            Submit
            ------------------------------------------------------------------- */}

        <LoginSubmit
          isLoading={isLoading}
        />
      </div>
    </form>
  );
}

export default LoginForm;