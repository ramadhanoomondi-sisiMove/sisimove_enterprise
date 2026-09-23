// =============================================================================
// sisiMove — Payment Method Form
// =============================================================================
//
// Presentation-only form for creating a FinancialPaymentMethod.
//
// Responsibilities:
// - render payment-method creation fields;
// - display field-level validation errors;
// - expose controlled field changes;
// - expose submit/cancel actions;
// - reflect submission state.
//
// This component does NOT:
// - call the API;
// - use React Query;
// - generate correlation IDs;
// - resolve the Financial Account;
// - perform validation itself;
// - navigate;
// - contain payment-provider business rules;
// - collect sensitive payment credentials.
//
// Technical identifiers such as correlationId and causationId are intentionally
// not rendered as ordinary member-facing fields. The application/container
// layer owns those values and supplies them when constructing the validated
// CreatePaymentMethodFormValues payload.
//
// Validation contract:
//     create-payment-method.schema.ts
//
// API contract:
//     create-payment-method.api.ts
//
// =============================================================================

'use client';

import { Button, Input } from '@/components/ui';

import type { PaymentMethodType } from '@/features/financial-payment-methods';

// -----------------------------------------------------------------------------
// Payment Method Type Option
// -----------------------------------------------------------------------------

/**
 * Presentation option for the payment-method type selector.
 *
 * The value must correspond to the domain-supported payment method types.
 */
