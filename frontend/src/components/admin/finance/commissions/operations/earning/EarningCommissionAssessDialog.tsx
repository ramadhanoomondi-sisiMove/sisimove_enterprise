
'use client';

import { Button, Dialog } from '@/components/ui';
import type { AdminAssessEarningCommissionModel } from '@/features/admin/finance/commissions/models';

import { CommissionPublicId } from '../../shared/CommissionPublicId';

export interface EarningCommissionAssessDialogProps {
  readonly open: boolean;
  readonly loading?: boolean;
  readonly commissionPublicId: string;
  readonly onClose: () => void;
  readonly onSubmit: (payload: AdminAssessEarningCommissionModel) => void;
}

export function EarningCommissionAssessDialog({
  open,
  loading = false,
  commissionPublicId,
  onClose,
  onSubmit,
}: EarningCommissionAssessDialogProps) {
  function handleSubmit() {
    if (loading) {
      return;
    }

    onSubmit({
      assessedAt: new Date().toISOString(),
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
      title="Assess earning commission"
      description="Confirm that this earning commission should be assessed."
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
            variant="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={loading}
          >
            Confirm assessment
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-[var(--foreground-secondary)]">
          You are about to assess earning commission:
        </p>

        <div className="rounded-md border border-[var(--border)] bg-[var(--background-muted)] p-3">
          <CommissionPublicId publicId={commissionPublicId} />
        </div>

        <p className="text-sm text-[var(--foreground-secondary)]">
          This action records the assessment timestamp. Continue only if
          the commission is ready for assessment.
        </p>
      </div>
    </Dialog>
  );
}

export default EarningCommissionAssessDialog;
