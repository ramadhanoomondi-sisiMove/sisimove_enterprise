
'use client';

// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Transaction Detail Page
// -----------------------------------------------------------------------------
//
// Loads one financial transaction by public ID.
// Displays transaction details, references, ledger entries and audit metadata.
// Supports COMPLETE, FAIL, REVERSE and CANCEL through existing mutations.
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';

import {
  useAdminFinancialTransaction,
  useAdminFinancialTransactionOperations,
} from '@/features/admin/finance/transactions/hooks';

import {
  AdminFinancialTransactionOperation,
} from '@/features/admin/finance/transactions/models';

import type {
  AdminFinancialTransactionOperation as TransactionOperation,
} from '@/features/admin/finance/transactions/models';

import {
  TransactionLoadingState,
  TransactionErrorState,
  TransactionIdentityPanel,
  TransactionInformationPanel,
  TransactionAccountReferencesPanel,
  TransactionBusinessReferencePanel,
  TransactionAccountingReferencePanel,
  TransactionAuditInformation,
  TransactionEntriesPanel,
  TransactionActionsMenu,
  TransactionOperationDialog,
  TransactionOperationFeedback,
} from '@/components/admin/finance/transactions';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return 'The request could not be completed. Please try again.';
}

function createCorrelationId(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }

  return `admin-tx-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function FinancialTransactionDetailPage() {
  const params = useParams<{ publicId: string }>();
  const router = useRouter();

  const publicId =
    typeof params.publicId === 'string' ? params.publicId.trim() : '';

  const transactionQuery = useAdminFinancialTransaction(
    publicId || undefined,
  );

  const { refetch: refetchTransaction } = transactionQuery;
  const operations = useAdminFinancialTransactionOperations();
  const transaction = transactionQuery.transaction;

  const [selectedOperation, setSelectedOperation] =
    useState<TransactionOperation | null>(null);

  const [reason, setReason] = useState('');
  const [operationError, setOperationError] = useState<string | undefined>();

  const [feedback, setFeedback] = useState<{
    kind: 'success' | 'error';
    message: string;
  } | null>(null);

  // ---------------------------------------------------------------------------
  // Navigation and loading recovery
  // ---------------------------------------------------------------------------

  const handleBack = useCallback(() => {
    router.push(ADMIN_ROUTES.FINANCE_TRANSACTIONS);
  }, [router]);

  const handleRetry = useCallback(() => {
    void refetchTransaction();
  }, [refetchTransaction]);

  // ---------------------------------------------------------------------------
  // Operation dialog
  // ---------------------------------------------------------------------------

  const handleSelectOperation = useCallback(
    (operation: TransactionOperation) => {
      setFeedback(null);
      setOperationError(undefined);
      setReason('');
      setSelectedOperation(operation);
    },
    [],
  );

  const handleReasonChange = useCallback((nextReason: string) => {
    setReason(nextReason);
    setOperationError(undefined);
  }, []);

  const handleCloseOperation = useCallback(() => {
    if (operations.isPending) return;

    setSelectedOperation(null);
    setReason('');
    setOperationError(undefined);
  }, [operations.isPending]);

  const handleConfirmOperation = useCallback(
    async (submittedReason: string) => {
      if (!transaction || !selectedOperation || operations.isPending) {
        return;
      }

      const normalizedReason = submittedReason.trim();

      if (!normalizedReason) {
        setOperationError('A reason is required for this operation.');
        return;
      }

      setOperationError(undefined);
      setFeedback(null);

      const correlationId = createCorrelationId();

      try {
        switch (selectedOperation) {
          case AdminFinancialTransactionOperation.COMPLETE: {
            await operations.completeTransaction.mutateAsync({
              transactionPublicId: transaction.publicId,
              request: { correlationId },
            });
            break;
          }

          case AdminFinancialTransactionOperation.FAIL: {
            await operations.failTransaction.mutateAsync({
              transactionPublicId: transaction.publicId,
              request: {
                correlationId,
                reason: normalizedReason,
              },
            });
            break;
          }

          case AdminFinancialTransactionOperation.REVERSE: {
            await operations.reverseTransaction.mutateAsync({
              transactionPublicId: transaction.publicId,
              request: {
                correlationId,
                reason: normalizedReason,
              },
            });
            break;
          }

          case AdminFinancialTransactionOperation.CANCEL: {
            await operations.cancelTransaction.mutateAsync({
              transactionPublicId: transaction.publicId,
              request: {
                correlationId,
                reason: normalizedReason,
              },
            });
            break;
          }

          default: {
            const exhaustiveCheck: never = selectedOperation;

            throw new Error(
              `Unsupported transaction operation: ${exhaustiveCheck}`,
            );
          }
        }

        setSelectedOperation(null);
        setReason('');
        setOperationError(undefined);

        setFeedback({
          kind: 'success',
          message: `The ${selectedOperation.toLowerCase()} operation completed successfully for transaction ${transaction.publicId}.`,
        });

        await refetchTransaction();
      } catch (error: unknown) {
        setSelectedOperation(null);
        setReason('');
        setOperationError(undefined);

        setFeedback({
          kind: 'error',
          message: `The ${selectedOperation.toLowerCase()} operation failed: ${getErrorMessage(error)}`,
        });
      }
    },
    [transaction, selectedOperation, operations, refetchTransaction],
  );

  // ---------------------------------------------------------------------------
  // Missing identifier
  // ---------------------------------------------------------------------------

  if (!publicId) {
    return (
      <main className="page-shell">
        <div className="page-container">
          <section className="surface space-y-4 p-6">
            <h1 className="text-lg font-semibold text-[var(--foreground)]">
              Transaction identifier missing
            </h1>

            <p className="text-sm text-[var(--foreground-secondary)]">
              A financial transaction public ID is required to open this page.
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              leadingIcon={<ArrowLeft className="size-4" />}
            >
              Back to financial transactions
            </Button>
          </section>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (transactionQuery.isLoading) {
    return (
      <main className="page-shell">
        <div className="page-container">
          <TransactionLoadingState rows={4} showHeader />
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (transactionQuery.isError) {
    return (
      <main className="page-shell">
        <div className="page-container space-y-4">
          <TransactionErrorState
            title="Unable to load financial transaction"
            description={getErrorMessage(transactionQuery.error)}
            onRetry={handleRetry}
          />

          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            leadingIcon={<ArrowLeft className="size-4" />}
          >
            Back to financial transactions
          </Button>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Not found
  // ---------------------------------------------------------------------------

  if (!transaction) {
    return (
      <main className="page-shell">
        <div className="page-container">
          <section className="surface space-y-4 p-6">
            <h1 className="text-lg font-semibold text-[var(--foreground)]">
              Financial transaction not found
            </h1>

            <p className="break-words text-sm text-[var(--foreground-secondary)]">
              No financial transaction was returned for public ID {publicId}.
              Verify the identifier and try again.
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              leadingIcon={<ArrowLeft className="size-4" />}
            >
              Back to financial transactions
            </Button>
          </section>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Transaction detail
  // ---------------------------------------------------------------------------

  return (
    <main className="page-shell">
      <div className="page-container space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            leadingIcon={<ArrowLeft className="size-4" />}
          >
            Financial transactions
          </Button>

          <TransactionActionsMenu
            transaction={transaction}
            onSelectOperation={handleSelectOperation}
            busy={operations.isPending}
          />
        </div>

        <TransactionOperationFeedback
          feedback={feedback}
          onDismiss={() => setFeedback(null)}
        />

        <div className="grid min-w-0 gap-6 xl:grid-cols-2">
          <TransactionIdentityPanel transaction={transaction} />
          <TransactionInformationPanel transaction={transaction} />
        </div>

        <div className="grid min-w-0 gap-6 xl:grid-cols-2">
          <TransactionAccountReferencesPanel transaction={transaction} />
          <TransactionBusinessReferencePanel transaction={transaction} />
        </div>

        <TransactionAccountingReferencePanel transaction={transaction} />

        <TransactionEntriesPanel transaction={transaction} />

        <TransactionAuditInformation transaction={transaction} />

        <TransactionOperationDialog
          open={selectedOperation !== null}
          operation={selectedOperation}
          transactionPublicId={transaction.publicId}
          reason={reason}
          onReasonChange={handleReasonChange}
          onClose={handleCloseOperation}
          onConfirm={handleConfirmOperation}
          submitting={operations.isPending}
          reasonError={operationError}
        />
      </div>
    </main>
  );
}
