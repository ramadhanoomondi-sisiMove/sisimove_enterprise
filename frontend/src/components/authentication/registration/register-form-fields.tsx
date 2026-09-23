// -----------------------------------------------------------------------------
// sisiMove — Registration Form Fields
// -----------------------------------------------------------------------------
//
// Presentation component for the primary registration account fields.
//
// Fields:
//
//     travellerName
//     countryCode
//     email
//     phoneNumber
//
// Password fields are intentionally NOT included here. They are composed by:
//
//     RegisterPasswordFields
//
// Terms acceptance is also composed separately by:
//
//     RegisterTerms
//
// This component does NOT:
//
// - validate field values;
// - submit the registration form;
// - call the registration API;
// - derive a traveller handle;
// - transform values before transport.
//
// Validation remains owned by registerUserSchema.
// Transport mapping remains owned by the registration form/application layer.
//
// Phone-number presentation:
//
// - The user is explicitly told that international format is required.
// - The component does NOT silently convert local numbers.
// - The leading `+` is required.
// - Example: +254 700 000 000
// - Actual validation remains owned by registerUserSchema.
//
// -----------------------------------------------------------------------------

'use client';

// =============================================================================
// Props
// =============================================================================

export interface RegisterFormFieldsProps {
  /**
   * Traveller's name.
   */
  readonly travellerName: string;

  /**
   * ISO 3166-1 alpha-2 country code.
   *
   * Example:
   *
   *     KE
   */
  readonly countryCode: string;

  /**
   * Traveller's email address.
   */
  readonly email: string;

  /**
   * Traveller's phone number.
   *
   * The value is expected to be entered in international format,
   * including the leading +.
   */
  readonly phoneNumber: string;

  /**
   * Called when the traveller name changes.
   */
  readonly onTravellerNameChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;

