
 // =============================================================================
 // sisiMove — M-PESA Payment Method Form
 // =============================================================================
 //
 // Presentation-only form for creating an M-PESA FinancialPaymentMethod.
 //
 // Responsibilities:
 // - collect the member's M-PESA phone number;
 // - collect an optional display name;
 // - expose the default-method preference;
 // - display field-level validation errors;
 // - expose submit/cancel actions;
 // - reflect loading and submission states.
 //
 // Payment method type and provider are fixed by the application:
 //
 //     type     = MOBILE_MONEY
 //     provider = MPESA
 //
 // This component does NOT:
 // - call the API;
 // - generate correlation IDs;
 // - resolve the Financial Account;
 // - perform validation itself;
 // - navigate;
 // - collect payment credentials or M-PESA PINs.
 //
 // =============================================================================

'use client';

import { Button, Input } from '@/components/ui';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface PaymentMethodFormProps {
  /**
   * Member's M-PESA mobile number.
   */
  phoneNumber: string;

  /**
   * Optional member-facing display name.
   */
  displayName: string;

  /**
   * Whether this payment method should become the default.
   */
  isDefault: boolean;

  /**
   * Field-level validation errors.
   */
  errors?: {
    phoneNumber?: string;
    displayName?: string;
    isDefault?: string;
  };

  /**
   * Whether the form is currently submitting.
   */
  isSubmitting?: boolean;

  /**
   * Optional overall form error.
   */
  formError?: string;

  /**
   * Called when the phone number changes.
   */
  onPhoneNumberChange: (phoneNumber: string) => void;

  /**
   * Called when the display name changes.
   */
  onDisplayNameChange: (displayName: string) => void;

  /**
   * Called when the default preference changes.
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
  phoneNumber,
  displayName,
  isDefault,
  errors,
  isSubmitting = false,
  formError,
  onPhoneNumberChange,
  onDisplayNameChange,
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
      {/* M-PESA Phone Number                                                */}
      {/* ------------------------------------------------------------------ */}

      <Input
        id="payment-method-phone-number"
        label="M-PESA phone number"
        helperText="Enter your Kenyan M-PESA number, for example 0712345678 or +254712345678."
        value={phoneNumber}
        maxLength={20}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        error={errors?.phoneNumber}
        disabled={isSubmitting}
        onChange={(event) =>
          onPhoneNumberChange(event.target.value)
        }
      />

      {/* ------------------------------------------------------------------ */}
      {/* Display Name                                                       */}
      {/* ------------------------------------------------------------------ */}

      <Input
        id="payment-method-display-name"
        label="Display name"
        helperText="Optional. For example, My personal M-PESA."
        value={displayName}
        maxLength={100}
        autoComplete="off"
        error={errors?.displayName}
        disabled={isSubmitting}
        onChange={(event) =>
          onDisplayNameChange(event.target.value)
        }
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
            onChange={(event) =>
              onIsDefaultChange(event.target.checked)
            }
            className="mt-0.5 h-4 w-4 rounded border-[var(--border-strong)] text-[var(--brand)] focus:ring-[var(--brand)]/20"
          />

          <span className="min-w-0">
            <span className="block text-sm font-medium text-[var(--foreground)]">
              Make this my default payment method
            </span>

            <span className="mt-1 block text-xs text-[var(--foreground-muted)]">
              You can change your default M-PESA number later.
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
          disabled={isSubmitting}
        >
          Add M-PESA number
        </Button>
      </div>
    </form>
  );
}
