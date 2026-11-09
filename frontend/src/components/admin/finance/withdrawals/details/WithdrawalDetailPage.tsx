'use client';

import { useState } from 'react';

import { useAdminWithdrawal } from '@/features/admin/finance/withdrawals/hooks/useAdminWithdrawal';
import { useAdminWithdrawalOperations } from '@/features/admin/finance/withdrawals/hooks/useAdminWithdrawalOperations';

import type {
  AdminWithdrawalProcessRequest,
  AdminWithdrawalCompleteRequest,
  AdminWithdrawalFailRequest,
  AdminWithdrawalCancelRequest,
} from '@/features/admin/finance/withdrawals/models/admin-withdrawal-operations.model';

import WithdrawalDetailsLayout from './WithdrawalDetailsLayout';
import WithdrawalLoadingState from '../shared/WithdrawalLoadingState';
import WithdrawalErrorState from '../shared/WithdrawalErrorState';

import {
  WithdrawalActionsMenu,
  WithdrawalProcessDialog,
  WithdrawalCompleteDialog,
  WithdrawalFailDialog,
  WithdrawalCancelDialog,
  } from '../operations';

import {
   WithdrawalOperationFeedback,
} from '../feedback';

type WithdrawalAction = 'PROCESS' | 'COMPLETE' | 'FAIL' | 'CANCEL';

export interface WithdrawalDetailPageProps {
  withdrawalPublicId: string;
}

export function WithdrawalDetailPage({
  withdrawalPublicId,
}: WithdrawalDetailPageProps) {
  const [activeAction, setActiveAction] =
    useState<WithdrawalAction | null>(null);

  const [feedback, setFeedback] = useState<{
    variant: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    withdrawal,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminWithdrawal(withdrawalPublicId);

  const {
    processWithdrawal,
    completeWithdrawal,
    failWithdrawal,
    cancelWithdrawal,
    isSubmitting,
  } = useAdminWithdrawalOperations();

  const closeDialog = () => {
    if (!isSubmitting) {
      setActiveAction(null);
    }
  };

  const handleOperation = async (
    operation: () => Promise<unknown>,
    successMessage: string,
  ) => {
    setFeedback(null);

    try {
      await operation();

      setActiveAction(null);

      setFeedback({
        variant: 'success',
        message: successMessage,
      });

      void refetch();
    } catch (operationError) {
      setFeedback({
        variant: 'error',
        message:
          operationError instanceof Error
            ? operationError.message
            : 'The withdrawal operation could not be completed.',
      });
    }
  };

  if (isLoading) {
    return <WithdrawalLoadingState />;
  }

  if (isError || !withdrawal) {
    return (
      <WithdrawalErrorState
        title="Unable to load withdrawal"
        description={
          error instanceof Error
            ? error.message
            : 'The requested withdrawal could not be found.'
        }
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Withdrawal Operations
          </h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
            Manage the lifecycle of this withdrawal request.
          </p>
        </div>

        <WithdrawalActionsMenu
          withdrawal={withdrawal}
          onAction={(action) => {
            setFeedback(null);
            setActiveAction(action);
          }}
          disabled={isSubmitting}
        />
      </div>

      {feedback && (
        <WithdrawalOperationFeedback
          variant={feedback.variant}
          message={feedback.message}
        />
      )}

      <WithdrawalDetailsLayout withdrawal={withdrawal} />

      <WithdrawalProcessDialog
        open={activeAction === 'PROCESS'}
        withdrawalPublicId={withdrawal.publicId}
        isSubmitting={isSubmitting}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
        onSubmit={(payload: AdminWithdrawalProcessRequest) =>
          handleOperation(
            () => processWithdrawal(withdrawal.publicId, payload),
            'Withdrawal successfully moved to processing.',
          )
        }
      />

      <WithdrawalCompleteDialog
        open={activeAction === 'COMPLETE'}
        withdrawalPublicId={withdrawal.publicId}
        isSubmitting={isSubmitting}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
        onSubmit={(payload: AdminWithdrawalCompleteRequest) =>
          handleOperation(
            () => completeWithdrawal(withdrawal.publicId, payload),
            'Withdrawal successfully completed.',
          )
        }
      />

      <WithdrawalFailDialog
        open={activeAction === 'FAIL'}
        withdrawalPublicId={withdrawal.publicId}
        isSubmitting={isSubmitting}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
        onSubmit={(payload: AdminWithdrawalFailRequest) =>
          handleOperation(
            () => failWithdrawal(withdrawal.publicId, payload),
            'Withdrawal marked as failed.',
          )
        }
      />

      <WithdrawalCancelDialog
        open={activeAction === 'CANCEL'}
        withdrawalPublicId={withdrawal.publicId}
        isSubmitting={isSubmitting}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
        onSubmit={(payload: AdminWithdrawalCancelRequest) =>
          handleOperation(
            () => cancelWithdrawal(withdrawal.publicId, payload),
            'Withdrawal successfully cancelled.',
          )
        }
      />
    </div>
  );
}

export default WithdrawalDetailPage;