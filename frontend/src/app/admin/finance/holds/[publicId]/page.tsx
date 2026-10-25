'use client';

// -----------------------------------------------------------------------------
// sisiMove Admin — Account Hold Detail Page
// -----------------------------------------------------------------------------
//
// Loads one account hold by its public ID.
// Displays identity, financial information, references, expiry, transactions,
// audit metadata and the hold lifecycle timeline.
// Supports capture, release and cancellation through existing mutations.
// -----------------------------------------------------------------------------

import { useCallback, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { ADMIN_ROUTES } from '@/foundation/routing/admin-routes';

import {
  useAdminAccountHold,
  useAdminAccountHoldOperations,
} from '@/features/admin/finance/holds/hooks';

import { AdminAccountHoldOperation } from '@/features/admin/finance/holds/models';

import type {
  CaptureAdminAccountHoldRequest,
  ReleaseAdminAccountHoldRequest,
  CancelAdminAccountHoldRequest,
} from '@/features/admin/finance/holds/models';

import {
  AccountHoldLoadingState,
  AccountHoldErrorState,
  AccountHoldIdentityPanel,
  AccountHoldInformationPanel,
  AccountHoldAccountReferencePanel,
  AccountHoldBusinessReferencePanel,
  AccountHoldExpiryPanel,
  AccountHoldAuditInformation,
  AccountHoldTransactionPanel,
  AccountHoldTransactionTimeline,
  AccountHoldActionsMenu,
  AccountHoldOperationDialog,
  AccountHoldOperationFeedback,
} from '@/components/admin/finance/holds';

import type {
  AccountHoldOperationFeedbackStatus,
} from '@/components/admin/finance/holds/operations';

// -----------------------------------------------------------------------------
// Types and helpers
// -----------------------------------------------------------------------------

type OperationRequest =
  | CaptureAdminAccountHoldRequest
  | ReleaseAdminAccountHoldRequest
  | CancelAdminAccountHoldRequest;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return 'The request could not be completed. Please try again.';
}

// -----------------------------------------------------------------------------
// Page
// -----------------------------------------------------------------------------

