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
// The feature hook owns the application authentication workflow.
// This component owns only the form interaction boundary.
//
// Import boundary:
//
// - Feature dependencies are imported from the authentication feature.
// - Sibling presentation components are imported directly.
// - This component must not import from './index' because that barrel exports
//   LoginForm itself and would introduce an unnecessary circular dependency.
//
// -----------------------------------------------------------------------------

'use client';

import type { ChangeEvent, FormEvent } from 'react';
import { useCallback, useState } from 'react';

import {
  authenticateLoginSchema,
  useAuthenticateLogin,
  type AuthenticateLoginFormValues,
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
   *
   * Once the route exists, the parent can provide the real route without
   * changing the form implementation.
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

// =============================================================================
// Initial Form State
// =============================================================================

const INITIAL_FORM_VALUES: AuthenticateLoginFormValues = {
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
  const errors: {
    emailOrPhoneNumber?: string;
    password?: string;
  } = {};

  for (const issue of issues) {
    const field = issue.path[0];

    if (
      field === 'emailOrPhoneNumber' &&
      errors.emailOrPhoneNumber === undefined
    ) {
      errors.emailOrPhoneNumber = issue.message;
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
  const [values, setValues] =
    useState<AuthenticateLoginFormValues>(
      INITIAL_FORM_VALUES,
    );

  const [fieldErrors, setFieldErrors] =
    useState<LoginFieldErrors>(
      createInitialFieldErrors,
    );

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

      setFieldErrors(createInitialFieldErrors());
      reset();

      const result =
        authenticateLoginSchema.safeParse(values);

      if (!result.success) {
        setFieldErrors(
          getFieldErrors(result.error.issues),
        );

        return;
      }

      try {
        const response = await login({
          emailOrPhoneNumber:
            result.data.emailOrPhoneNumber,

          password: result.data.password,
        });

        if (onSuccess) {
          await onSuccess(response);
        }
      } catch {
        // ---------------------------------------------------------------------
        // Authentication errors are owned by the login hook.
        //
        // The hook normalizes the caught error and exposes it through `error`.
        // LoginError is responsible for presenting the safe user-facing
        // message.
        //
        // The form intentionally does not expose raw transport/backend
        // details.
        // ---------------------------------------------------------------------
      }
    },
    [
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
  // AuthenticationProvider has already received and persisted the session
  // through useAuthenticateLogin before `data` becomes available.
  //
  // The form therefore has nothing further to render after successful login.
  //
  // The parent may use `onSuccess` for navigation or another application-level
  // transition.
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
        -------------------------------------------------------------------
            The route is temporarily "#". The link is intentionally visible
            now so the final login composition can be reviewed visually.
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