  /**
   * Called when the country changes.
   */
  readonly onCountryCodeChange: (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => void;

  /**
   * Called when the email changes.
   */
  readonly onEmailChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;

  /**
   * Called when the phone number changes.
   */
  readonly onPhoneNumberChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;

  /**
   * Validation error for traveller name.
   */
  readonly travellerNameError?: string;

  /**
   * Validation error for country.
   */
  readonly countryCodeError?: string;

  /**
   * Validation error for email.
   */
  readonly emailError?: string;

  /**
   * Validation error for phone number.
   */
  readonly phoneNumberError?: string;

  /**
   * Disables all fields while registration is being submitted.
   */
  readonly disabled?: boolean;
}

// =============================================================================
// Component
// =============================================================================

export function RegisterFormFields({
  travellerName,
  countryCode,
  email,
  phoneNumber,
  onTravellerNameChange,
  onCountryCodeChange,
  onEmailChange,
  onPhoneNumberChange,
  travellerNameError,
  countryCodeError,
  emailError,
  phoneNumberError,
  disabled = false,
}: RegisterFormFieldsProps) {
  return (
    <div className="space-y-5">
      {/* ------------------------------------------------------------------ */}
      {/* Traveller Name                                                      */}
      {/* ------------------------------------------------------------------ */}

      <div className="space-y-2">
        <label
          htmlFor="register-traveller-name"
          className="block text-sm font-medium text-slate-900"
        >
          Traveller name
        </label>

        <input
          id="register-traveller-name"
          name="travellerName"
          type="text"
          value={travellerName}
          onChange={onTravellerNameChange}
          autoComplete="name"
          disabled={disabled}
          aria-invalid={travellerNameError ? true : undefined}
          aria-describedby={
            travellerNameError
              ? 'register-traveller-name-error'
              : undefined
          }
          placeholder="Your name"
          className={[
            'block w-full rounded-xl border bg-white px-4 py-3',
            'text-sm text-slate-900 placeholder:text-slate-400',
            'outline-none transition',
            'focus:ring-2 focus:ring-blue-600',
            disabled
              ? 'cursor-not-allowed border-slate-200 bg-slate-50'
              : travellerNameError
                ? 'border-red-300 focus:border-red-500'
                : 'border-slate-300 focus:border-blue-600',
          ].join(' ')}
        />

        {travellerNameError ? (
          <p
            id="register-traveller-name-error"
            role="alert"
            className="text-xs font-medium text-red-600"
          >
            {travellerNameError}
          </p>
        ) : null}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Country + Phone                                                     */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid gap-5 sm:grid-cols-2">
        {/* ---------------------------------------------------------------- */}
        {/* Country                                                           */}
        {/* ---------------------------------------------------------------- */}

        <div className="space-y-2">
          <label
            htmlFor="register-country-code"
            className="block text-sm font-medium text-slate-900"
          >
            Country
          </label>

          <select
            id="register-country-code"
            name="countryCode"
            value={countryCode}
            onChange={onCountryCodeChange}
            autoComplete="country"
            disabled={disabled}
            aria-invalid={countryCodeError ? true : undefined}
            aria-describedby={
              countryCodeError
                ? 'register-country-code-error'
                : undefined
            }
            className={[
              'block w-full rounded-xl border bg-white px-4 py-3',
              'text-sm text-slate-900',
              'outline-none transition',
              'focus:ring-2 focus:ring-blue-600',
              disabled
                ? 'cursor-not-allowed border-slate-200 bg-slate-50'
                : countryCodeError
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-slate-300 focus:border-blue-600',
            ].join(' ')}
          >
            <option value="">Select country</option>
            <option value="KE">Kenya</option>
            <option value="UG">Uganda</option>
            <option value="TZ">Tanzania</option>
            <option value="RW">Rwanda</option>
          </select>

          {countryCodeError ? (
            <p
              id="register-country-code-error"
              role="alert"
              className="text-xs font-medium text-red-600"
            >
              {countryCodeError}
            </p>
          ) : null}
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Phone Number                                                       */}
        {/* ---------------------------------------------------------------- */}

        <div className="space-y-2">
          <label
            htmlFor="register-phone-number"
            className="block text-sm font-medium text-slate-900"
          >
            Phone number
          </label>

          <input
            id="register-phone-number"
            name="phoneNumber"
            type="tel"
            value={phoneNumber}
            onChange={onPhoneNumberChange}
            autoComplete="tel"
            inputMode="tel"
            disabled={disabled}
            aria-invalid={phoneNumberError ? true : undefined}
            aria-describedby={[
              'register-phone-number-help',
              phoneNumberError
                ? 'register-phone-number-error'
                : null,
            ]
              .filter(Boolean)
              .join(' ')}
            placeholder="+254 700 000 000"
            className={[
              'block w-full rounded-xl border bg-white px-4 py-3',
              'text-sm text-slate-900 placeholder:text-slate-400',
              'outline-none transition',
              'focus:ring-2 focus:ring-blue-600',
              disabled
                ? 'cursor-not-allowed border-slate-200 bg-slate-50'
                : phoneNumberError
                  ? 'border-red-300 focus:border-red-500'
                  : 'border-slate-300 focus:border-blue-600',
            ].join(' ')}
          />

          <p
            id="register-phone-number-help"
            className="text-xs leading-5 text-slate-500"
          >
            Enter your phone number in international format, starting with
            <span className="font-medium text-slate-700"> +</span>.
            Example:
            <span className="font-medium text-slate-700">
              {' '}
              +254 700 000 000
            </span>
          </p>

          {phoneNumberError ? (
            <p
              id="register-phone-number-error"
              role="alert"
              className="text-xs font-medium text-red-600"
            >
              {phoneNumberError}
            </p>
          ) : null}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Email                                                               */}
      {/* ------------------------------------------------------------------ */}

      <div className="space-y-2">
        <label
          htmlFor="register-email"
          className="block text-sm font-medium text-slate-900"
        >
          Email
        </label>

        <input
          id="register-email"
          name="email"
          type="email"
          value={email}
          onChange={onEmailChange}
          autoComplete="email"
          inputMode="email"
          disabled={disabled}
          aria-invalid={emailError ? true : undefined}
          aria-describedby={
            emailError ? 'register-email-error' : undefined
          }
          placeholder="you@example.com"
          className={[
            'block w-full rounded-xl border bg-white px-4 py-3',
            'text-sm text-slate-900 placeholder:text-slate-400',
            'outline-none transition',
            'focus:ring-2 focus:ring-blue-600',
            disabled
              ? 'cursor-not-allowed border-slate-200 bg-slate-50'
              : emailError
                ? 'border-red-300 focus:border-red-500'
                : 'border-slate-300 focus:border-blue-600',
          ].join(' ')}
        />

        {emailError ? (
          <p
            id="register-email-error"
            role="alert"
            className="text-xs font-medium text-red-600"
          >
            {emailError}
          </p>
        ) : null}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default RegisterFormFields;

