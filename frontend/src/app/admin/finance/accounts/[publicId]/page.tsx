
'use client';

// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account Detail Page
// -----------------------------------------------------------------------------
//
// Loads one financial account by its public ID.
// Displays account identity, information, balance and audit metadata.
// Supports activate, suspend and close operations through existing mutations.
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';

import {
  useAdminFinancialAccount,
  useAdminFinancialAccountBalance,
  useAdminFinancialAccountOperations,
} from '@/features/admin/finance/accounts/hooks';

import {
  FinancialAccountLoadingState,
  FinancialAccountErrorState,
  FinancialAccountEmptyState,
  FinancialAccountDetailHeader,
  FinancialAccountIdentityPanel,
  FinancialAccountInformationPanel,
  FinancialAccountAuditInformation,
  FinancialAccountBalancePanel,
  FinancialAccountActionsMenu,
  FinancialAccountOperationDialog,
  FinancialAccountOperationFeedback,
} from '@/components/admin/finance/accounts';

import type { FinancialAccountOperation } from '@/components/admin/finance/accounts';

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return 'The request could not be completed. Please try again.';
}

function formatAmount(minorUnits: number, currency: string): string {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency,
  }).format(minorUnits);
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function FinancialAccountDetailPage() {
  const params = useParams<{ publicId: string }>();
  const router = useRouter();

  const publicId =
    typeof params.publicId === 'string' ? params.publicId.trim() : '';

  const accountQuery = useAdminFinancialAccount(publicId || undefined);
  const balanceQuery = useAdminFinancialAccountBalance(publicId || undefined);

  const operations = useAdminFinancialAccountOperations();

  const [selectedOperation, setSelectedOperation] =
    useState<FinancialAccountOperation | null>(null);

  const [feedback, setFeedback] = useState<{
    kind: 'success' | 'error' | 'info';
    title: string;
    message: string;
  } | null>(null);

  const account = accountQuery.data;

  const handleBack = useCallback(() => {
    router.push(ADMIN_ROUTES.FINANCE_ACCOUNTS);
  }, [router]);

  const handleRetry = useCallback(() => {
    void accountQuery.refetch();
    void balanceQuery.refetch();
  }, [accountQuery, balanceQuery]);

  const handleSelectOperation = useCallback(
    (operation: FinancialAccountOperation) => {
      setFeedback(null);
      setSelectedOperation(operation);
    },
    [],
  );

  const handleCancelOperation = useCallback(() => {
    if (!operations.isPending) {
      setSelectedOperation(null);
    }
  }, [operations.isPending]);

  const handleConfirmOperation = useCallback(
    async ({
      effectiveAt,
    }: {
      effectiveAt: string;
      reason?: string;
    }) => {
      if (!account || !selectedOperation || operations.isPending) {
        return;
      }

      setFeedback(null);

      try {
        switch (selectedOperation) {
          case 'activate':
            await operations.activate.mutateAsync({
              accountPublicId: account.publicId,
              request: {
                activatedAt: effectiveAt,
              },
            });
            break;

          case 'suspend':
            await operations.suspend.mutateAsync({
              accountPublicId: account.publicId,
              request: {
                suspendedAt: effectiveAt,
              },
            });
            break;

          case 'close':
            await operations.close.mutateAsync({
              accountPublicId: account.publicId,
              request: {
                closedAt: effectiveAt,
              },
            });
            break;
        }

        setSelectedOperation(null);

        setFeedback({
          kind: 'success',
          title: 'Account operation completed',
          message: `The ${selectedOperation} request completed successfully for account ${account.publicId}.`,
        });
         } catch (error: unknown) {
        setSelectedOperation(null);

        setFeedback({
          kind: 'error',
          title: 'Account operation failed',
          message: getErrorMessage(error),
        });
      }
    },
    [account, operations, selectedOperation],
  );

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (!publicId) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        <FinancialAccountEmptyState
          title="Account identifier missing"
          description="A financial account public ID is required to open this page."
          actionLabel="Back to financial accounts"
          onAction={handleBack}
        />
      </main>
    );
  }

  if (accountQuery.isPending) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <FinancialAccountLoadingState rows={3} showHeader />
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Error and not-found states
  // ---------------------------------------------------------------------------

  if (accountQuery.isError) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
        <FinancialAccountErrorState
          title="Unable to load financial account"
          description={getErrorMessage(accountQuery.error)}
          onRetry={handleRetry}
          retryLabel="Try again"
          onBack={handleBack}
          backLabel="Back to financial accounts"
        />
      </main>
    );
  }

  if (!account) {
    return (
      <main className="mx-auto w-full max-w-4xl px-4 py-8">
        <FinancialAccountEmptyState
          title="Financial account not found"
          description={`No financial account was returned for public ID ${publicId}. Verify the identifier and try again.`}
          actionLabel="Back to financial accounts"
          onAction={handleBack}
        />
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Account detail
  // ---------------------------------------------------------------------------

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <FinancialAccountDetailHeader
        account={account}
        backHref={ADMIN_ROUTES.FINANCE_ACCOUNTS}
        actions={
          <FinancialAccountActionsMenu
            account={account}
            onSelectOperation={handleSelectOperation}
            isPending={operations.isPending}
          />
        }
      />

      {feedback && (
        <FinancialAccountOperationFeedback
          kind={feedback.kind}
          title={feedback.title}
          message={feedback.message}
          onDismiss={() => setFeedback(null)}
        />
      )}

      {balanceQuery.isError && (
        <FinancialAccountOperationFeedback
          kind="error"
          title="Could not refresh account balance"
          message="The account details loaded, but the separate balance request failed. The balance panel below uses the balance included in the account response."
          onDismiss={() => {
            setFeedback((current) =>
              current?.title === 'Could not refresh account balance'
                ? null
                : current,
            );
          }}
        />
      )}

      <div className="grid min-w-0 gap-6 xl:grid-cols-2">
        <FinancialAccountBalancePanel
          balance={balanceQuery.data ?? account.balance}
          formatAmount={formatAmount}
        />

        <FinancialAccountIdentityPanel account={account} />
      </div>

      <FinancialAccountInformationPanel
        account={account}
        formatAmount={formatAmount}
      />

      <FinancialAccountAuditInformation
        account={account}
        balanceUpdatedAt={balanceQuery.data?.updatedAt}
      />

      <FinancialAccountOperationDialog
        account={account}
        operation={selectedOperation}
        isPending={operations.isPending}
        onCancel={handleCancelOperation}
        onConfirm={handleConfirmOperation}
      />
    </main>
  );
}
