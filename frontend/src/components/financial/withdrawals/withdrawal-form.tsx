'use client';

// -----------------------------------------------------------------------------
// sisiMove — Withdrawal Form
// -----------------------------------------------------------------------------
//
// Presentation component for requesting a wallet withdrawal.
//
// Backend aggregate:
//
// FinancialAccountWithdrawal
// ├── amount
// ├── currency
// ├── destinationType
// └── destinationValue
//
// This component is intentionally presentation-only.
//
// Responsibilities:
// - present the available balance;
// - collect the withdrawal amount;
// - let the user choose whether to use their registered number or provide
//   another destination;
// - collect the destination value when required;
// - present validation and submission errors;
// - expose Cancel / Withdraw actions.
//
// This component does NOT:
// - fetch the financial account;
// - fetch the registered phone number;
// - create the withdrawal;
// - generate correlation/causation IDs;
// - calculate authoritative fees;
// - perform mutations;
// - decide whether a destination is valid from a business perspective.
//
// The container/hook layer owns those responsibilities.
//
// Important:
// FinancialAccountWithdrawal.destinationValue is persisted as part of the
// withdrawal request. This is deliberately different from maintaining a
// separate user-managed withdrawal-destination aggregate.
//
// -----------------------------------------------------------------------------

import type { FormEvent, ReactNode } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type WithdrawalDestinationType =
  | 'MOBILE_MONEY'
  | 'BANK_ACCOUNT'
  | 'OTHER';

export type WithdrawalDestinationMode =
  | 'REGISTERED_NUMBER'
  | 'OTHER_DESTINATION';

export interface WithdrawalDestinationTypeOption {
  value: WithdrawalDestinationType;
  label: string;
  description?: string;
}

export interface WithdrawalFormProps {
  /**
   * Available wallet balance in integer minor units.
   *
   * Example:
   * 450000 = KES 4,500.00
   */
  availableAmount: number;

  /**
   * Currency displayed by the form.
   *
   * Defaults to KES when omitted.
   */
  currency?: string;

  /**
   * Formatted available-balance value.
   *
   * Formatting belongs outside this component so the presentation layer does
   * not introduce another financial amount formatter.
   */
  availableAmountLabel: string;

  /**
   * Current withdrawal amount input.
   *
   * The form treats this as a controlled value.
   */
  amount: string;

  /**
   * Called whenever the amount changes.
   */
  onAmountChange: (value: string) => void;

  /**
   * Current destination mode.
   *
   * REGISTERED_NUMBER means the user's registered number will be used.
   * OTHER_DESTINATION means the user provides the destination explicitly.
   */
  destinationMode: WithdrawalDestinationMode;

  /**
   * Called when the user changes destination mode.
   */
  onDestinationModeChange: (
    mode: WithdrawalDestinationMode,
  ) => void;

  /**
   * Destination type sent to FinancialAccountWithdrawal.
   */
  destinationType: WithdrawalDestinationType;

  /**
   * Called when the destination type changes.
   */
  onDestinationTypeChange: (
    type: WithdrawalDestinationType,
  ) => void;

  /**
   * Destination value for an explicitly supplied destination.
   *
   * For example:
   * - mobile-money number;
   * - bank account reference;
   * - another provider-supported destination value.
   */
  destinationValue: string;

  /**
   * Called whenever the explicit destination value changes.
   */
  onDestinationValueChange: (value: string) => void;

  /**
   * Destination type options supported by the backend/application.
   *
   * The container should supply these rather than this component inventing
   * provider-specific business rules.
   */
  destinationTypeOptions: readonly WithdrawalDestinationTypeOption[];

  /**
   * Registered number shown to the user.
   *
   * This should already be masked/presentation-safe when necessary.
   */
  registeredNumber?: string;

  /**
   * Optional amount validation error.
   */
  amountError?: string;

  /**
   * Optional destination validation error.
   */
  destinationError?: string;

  /**
   * Optional general form error returned by the application layer.
   */
  formError?: string;

  /**
   * Whether the withdrawal mutation is currently being submitted.
   */
  isSubmitting?: boolean;

  /**
   * Whether the form is currently valid enough to submit.
   *
   * Business/schema validation should normally be performed by the container
   * or feature schema rather than duplicated here.
   */
  isSubmitDisabled?: boolean;

  /**
   * Called when the user cancels the withdrawal flow.
   */
  onCancel: () => void;

  /**
   * Called when the form is submitted.
   */
  onSubmit: () => void;

  /**
   * Optional additional content rendered below the form.
   *
   * Useful for container-owned informational messages without making this
   * component responsible for their content.
   */
  footerContent?: ReactNode;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawalForm({
  currency = 'KES',
  availableAmountLabel,
  amount,
  onAmountChange,
  destinationMode,
  onDestinationModeChange,
  destinationType,
  onDestinationTypeChange,
  destinationValue,
  onDestinationValueChange,
  destinationTypeOptions,
  registeredNumber,
  amountError,
  destinationError,
  formError,
  isSubmitting = false,
  isSubmitDisabled = false,
  onCancel,
  onSubmit,
  footerContent,
}: WithdrawalFormProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting || isSubmitDisabled) {
      return;
    }

