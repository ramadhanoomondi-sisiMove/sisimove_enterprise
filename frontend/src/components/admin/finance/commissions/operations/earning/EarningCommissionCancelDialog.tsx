
'use client';

import { Button, Dialog } from '@/components/ui';
import type { AdminCancelEarningCommissionModel } from '@/features/admin/finance/commissions/models';

import { CommissionPublicId } from '../../shared/CommissionPublicId';

export interface EarningCommissionCancelDialogProps {
  readonly open: boolean;
  readonly loading?: boolean;
  readonly commissionPublicId: string;
  readonly onClose: () => void;
  readonly onSubmit: (payload: AdminCancelEarningCommissionModel) => void;
}

export function EarningCommissionCancelDialog({
  open,
  loading = false,
  commissionPublicId,
  onClose,
  onSubmit,
}: EarningCommissionCancelDialogProps) {
  function handleSubmit() {
    if (loading) {
      return;
    }

    onSubmit({
      cancelledAt: new Date().toISOString(),
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !loading) {
          onClose();
        }
      }}
      title="Cancel earning commission"
      description="Confirm whether this earning commission should be cancelled."
      size="md"
      closeOnBackdropClick={!loading}
      closeOnEscape={!loading}
      footer={
        <div className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Back
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={handleSubmit}
            loading={loading}
            disabled={loading}
          >
            Confirm cancellation
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-[var(--foreground-secondary)]">
          You are about to cancel earning commission:
        </p>

        <div className="rounded-md border border-[var(--border)] bg-[var(--background-muted)] p-3">
          <CommissionPublicId publicId={commissionPublicId} />
        </div>

        <div
          role="alert"
          className="rounded-md border border-[var(--danger)] bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger)]"
        >
          Cancellation is a consequential lifecycle action. Confirm that
          this is the correct commission before proceeding.
        </div>
      </div>
    </Dialog>
  );
}

export default EarningCommissionCancelDialog;