export interface PaymentMethodTypeOption {
  value: PaymentMethodType;
  label: string;
  description?: string;
}

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface PaymentMethodFormProps {
  /**
   * Currently selected payment-method type.
   */
  type: PaymentMethodType;

  /**
   * Available payment-method type options.
   *
   * The parent owns the final presentation labels and descriptions.
   */
  typeOptions: PaymentMethodTypeOption[];

  /**
   * External payment provider identifier.
   */
  provider: string;

  /**
   * Optional provider-side reference.
   *
   * This must never contain a PIN, CVV, password, secret token, or other
   * authentication credential.
   */
  providerReference: string;

  /**
   * Optional member-facing display name.
   */
  displayName: string;

  /**
   * Optional safe last-four display metadata.
   */
  lastFour: string;

  /**
   * Whether the payment method should be requested as the default method.
   */
  isDefault: boolean;

  /**
   * Field-level validation errors.
   */
  errors?: {
    type?: string;
    provider?: string;
    providerReference?: string;
    displayName?: string;
    lastFour?: string;
    isDefault?: string;
  };

  /**
   * Whether the form is currently submitting.
   */
  isSubmitting?: boolean;

  /**
   * Optional overall form error supplied by the parent.
   */
  formError?: string;

  /**
   * Called when the payment-method type changes.
   */
  onTypeChange: (type: PaymentMethodType) => void;

  /**
   * Called when the provider changes.
   */
  onProviderChange: (provider: string) => void;

  /**
   * Called when the provider reference changes.
   */
  onProviderReferenceChange: (providerReference: string) => void;

  /**
   * Called when the display name changes.
   */
  onDisplayNameChange: (displayName: string) => void;

  /**
   * Called when the last-four value changes.
   */
  onLastFourChange: (lastFour: string) => void;

  /**
   * Called when the default-method preference changes.
   */
  onIsDefaultChange: (isDefault: boolean) => void;

  /**
   * Called when the form is submitted.
   */
  onSubmit: () => void;

  /**
   * Optional cancellation action.
   */
  onCancel?: () => void;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function PaymentMethodForm({
  type,
  typeOptions,
  provider,
  providerReference,
  displayName,
  lastFour,
  isDefault,
  errors,
  isSubmitting = false,
  formError,
  onTypeChange,
  onProviderChange,
  onProviderReferenceChange,
  onDisplayNameChange,
  onLastFourChange,
  onIsDefaultChange,
  onSubmit,
  onCancel,
}: PaymentMethodFormProps) {
  return (
    <form
      className="space-y-5"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* Form-level error                                                   */}
      {/* ------------------------------------------------------------------ */}

      {formError ? (
        <div
          role="alert"
          className="rounded-[var(--radius-md)] border border-[var(--danger)]/20 bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]"
        >
          {formError}
        </div>
      ) : null}

      {/* ------------------------------------------------------------------ */}
      {/* Payment Method Type                                                */}
      {/* ------------------------------------------------------------------ */}

      <div className="space-y-2">
        <label
          htmlFor="payment-method-type"
          className="block text-sm font-medium text-[var(--foreground)]"
        >
          Payment method type
        </label>

        <select
          id="payment-method-type"
          value={type}
          disabled={isSubmitting}
          aria-invalid={Boolean(errors?.type)}
          aria-describedby={errors?.type ? 'payment-method-type-error' : undefined}
          onChange={(event) =>
            onTypeChange(event.target.value as PaymentMethodType)
          }
          className={[
            'w-full rounded-[var(--radius-md)] border bg-[var(--surface)]',
            'px-3 py-2.5 text-sm text-[var(--foreground)]',
            'outline-none transition',
            'focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/15',
            'disabled:cursor-not-allowed disabled:opacity-60',
            errors?.type
              ? 'border-[var(--danger)]'
              : 'border-[var(--border)]',
          ].join(' ')}
        >
          {typeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {typeOptions.find((option) => option.value === type)?.description ? (
          <p className="text-xs text-[var(--foreground-muted)]">
            {typeOptions.find((option) => option.value === type)?.description}
          </p>
        ) : null}

        {errors?.type ? (
          <p
            id="payment-method-type-error"
            className="text-sm text-[var(--danger)]"
          >
            {errors.type}
          </p>
        ) : null}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Provider                                                           */}
      {/* ------------------------------------------------------------------ */}

      <Input
        id="payment-method-provider"
        label="Payment provider"
        value={provider}
        maxLength={100}
        autoComplete="organization"
        error={errors?.provider}
        disabled={isSubmitting}
        onChange={(event) => onProviderChange(event.target.value)}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Provider Reference                                                 */}
      {/* ------------------------------------------------------------------ */}

      <Input
        id="payment-method-provider-reference"
        label="Provider reference"
        helperText="Use a provider-recognized reference only. Never enter a PIN, CVV, password, or secret token."
        value={providerReference}
        maxLength={255}
        autoComplete="off"
        error={errors?.providerReference}
        disabled={isSubmitting}
        onChange={(event) => onProviderReferenceChange(event.target.value)}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Display Name                                                       */}
      {/* ------------------------------------------------------------------ */}

      <Input
        id="payment-method-display-name"
        label="Display name"
        helperText="Optional name to help you recognize this payment method."
        value={displayName}
        maxLength={100}
        autoComplete="off"
        error={errors?.displayName}
        disabled={isSubmitting}
        onChange={(event) => onDisplayNameChange(event.target.value)}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Last Four                                                          */}
      {/* ------------------------------------------------------------------ */}

      <Input
        id="payment-method-last-four"
        label="Last four"
        helperText="Optional. Enter only the final four characters used to identify the payment method."
        value={lastFour}
        maxLength={4}
        autoComplete="off"
        inputMode="numeric"
        error={errors?.lastFour}
        disabled={isSubmitting}
        onChange={(event) => onLastFourChange(event.target.value)}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Default                                                            */}
      {/* ------------------------------------------------------------------ */}

      <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background-subtle)] px-4 py-3">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={isDefault}
            disabled={isSubmitting}
            aria-invalid={Boolean(errors?.isDefault)}
            onChange={(event) => onIsDefaultChange(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[var(--border-strong)] text-[var(--brand)] focus:ring-[var(--brand)]/20"
          />

          <span className="min-w-0">
            <span className="block text-sm font-medium text-[var(--foreground)]">
              Make this my default payment method
            </span>

            <span className="mt-1 block text-xs text-[var(--foreground-muted)]">
              New payments can use this method automatically when supported.
            </span>

            {errors?.isDefault ? (
              <span className="mt-1 block text-sm text-[var(--danger)]">
                {errors.isDefault}
              </span>
            ) : null}
          </span>
        </label>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Actions                                                            */}
      {/* ------------------------------------------------------------------ */}

      <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={isSubmitting}
            onClick={onCancel}
          >
            Cancel
          </Button>
        ) : null}

        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={isSubmitting}
        >
          Add payment method
        </Button>
      </div>
    </form>
  );
}