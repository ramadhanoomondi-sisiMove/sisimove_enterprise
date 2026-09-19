// -----------------------------------------------------------------------------
// sisiMove — Registration Form
// -----------------------------------------------------------------------------
//
// Composition/orchestration component for user registration.
//
// Responsibilities:
// - Own registration form state.
// - Validate form values using the registration schema.
// - Submit only the backend-supported registration fields.
// - Invoke the registration feature hook.
// - Present field errors and submission errors.
// - Transition to the registration-success state after successful registration.
//
// Registration boundary:
//
//     RegisterForm
//         │
//         ├── RegisterFormHeader
//         ├── RegisterFormFields
//         ├── RegisterPasswordFields
//         ├── RegisterTerms
//         ├── RegisterError
//         └── RegisterSubmit
//                  │
//                  ▼
//         useRegisterUser()
//                  │
//                  ▼
//         registerUser()
//                  │
//                  ▼
//         POST /authentications/register
//
// Important:
// - confirmPassword is frontend-only and is NEVER sent to the API.
// - travellerHandle is NOT collected from the user. The backend derives it
//   from travellerName and returns it in the registration response.
// - Successful registration does NOT authenticate the user.
// - Successful registration does NOT create or persist an AuthSession.
// - Successful registration leads to the sign-in experience.
//
// Validation remains owned by the feature schema. This component only maps
// schema results into presentation-friendly field errors.
//
// -----------------------------------------------------------------------------

'use client';

import type { ChangeEvent, FormEvent } from 'react';
import { useCallback, useState } from 'react';

import {
  registerUserSchema,
  useRegisterUser,
  type RegisterUserFormValues,
} from '@/features/authentication/registration';

import { RegisterError } from './register-error';
import { RegisterFormFields } from './register-form-fields';
import { RegisterFormHeader } from './register-form-header';
import { RegisterPasswordFields } from './register-password-fields';
import { RegisterSubmit } from './register-submit';
import { RegisterSuccess } from './register-success';
import { RegisterTerms } from './register-terms';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface RegisterFormProps {
  readonly className?: string;
}

// -----------------------------------------------------------------------------
// Initial form state
// -----------------------------------------------------------------------------

const INITIAL_FORM_VALUES: RegisterUserFormValues = {
  travellerName: '',
  countryCode: 'KE',
  email: '',
  phoneNumber: '',
  password: '',
  confirmPassword: '',
  termsAccepted: false,
};

// -----------------------------------------------------------------------------
// Field errors
// -----------------------------------------------------------------------------

type RegisterFieldName = keyof RegisterUserFormValues;

type RegisterFieldErrors = Partial<
  Record<RegisterFieldName, string>
>;

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function toFieldErrors(
  issues: Array<{
    path: PropertyKey[];
    message: string;
  }>,
): RegisterFieldErrors {
  const errors: RegisterFieldErrors = {};

  for (const issue of issues) {
    const field = issue.path[0];

    if (
      typeof field === 'string' &&
      field in INITIAL_FORM_VALUES &&
      errors[field as RegisterFieldName] === undefined
    ) {
      errors[field as RegisterFieldName] = issue.message;
    }
  }

  return errors;
}

function toRegistrationRequest(
  values: RegisterUserFormValues,
) {
  return {
    travellerName: values.travellerName,
    countryCode: values.countryCode,
    email: values.email,
    phoneNumber: values.phoneNumber,
    password: values.password,
    termsAccepted: values.termsAccepted,
  };
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function RegisterForm({
  className,
}: RegisterFormProps) {
  const [values, setValues] =
    useState<RegisterUserFormValues>(INITIAL_FORM_VALUES);

  const [fieldErrors, setFieldErrors] =
    useState<RegisterFieldErrors>({});

  const {
    isLoading,
    data,
    error,
    register,
    reset,
  } = useRegisterUser();

  // ---------------------------------------------------------------------------
  // Field updates
  // ---------------------------------------------------------------------------

  const updateField = useCallback(
    <K extends keyof RegisterUserFormValues>(
      field: K,
      value: RegisterUserFormValues[K],
    ) => {
      setValues((current) => ({
        ...current,
        [field]: value,
      }));

      setFieldErrors((current) => {
        if (current[field] === undefined) {
          return current;
        }

        const next = { ...current };
        delete next[field];

        return next;
      });
    },
    [],
  );

  const handleTravellerNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateField('travellerName', event.target.value);
    },
    [updateField],
  );

  const handleCountryCodeChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      updateField('countryCode', event.target.value);
    },
    [updateField],
  );

  const handleEmailChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateField('email', event.target.value);
    },
    [updateField],
  );

  const handlePhoneNumberChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateField('phoneNumber', event.target.value);
    },
    [updateField],
  );

  const handlePasswordChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateField('password', event.target.value);
    },
    [updateField],
  );

  const handleConfirmPasswordChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateField('confirmPassword', event.target.value);
    },
    [updateField],
  );

  const handleTermsChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      updateField('termsAccepted', event.target.checked);
    },
    [updateField],
  );

  // ---------------------------------------------------------------------------
  // Submission
  // ---------------------------------------------------------------------------

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setFieldErrors({});

      // The schema is the single frontend validation authority.
      const parsed = registerUserSchema.safeParse(values);

      if (!parsed.success) {
        setFieldErrors(
          toFieldErrors(parsed.error.issues),
        );
        return;
      }

      try {
        reset();

        // Deliberately map the validated form model into the API request.
        //
        // This prevents frontend-only fields such as confirmPassword from
        // crossing the feature/API boundary.
        await register(
          toRegistrationRequest(parsed.data),
        );
      } catch {
        // useRegisterUser owns the normalized error state.
        //
        // No additional error state is required here.
      }
    },
    [register, reset, values],
  );

  // ---------------------------------------------------------------------------
  // Successful registration
  // ---------------------------------------------------------------------------
  //
  // The backend response is authoritative for the derived traveller handle.
  // We do not derive or reconstruct it in the UI.
  //

  if (data?.status === 'REGISTERED') {
    return (
      <div className={className}>
        <RegisterSuccess
          travellerHandle={data.travellerHandle}
        />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Form
  // ---------------------------------------------------------------------------

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={[
        'space-y-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <RegisterFormHeader />

      <RegisterFormFields
        travellerName={values.travellerName}
        countryCode={values.countryCode}
        email={values.email}
        phoneNumber={values.phoneNumber}
        onTravellerNameChange={
          handleTravellerNameChange
        }
        onCountryCodeChange={
          handleCountryCodeChange
        }
        onEmailChange={handleEmailChange}
        onPhoneNumberChange={
          handlePhoneNumberChange
        }
        travellerNameError={
          fieldErrors.travellerName
        }
        countryCodeError={
          fieldErrors.countryCode
        }
        emailError={fieldErrors.email}
        phoneNumberError={
          fieldErrors.phoneNumber
        }
        disabled={isLoading}
      />

      <RegisterPasswordFields
        password={values.password}
        confirmPassword={values.confirmPassword}
        onPasswordChange={handlePasswordChange}
        onConfirmPasswordChange={
          handleConfirmPasswordChange
        }
        passwordError={fieldErrors.password}
        confirmPasswordError={
          fieldErrors.confirmPassword
        }
        disabled={isLoading}
      />

      <RegisterTerms
        checked={values.termsAccepted}
        onChange={handleTermsChange}
        error={fieldErrors.termsAccepted}
        disabled={isLoading}
      />

      <RegisterError error={error} />

      <RegisterSubmit
        isLoading={isLoading}
        disabled={isLoading}
      />
    </form>
  );
}

export default RegisterForm;

