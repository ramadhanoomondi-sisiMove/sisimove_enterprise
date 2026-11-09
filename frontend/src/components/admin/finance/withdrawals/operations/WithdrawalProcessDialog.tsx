'use client';

import type { AdminWithdrawalProcessRequest } from '@/features/admin/finance/withdrawals/models/admin-withdrawal-operations.model';
import WithdrawalOperationConfirmation from './WithdrawalOperationConfirmation';

export interface WithdrawalProcessDialogProps {
  open: boolean;
  withdrawalPublicId: string;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: AdminWithdrawalProcessRequest) => void;
}

export function WithdrawalProcessDialog({
  open,
  withdrawalPublicId,
  isSubmitting = false,
  onOpenChange,
  onSubmit,
}: WithdrawalProcessDialogProps) {
  return (
    <WithdrawalOperationConfirmation
      open={open}
      action="PROCESS"
      withdrawalPublicId={withdrawalPublicId}
      isSubmitting={isSubmitting}
      onOpenChange={onOpenChange}
      onConfirm={() => onSubmit({})}
    />
  );
}

export default WithdrawalProcessDialog;