export default function AccountHoldDetailPage() {
  const params = useParams<{ publicId: string }>();
  const router = useRouter();

  const publicId =
    typeof params.publicId === 'string' ? params.publicId.trim() : '';

  const holdQuery = useAdminAccountHold(publicId || undefined);
  const { refetch: refetchHold } = holdQuery;

  const operations = useAdminAccountHoldOperations();

  const [selectedOperation, setSelectedOperation] =
    useState<AdminAccountHoldOperation | null>(null);

  const [operationError, setOperationError] = useState<string | undefined>();

  const [feedback, setFeedback] = useState<{
    status: AccountHoldOperationFeedbackStatus;
    title: string;
    message: string;
  } | null>(null);

  const hold = holdQuery.hold;

  // ---------------------------------------------------------------------------
  // Navigation
  // ---------------------------------------------------------------------------

  const handleBack = useCallback(() => {
    router.push(ADMIN_ROUTES.FINANCE_HOLDS);
  }, [router]);

  const handleRetry = useCallback(() => {
    void refetchHold();
  }, [refetchHold]);

  // ---------------------------------------------------------------------------
  // Operation dialog
  // ---------------------------------------------------------------------------

  const handleSelectOperation = useCallback(
    (operation: AdminAccountHoldOperation) => {
      setFeedback(null);
      setOperationError(undefined);
      setSelectedOperation(operation);
    },
    [],
  );

  const handleCancelOperation = useCallback(() => {
    if (operations.isPending) return;

    setSelectedOperation(null);
    setOperationError(undefined);
  }, [operations.isPending]);

  const handleConfirmOperation = useCallback(
    async (
      operation: AdminAccountHoldOperation,
      request: OperationRequest,
    ) => {
      if (!hold || operations.isPending) return;

      setOperationError(undefined);
      setFeedback(null);

      try {
        switch (operation) {
          case AdminAccountHoldOperation.CAPTURE: {
            const captureRequest =
              request as CaptureAdminAccountHoldRequest;

            await operations.captureHold.mutateAsync({
              holdPublicId: hold.publicId,
              request: captureRequest,
            });

            break;
          }

          case AdminAccountHoldOperation.RELEASE: {
            const releaseRequest =
              request as ReleaseAdminAccountHoldRequest;

            await operations.releaseHold.mutateAsync({
              holdPublicId: hold.publicId,
              request: releaseRequest,
            });

            break;
          }

          case AdminAccountHoldOperation.CANCEL: {
            const cancelRequest =
              request as CancelAdminAccountHoldRequest;

            await operations.cancelHold.mutateAsync({
              holdPublicId: hold.publicId,
              request: cancelRequest,
            });

            break;
          }

          default: {
            const exhaustiveCheck: never = operation;

            throw new Error(
              `Unsupported account hold operation: ${exhaustiveCheck}`,
            );
          }
        }

        // Close the dialog after a successful operation.
        setSelectedOperation(null);
        setOperationError(undefined);

        setFeedback({
          status: 'success',
          title: 'Hold operation completed',
          message: `The ${operation.toLowerCase()} operation completed successfully for hold ${hold.publicId}.`,
        });
      } catch (error: unknown) {
        const message = getErrorMessage(error);

        // Close the dialog so the page-level error is visible.
        setSelectedOperation(null);
        setOperationError(undefined);

        setFeedback({
          status: 'error',
          title: 'Hold operation failed',
          message,
        });
      }
    },
    [hold, operations],
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
              Hold identifier missing
            </h1>

            <p className="text-sm text-[var(--foreground-secondary)]">
              An account hold public ID is required to open this page.
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              leadingIcon={<ArrowLeft className="size-4" />}
            >
              Back to account holds
            </Button>
          </section>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  if (holdQuery.isLoading) {
    return (
      <main className="page-shell">
        <div className="page-container">
          <AccountHoldLoadingState rows={4} showHeader />
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  if (holdQuery.isError) {
    return (
      <main className="page-shell">
        <div className="page-container space-y-4">
          <AccountHoldErrorState
            title="Unable to load account hold"
            description={getErrorMessage(holdQuery.error)}
            onRetry={handleRetry}
          />

          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            leadingIcon={<ArrowLeft className="size-4" />}
          >
            Back to account holds
          </Button>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Not found
  // ---------------------------------------------------------------------------

  if (!hold) {
    return (
      <main className="page-shell">
        <div className="page-container">
          <section className="surface space-y-4 p-6">
            <h1 className="text-lg font-semibold text-[var(--foreground)]">
              Account hold not found
            </h1>

            <p className="break-words text-sm text-[var(--foreground-secondary)]">
              No account hold was returned for public ID {publicId}. Verify
              the identifier and try again.
            </p>

            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              leadingIcon={<ArrowLeft className="size-4" />}
            >
              Back to account holds
            </Button>
          </section>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Hold detail
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
            Account holds
          </Button>

          <AccountHoldActionsMenu
            hold={hold}
            onSelect={handleSelectOperation}
            disabled={operations.isPending}
          />
        </div>

        {feedback ? (
          <AccountHoldOperationFeedback
            status={feedback.status}
            title={feedback.title}
            message={feedback.message}
            onDismiss={() => setFeedback(null)}
          />
        ) : null}

        <div className="grid min-w-0 gap-6 xl:grid-cols-2">
          <AccountHoldIdentityPanel hold={hold} />
          <AccountHoldInformationPanel hold={hold} />
        </div>

        <AccountHoldExpiryPanel hold={hold} />

        <div className="grid min-w-0 gap-6 xl:grid-cols-2">
          <AccountHoldAccountReferencePanel hold={hold} />
          <AccountHoldBusinessReferencePanel hold={hold} />
        </div>

        <AccountHoldTransactionPanel hold={hold} />

        <AccountHoldTransactionTimeline hold={hold} />

        <AccountHoldAuditInformation hold={hold} />

        <AccountHoldOperationDialog
          open={selectedOperation !== null}
          hold={hold}
          operation={selectedOperation}
          onClose={handleCancelOperation}
          onSubmit={handleConfirmOperation}
          isSubmitting={operations.isPending}
          errorMessage={operationError}
        />
      </div>
    </main>
  );
}
