
'use client';

import {
  useRef,
  useState,
  type FormEvent,
} from 'react';

import {
  Button,
  Dialog,
  Input,
} from '@/components/ui';

import type {
  AdminCreateBookingCommissionModel,
} from '@/features/admin/commissions/models';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface BookingCommissionCreateDialogProps {
  readonly open: boolean;
  readonly loading?: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (
    payload: AdminCreateBookingCommissionModel,
  ) => void;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function BookingCommissionCreateDialog({
  open,
  loading = false,
  onClose,
  onSubmit,
}: BookingCommissionCreateDialogProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [validationError, setValidationError] = useState('');

  // ---------------------------------------------------------------------------
  // Close
  // ---------------------------------------------------------------------------

  function handleClose() {
    if (loading) {
      return;
    }

    formRef.current?.reset();
    setValidationError('');
    onClose();
  }

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (loading) {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);

    const commissionRulePublicId = String(
      formData.get('commissionRulePublicId') ?? '',
    ).trim();

    const bookingPublicId = String(
      formData.get('bookingPublicId') ?? '',
    ).trim();

    const journeyPublicId = String(
      formData.get('journeyPublicId') ?? '',
    ).trim();

    const percentage = String(
      formData.get('percentage') ?? '',
    ).trim();

    const baseAmountValue = Number(
      formData.get('baseAmount'),
    );

    const commissionAmountValue = Number(
      formData.get('commissionAmount'),
    );

    const currency = String(
      formData.get('currency') ?? '',
    ).trim();

    if (
      !Number.isSafeInteger(baseAmountValue) ||
      baseAmountValue < 0 ||
      !Number.isSafeInteger(commissionAmountValue) ||
      commissionAmountValue < 0
    ) {
      setValidationError(
        'Base amount and commission amount must be valid non-negative whole numbers.',
      );

      return;
    }

    setValidationError('');

    onSubmit({
      commissionRulePublicId,
      bookingPublicId,
      journeyPublicId,
      percentage,
      baseAmount: baseAmountValue,
      commissionAmount: commissionAmountValue,
      currency,
    });
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          handleClose();
        }
      }}
      title="Create booking commission"
      description="Record a booking commission using the supplied rule, booking references and financial assessment values."
      size="lg"
      closeOnBackdropClick={!loading}
      closeOnEscape={!loading}
      showCloseButton={!loading}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={handleClose}
          >
            Back
          </Button>

          <Button
            type="submit"
            form="booking-commission-create-form"
            variant="primary"
            size="sm"
            loading={loading}
          >
            Create commission
          </Button>
        </div>
      }
    >
      <form
        ref={formRef}
        id="booking-commission-create-form"
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* References */}

        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Commission references
            </h3>

            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              Identify the rule, booking and journey associated with this commission.
            </p>
          </div>

          <Input
            id="commissionRulePublicId"
            name="commissionRulePublicId"
            label="Commission rule public ID"
            placeholder="Enter commission rule public ID"
            required
            disabled={loading}
          />

          <Input
            id="bookingPublicId"
            name="bookingPublicId"
            label="Booking public ID"
            placeholder="Enter booking public ID"
            required
            disabled={loading}
          />

          <Input
            id="journeyPublicId"
            name="journeyPublicId"
            label="Journey public ID"
            placeholder="Enter journey public ID"
            required
            disabled={loading}
          />
        </section>

        {/* Financial assessment */}

        <section className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              Financial assessment
            </h3>

            <p className="mt-1 text-xs text-[var(--foreground-muted)]">
              Enter the supplied historical assessment values. Amounts are expressed in the currency&apos;s smallest unit.
            </p>
          </div>

          <Input
            id="percentage"
            name="percentage"
            label="Commission percentage"
            placeholder="e.g. 10.00"
            type="text"
            inputMode="decimal"
            required
            disabled={loading}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              id="baseAmount"
              name="baseAmount"
              label="Base amount"
              placeholder="Enter base amount"
              type="number"
              min="0"
              step="1"
              required
              disabled={loading}
            />

            <Input
              id="commissionAmount"
              name="commissionAmount"
              label="Commission amount"
              placeholder="Enter commission amount"
              type="number"
              min="0"
              step="1"
              required
              disabled={loading}
            />
          </div>

          <Input
            id="currency"
            name="currency"
            label="Currency"
            placeholder="e.g. KES"
            required
            disabled={loading}
          />
        </section>

        {/* Validation */}

        {validationError && (
          <p
            role="alert"
            className="rounded-[var(--radius-md)] border border-[var(--danger)] bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]"
          >
            {validationError}
          </p>
        )}
      </form>
    </Dialog>
  );
}

export default BookingCommissionCreateDialog;
