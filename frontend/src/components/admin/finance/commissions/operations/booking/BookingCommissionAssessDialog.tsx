
'use client';

import {
  Button,
  Dialog,
} from '@/components/ui';

import type {
  AdminAssessBookingCommissionModel,
} from '@/features/admin/finance/commissions/models';

import {
  CommissionPublicId,
} from'@/components/admin/finance/commissions/shared';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface BookingCommissionAssessDialogProps {
  readonly open: boolean;
  readonly loading?: boolean;
  readonly commissionPublicId: string;
  readonly onClose: () => void;
  readonly onSubmit: (
    payload: AdminAssessBookingCommissionModel,
  ) => void;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function BookingCommissionAssessDialog({
  open,
  loading = false,
  commissionPublicId,
  onClose,
  onSubmit,
}: BookingCommissionAssessDialogProps) {

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
      assessedAt: new Date().toISOString(),
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
      title="Assess booking commission"
      description="Confirm the assessment of this booking commission."
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
            variant="primary"
            size="sm"
            loading={loading}
            onClick={handleSubmit}
          >
            Confirm assessment
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
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
          You are about to submit this commission for assessment.
          The assessment timestamp will be recorded when you confirm.
        </p>

        <p className="text-sm leading-6 text-[var(--foreground-secondary)]">
          Please ensure that the commission details have been reviewed
          before proceeding.
        </p>
      </div>
    </Dialog>
  );
}

export default BookingCommissionAssessDialog;
