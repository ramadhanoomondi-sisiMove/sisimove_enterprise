
'use client';

import {
  Button,
  Dialog,
} from '@/components/ui';

import type {
  AdminCancelBookingCommissionModel,
} from '@/features/admin/commissions/models';

import {
  CommissionPublicId,
} from '@/components/admin/commissions/shared';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface BookingCommissionCancelDialogProps {
  readonly open: boolean;
  readonly loading?: boolean;
  readonly commissionPublicId: string;
  readonly onClose: () => void;
  readonly onSubmit: (
    payload: AdminCancelBookingCommissionModel,
  ) => void;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function BookingCommissionCancelDialog({
  open,
  loading = false,
  commissionPublicId,
  onClose,
  onSubmit,
}: BookingCommissionCancelDialogProps) {

  // ---------------------------------------------------------------------------
  // Close
  // ---------------------------------------------------------------------------

  function handleClose() {
    if (loading) {
      return;
    }

    onClose();
  }

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  function handleSubmit() {
    if (loading) {
      return;
    }

    onSubmit({
      cancelledAt: new Date().toISOString(),
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
      title="Cancel booking commission"
      description="Confirm the cancellation of this booking commission."
      size="md"
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
            type="button"
            variant="danger"
            size="sm"
            loading={loading}
            onClick={handleSubmit}
          >
            Confirm cancellation
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="rounded-[var(--radius-md)] border border-[var(--danger)] bg-[var(--danger-soft)] p-4">
          <p className="text-sm font-semibold text-[var(--danger)]">
            Cancellation confirmation
          </p>

          <p className="mt-1 text-sm leading-6 text-[var(--foreground-secondary)]">
            You are about to submit this booking commission for
            cancellation. Review the commission reference before
            proceeding.
          </p>
        </div>

        <div className="rounded-[var(--radius-md)] border border-[var(--border)] bg-[var(--background-muted)] p-4">
          <p className="text-xs font-medium text-[var(--foreground-secondary)]">
            Commission public ID
          </p>

          <div className="mt-2">
            <CommissionPublicId
              publicId={commissionPublicId}
              copyable
            />
          </div>
        </div>

        <p className="text-sm leading-6 text-[var(--foreground-secondary)]">
          The cancellation timestamp will be recorded when you confirm.
        </p>
      </div>
    </Dialog>
  );
}

export default BookingCommissionCancelDialog;
