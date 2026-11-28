
'use client';

import { useState, type FormEvent } from 'react';

import { Button, Dialog, Input } from '@/components/ui';
import type { AdminCreateEarningCommissionModel } from '@/features/admin/finance/commissions/models';

export interface EarningCommissionCreateDialogProps {
  readonly open: boolean;
  readonly loading?: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (payload: AdminCreateEarningCommissionModel) => void;
}

const FORM_ID = 'earning-commission-create-form';

function readRequiredText(
  formData: FormData,
  fieldName: string,
): string | null {
  const value = formData.get(fieldName);

  if (typeof value !== 'string') {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function readNonNegativeInteger(
  formData: FormData,
  fieldName: string,
): number | null {
  const value = formData.get(fieldName);

  if (typeof value !== 'string' || value.trim() === '') {
    return null;
  }

  const parsedValue = Number(value);

  if (
    !Number.isSafeInteger(parsedValue) ||
    parsedValue < 0
  ) {
    return null;
  }

  return parsedValue;
}

export function EarningCommissionCreateDialog({
  open,
  loading = false,
  onClose,
  onSubmit,
}: EarningCommissionCreateDialogProps) {
  const [validationError, setValidationError] = useState<string | null>(
    null,
  );

  function handleClose() {
    setValidationError(null);
    onClose();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    const formData = new FormData(event.currentTarget);

    const commissionRulePublicId = readRequiredText(
      formData,
      'commissionRulePublicId',
    );
    const journeyPublicId = readRequiredText(
      formData,
      'journeyPublicId',
    );
    const settlementPublicId = readRequiredText(
      formData,
      'settlementPublicId',
    );
    const providerPublicId = readRequiredText(
      formData,
      'providerPublicId',
    );
    const percentage = readRequiredText(formData, 'percentage');
    const currency = readRequiredText(formData, 'currency');

    const baseAmount = readNonNegativeInteger(
      formData,
      'baseAmount',
    );
    const commissionAmount = readNonNegativeInteger(
      formData,
      'commissionAmount',
    );
    const netAmount = readNonNegativeInteger(
      formData,
      'netAmount',
    );

    if (
      !commissionRulePublicId ||
      !journeyPublicId ||
      !settlementPublicId ||
      !providerPublicId ||
      !percentage ||
      !currency
    ) {
      setValidationError('Complete all required fields before continuing.');
      return;
    }

    if (
      baseAmount === null ||
      commissionAmount === null ||
      netAmount === null
    ) {
      setValidationError(
        'Enter valid non-negative whole-number amounts for all monetary fields.',
      );
      return;
    }

    setValidationError(null);

    onSubmit({
      commissionRulePublicId,
      journeyPublicId,
      settlementPublicId,
      providerPublicId,
      percentage,
      baseAmount,
      commissionAmount,
      netAmount,
      currency,
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
        }
      }}
      title="Create earning commission"
      description="Record the commission details associated with a provider settlement and journey."
      size="lg"
      closeOnBackdropClick={!loading}
      closeOnEscape={!loading}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Back
          </Button>

          <Button
            type="submit"
            form={FORM_ID}
            variant="primary"
            loading={loading}
            disabled={loading}
          >
            Create commission
          </Button>
        </div>
      }
    >
      <form
        id={FORM_ID}
        onSubmit={handleSubmit}
        className="space-y-5"
        noValidate
      >
        {validationError && (
          <div
            role="alert"
            className="rounded-md border border-[var(--danger)] bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]"
          >
            {validationError}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            name="commissionRulePublicId"
            label="Commission rule public ID"
            placeholder="Enter commission rule ID"
            required
            fullWidth
            disabled={loading}
          />

          <Input
            name="providerPublicId"
            label="Provider public ID"
            placeholder="Enter provider ID"
            required
            fullWidth
            disabled={loading}
          />

          <Input
            name="journeyPublicId"
            label="Journey public ID"
            placeholder="Enter journey ID"
            required
            fullWidth
            disabled={loading}
          />

          <Input
            name="settlementPublicId"
            label="Settlement public ID"
            placeholder="Enter settlement ID"
            required
            fullWidth
            disabled={loading}
          />
        </div>

        <div className="border-t border-[var(--border)] pt-4">
          <h3 className="mb-3 text-sm font-semibold text-[var(--foreground)]">
            Commission assessment values
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              name="percentage"
              label="Commission percentage"
              placeholder="e.g. 10.00"
              required
              fullWidth
              disabled={loading}
            />

            <Input
              name="currency"
              label="Currency"
              placeholder="e.g. KES"
              required
              fullWidth
              disabled={loading}
            />

            <Input
              name="baseAmount"
              label="Base amount (minor units)"
              type="number"
              min="0"
              step="1"
              placeholder="Enter base amount"
              required
              fullWidth
              disabled={loading}
            />

            <Input
              name="commissionAmount"
              label="Commission amount (minor units)"
              type="number"
              min="0"
              step="1"
              placeholder="Enter commission amount"
              required
              fullWidth
              disabled={loading}
            />

            <Input
              name="netAmount"
              label="Net amount (minor units)"
              type="number"
              min="0"
              step="1"
              placeholder="Enter net amount"
              required
              fullWidth
              disabled={loading}
            />
          </div>

          <p className="mt-3 text-xs text-[var(--foreground-secondary)]">
            Enter monetary values in the currency&apos;s smallest unit.
            Commission and net amounts are recorded exactly as entered;
            this form does not calculate them.
          </p>
        </div>
      </form>
    </Dialog>
  );
}

export default EarningCommissionCreateDialog;