    onSubmit();
  };

  const hasRegisteredNumber = Boolean(
    registeredNumber && registeredNumber.trim().length > 0,
  );

  return (
    <Card
      variant="outlined"
      padding="lg"
      className="w-full"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        noValidate
      >
        {/* ----------------------------------------------------------------- */}
        {/* Available balance                                                 */}
        {/* ----------------------------------------------------------------- */}
        <section
          aria-label="Available balance"
          className="rounded-xl border border-slate-200 bg-slate-50 p-4"
        >
          <p className="text-xs font-medium uppercase tracking-[0.08em] text-slate-500">
            Available
          </p>

          <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
            {availableAmountLabel}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Amount available to withdraw from your {currency} wallet.
          </p>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* Amount                                                             */}
        {/* ----------------------------------------------------------------- */}
        <div className="space-y-2">
          <Input
            label="Amount"
            name="withdrawal-amount"
            inputMode="decimal"
            autoComplete="off"
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
            error={amountError}
            fullWidth
            placeholder="0.00"
            disabled={isSubmitting}
            aria-describedby="withdrawal-amount-help"
          />

          <p
            id="withdrawal-amount-help"
            className="text-xs text-slate-500"
          >
            Maximum available: {availableAmountLabel}
          </p>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Destination                                                        */}
        {/* ----------------------------------------------------------------- */}
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold text-slate-900">
            Send money to
          </legend>

          {/* Registered number option */}
          <label
            className={[
              'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors',
              destinationMode === 'REGISTERED_NUMBER'
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-200 bg-white hover:border-slate-300',
            ].join(' ')}
          >
            <input
              type="radio"
              name="withdrawal-destination-mode"
              value="REGISTERED_NUMBER"
              checked={destinationMode === 'REGISTERED_NUMBER'}
              onChange={() =>
                onDestinationModeChange('REGISTERED_NUMBER')
              }
              disabled={isSubmitting || !hasRegisteredNumber}
              className="mt-1 h-4 w-4"
            />

            <span className="min-w-0">
              <span className="block text-sm font-medium text-slate-900">
                My registered number
              </span>

              {hasRegisteredNumber ? (
                <span className="mt-1 block text-sm text-slate-500">
                  {registeredNumber}
                </span>
              ) : (
                <span className="mt-1 block text-sm text-slate-500">
                  No registered number is available for withdrawals.
                </span>
              )}
            </span>
          </label>

          {/* Explicit destination option */}
          <label
            className={[
              'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors',
              destinationMode === 'OTHER_DESTINATION'
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-200 bg-white hover:border-slate-300',
            ].join(' ')}
          >
            <input
              type="radio"
              name="withdrawal-destination-mode"
              value="OTHER_DESTINATION"
              checked={destinationMode === 'OTHER_DESTINATION'}
              onChange={() =>
                onDestinationModeChange('OTHER_DESTINATION')
              }
              disabled={isSubmitting}
              className="mt-1 h-4 w-4"
            />

            <span className="min-w-0">
              <span className="block text-sm font-medium text-slate-900">
                Another destination
              </span>

              <span className="mt-1 block text-sm text-slate-500">
                Provide the number or account details for this withdrawal.
              </span>
            </span>
          </label>
        </fieldset>

        {/* ----------------------------------------------------------------- */}
        {/* Explicit destination fields                                       */}
        {/* ----------------------------------------------------------------- */}
        {destinationMode === 'OTHER_DESTINATION' && (
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4">
            <div>
              <label
                htmlFor="withdrawal-destination-type"
                className="mb-2 block text-sm font-medium text-slate-900"
              >
                Destination type
              </label>

              <select
                id="withdrawal-destination-type"
                name="withdrawal-destination-type"
                value={destinationType}
                onChange={(event) =>
                  onDestinationTypeChange(
                    event.target.value as WithdrawalDestinationType,
                  )
                }
                disabled={isSubmitting}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                {destinationTypeOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </option>
                ))}
              </select>

              {destinationTypeOptions.find(
                (option) => option.value === destinationType,
              )?.description && (
                <p className="mt-1.5 text-xs text-slate-500">
                  {
                    destinationTypeOptions.find(
                      (option) => option.value === destinationType,
                    )?.description
                  }
                </p>
              )}
            </div>

            <Input
              label="Destination"
              name="withdrawal-destination-value"
              value={destinationValue}
              onChange={(event) =>
                onDestinationValueChange(event.target.value)
              }
              error={destinationError}
              fullWidth
              autoComplete="off"
              disabled={isSubmitting}
              placeholder={
                destinationType === 'MOBILE_MONEY'
                  ? 'e.g. 0712 345 678'
                  : destinationType === 'BANK_ACCOUNT'
                    ? 'Enter bank account details'
                    : 'Enter destination details'
              }
              helperText="Use the destination details required for the selected destination type."
            />
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* General form error                                                 */}
        {/* ----------------------------------------------------------------- */}
        {formError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {formError}
          </div>
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Container-owned supporting content                                 */}
        {/* ----------------------------------------------------------------- */}
        {footerContent}

        {/* ----------------------------------------------------------------- */}
        {/* Actions                                                            */}
        {/* ----------------------------------------------------------------- */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isSubmitting}
            disabled={isSubmitDisabled}
            className="w-full sm:w-auto"
          >
            Withdraw
          </Button>
        </div>
      </form>
    </Card>
  );
}