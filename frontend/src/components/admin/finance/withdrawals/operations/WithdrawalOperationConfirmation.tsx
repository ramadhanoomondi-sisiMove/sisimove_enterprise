'use client';

import { Button, Dialog } from '@/components/ui';
import type { AdminWithdrawalAction } from '@/features/admin/finance/withdrawals/models/admin-withdrawal.enums';
import { cn } from '@/foundation/utils/cn';
import WithdrawalInlineAlert from '../feedback/WithdrawalInlineAlert';

export interface WithdrawalOperationConfirmationProps {
  open: boolean;
  action: AdminWithdrawalAction;
  withdrawalPublicId: string;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  className?: string;
}

const ACTION_COPY: Record<
  AdminWithdrawalAction,
  { title: string; description: string; confirmLabel: string }
> = {
  PROCESS: {
    title: 'Process withdrawal',
    description: 'Move this withdrawal from Pending to Processing.',
    confirmLabel: 'Confirm processing',
  },
  COMPLETE: {
    title: 'Complete withdrawal',
    description: 'Mark this withdrawal as completed.',
    confirmLabel: 'Complete withdrawal',
  },
  FAIL: {
    title: 'Fail withdrawal',
    description: 'Mark this withdrawal as failed.',
    confirmLabel: 'Mark as failed',
  },
  CANCEL: {
    title: 'Cancel withdrawal',
    description: 'Cancel this withdrawal.',
    confirmLabel: 'Cancel withdrawal',
  },
};

export function WithdrawalOperationConfirmation({
  open,
  action,
  withdrawalPublicId,
  isSubmitting = false,
  onOpenChange,
  onConfirm,
  className,
}: WithdrawalOperationConfirmationProps) {
  const copy = ACTION_COPY[action];

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title={copy.title}
      description={copy.description}
      size="md"
      className={className}
      footer={
        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Go back
          </Button>
          <Button
            variant={action === 'CANCEL' || action === 'FAIL' ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={isSubmitting}
          >
            {copy.confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <p className="break-all font-mono text-sm text-[var(--foreground)]">
          {withdrawalPublicId}
        </p>

        {action === 'PROCESS' && (
          <WithdrawalInlineAlert variant="warning" title="Processing does not send money">
            This action only changes the withdrawal status to Processing. It does
            not create or execute a financial disbursement.
          </WithdrawalInlineAlert>
        )}

        {action === 'COMPLETE' && (
          <WithdrawalInlineAlert variant="info">
            Only confirm completion after the disbursement has actually succeeded.
          </WithdrawalInlineAlert>
        )}
      </div>
    </Dialog>
  );
}

export default WithdrawalOperationConfirmation;