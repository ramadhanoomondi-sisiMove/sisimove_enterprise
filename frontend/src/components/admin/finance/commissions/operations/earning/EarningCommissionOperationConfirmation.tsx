
'use client';

import { Button, Dialog } from '@/components/ui';

import { CommissionPublicId } from '../../shared/CommissionPublicId';

export type EarningCommissionConfirmationAction = 'assess' | 'cancel';

export interface EarningCommissionOperationConfirmationProps {
  readonly open: boolean;
  readonly action: EarningCommissionConfirmationAction;
  readonly commissionPublicId: string;
  readonly loading?: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
}

const actionContent: Record<
  EarningCommissionConfirmationAction,
  {
    readonly title: string;
    readonly description: string;
    readonly confirmLabel: string;
    readonly message: string;
  }
> = {
  assess: {
    title: 'Confirm earning commission assessment',
    description: 'Review the commission before confirming assessment.',
    confirmLabel: 'Confirm assessment',
    message:
      'This action will record the assessment timestamp for this earning commission.',
  },
  cancel: {
    title: 'Confirm earning commission cancellation',
    description: 'Review the commission before confirming cancellation.',
    confirmLabel: 'Confirm cancellation',
    message:
      'Cancellation is a consequential lifecycle action. Confirm that this is the correct commission before proceeding.',
  },
};

export function EarningCommissionOperationConfirmation({
  open,
  action,
  commissionPublicId,
  loading = false,
  onClose,
  onConfirm,
}: EarningCommissionOperationConfirmationProps) {
  const content = actionContent[action];
  const isDestructive = action === 'cancel';

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !loading) {
          onClose();
        }
      }}
      title={content.title}
      description={content.description}
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
            variant={isDestructive ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
            disabled={loading}
          >
            {content.confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="rounded-md border border-[var(--border)] bg-[var(--background-muted)] p-3">
          <CommissionPublicId publicId={commissionPublicId} />
        </div>

        <p
          className={`text-sm ${
            isDestructive
              ? 'text-[var(--danger)]'
              : 'text-[var(--foreground-secondary)]'
          }`}
        >
          {content.message}
        </p>
      </div>
    </Dialog>
  );
}

export default EarningCommissionOperationConfirmation;
