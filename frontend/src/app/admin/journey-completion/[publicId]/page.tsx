
'use client';

// -----------------------------------------------------------------------------
// sisiMove Admin — Journey Completion Details Page
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Fetch one Journey Completion by public ID.
// - Fetch its activity and associated Journey Settlement.
// - Coordinate completion, dispute and settlement operations.
// - Own dialog state and operation feedback.
// - Delegate detail presentation to Journey Completion components.
//
// Architecture:
// - Query hooks own server data and caching.
// - Operations hooks own mutations and invalidation.
// - Components own presentation.
// - Public IDs are used for navigation and API lookups.
// - Internal completion ID is used for settlement creation.
// -----------------------------------------------------------------------------

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';

import { JourneyCompletionActionsMenu } from '@/components/admin/journey-completion/operations/completion/JourneyCompletionActionsMenu';
import type { JourneyCompletionAction } from '@/components/admin/journey-completion/operations/completion/JourneyCompletionActionsMenu';
import { JourneyCompletionDisputeActionsMenu } from '@/components/admin/journey-completion/operations/disputes/JourneyCompletionDisputeActionsMenu';
import type { JourneyCompletionDisputeAction } from '@/components/admin/journey-completion/operations/disputes/JourneyCompletionDisputeActionsMenu';
import { JourneySettlementActionsMenu } from '@/components/admin/journey-completion/operations/settlement/JourneySettlementActionsMenu';
import type { JourneySettlementAction } from '@/components/admin/journey-completion/operations/settlement/JourneySettlementActionsMenu';

import {
  useAdminJourneyCompletion,
  useAdminJourneyCompletionActivity,
  useAdminJourneyCompletionOperations,
  useAdminJourneyCompletionDisputeOperations,
  useAdminJourneySettlementByCompletion,
  useAdminJourneySettlementOperations,
} from '@/features/admin/journey-completion/hooks';

import type {
  AdminJourneyCompletionOpenDisputeRequest,
  AdminJourneyCompletionReviewDisputeRequest,
  AdminJourneyCompletionResolveDisputeRequest,
  AdminJourneyCompletionRejectDisputeRequest,
  AdminJourneyCompletionWithdrawDisputeRequest,
  AdminJourneySettlementCreateRequest,
  AdminJourneySettlementSubmitRequest,
  AdminJourneySettlementProcessRequest,
  AdminJourneySettlementCompleteRequest,
  AdminJourneySettlementFailRequest,
  AdminJourneySettlementHoldRequest,
  AdminJourneySettlementCancelRequest,
} from '@/features/admin/journey-completion/models';

import {
  JourneyCompletionDetailsLayout,
  JourneyCompletionDetailHeader,
  JourneyCompletionIdentityPanel,
  JourneyCompletionJourneyPanel,
  JourneyCompletionProviderPanel,
  JourneyCompletionBookingPanel,
  JourneyCompletionInformationPanel,
  JourneyCompletionOutcomePanel,
  JourneyCompletionLifecyclePanel,
  JourneyCompletionLifecycleTimeline,
  JourneyCompletionOpenDisputeDialog,
  JourneyCompletionReviewDisputeDialog,
  JourneyCompletionResolveDisputeDialog,
  JourneyCompletionRejectDisputeDialog,
  JourneyCompletionWithdrawDisputeDialog,
  JourneyCompletionOperationFeedback,
  JourneySettlementCreateDialog,
  JourneySettlementSubmitDialog,
  JourneySettlementProcessDialog,
  JourneySettlementCompleteDialog,
  JourneySettlementFailDialog,
  JourneySettlementHoldDialog,
  JourneySettlementCancelDialog,
  JourneySettlementOperationConfirmation,
} from '@/components/admin/journey-completion';

// -----------------------------------------------------------------------------
// Dialog State
// -----------------------------------------------------------------------------

type ActiveDialog =
  | 'requestCompletion'
  | 'confirmCompletion'
  | 'withdrawConfirmation'
  | 'cancelCompletion'
  | 'openDispute'
  | 'reviewDispute'
  | 'resolveDispute'
  | 'rejectDispute'
  | 'withdrawDispute'
  | 'createSettlement'
  | 'submitSettlement'
  | 'processSettlement'
  | 'completeSettlement'
  | 'failSettlement'
  | 'holdSettlement'
  | 'cancelSettlement'
  | null;

// -----------------------------------------------------------------------------
// Operation Feedback
// -----------------------------------------------------------------------------

interface OperationFeedbackState {
  status: 'success' | 'error';
  title: string;
  description: string;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : 'An unexpected error occurred while executing this operation.';
}

// -----------------------------------------------------------------------------
// Journey Completion Details Page
// -----------------------------------------------------------------------------

export default function JourneyCompletionDetailsPage() {
  const params = useParams<{ publicId: string }>();
  const router = useRouter();

  const publicId =
    typeof params.publicId === 'string'
      ? params.publicId.trim()
      : '';

  // ---------------------------------------------------------------------------
  // Queries
  // ---------------------------------------------------------------------------

  const {
    completion,
    isLoading,
    isError,
    error,
    refetch,
  } = useAdminJourneyCompletion(publicId);

  const {
    activity,
    isLoading: isActivityLoading,
    isError: isActivityError,
    refetch: refetchActivity,
  } = useAdminJourneyCompletionActivity(publicId);

  const {
    data: settlement,
    isLoading: isSettlementLoading,
    isError: isSettlementError,
    refetch: refetchSettlement,
  } = useAdminJourneySettlementByCompletion(publicId);

  // ---------------------------------------------------------------------------
  // Operations
  // ---------------------------------------------------------------------------

  const completionOperations =
    useAdminJourneyCompletionOperations();

  const disputeOperations =
    useAdminJourneyCompletionDisputeOperations();

  const settlementOperations =
    useAdminJourneySettlementOperations();

  // ---------------------------------------------------------------------------
  // Local State
  // ---------------------------------------------------------------------------

  const [activeDialog, setActiveDialog] =
    useState<ActiveDialog>(null);

  const [selectedDisputePublicId, setSelectedDisputePublicId] =
    useState<string | null>(null);

  const [selectedConfirmationPublicId, setSelectedConfirmationPublicId] =
    useState<string | null>(null);

  const [feedback, setFeedback] =
    useState<OperationFeedbackState | null>(null);

  // ---------------------------------------------------------------------------
  // Dialog Management
  // ---------------------------------------------------------------------------

  const closeDialog = () => {
    setActiveDialog(null);
    setSelectedDisputePublicId(null);
    setSelectedConfirmationPublicId(null);
  };

  const openDialog = (dialog: ActiveDialog) => {
    setFeedback(null);
    setActiveDialog(dialog);
  };

  const openDisputeDialog = (
    dialog:
      | 'reviewDispute'
      | 'resolveDispute'
      | 'rejectDispute'
      | 'withdrawDispute',
    disputePublicId: string,
  ) => {
    setFeedback(null);
    setSelectedDisputePublicId(disputePublicId);
    setActiveDialog(dialog);
  };

  const openWithdrawConfirmationDialog = (confirmationPublicId: string) => {
    setFeedback(null);
    setSelectedConfirmationPublicId(confirmationPublicId);
    setActiveDialog('withdrawConfirmation');
  };

  // ---------------------------------------------------------------------------
  // Operation Execution
  // ---------------------------------------------------------------------------

  const runOperation = async (
    operation: () => Promise<unknown>,
    successTitle: string,
    successDescription: string,
  ): Promise<boolean> => {
    setFeedback(null);

    try {
      await operation();

      closeDialog();

      setFeedback({
        status: 'success',
        title: successTitle,
        description: successDescription,
      });

      return true;
    } catch (operationError) {
      setFeedback({
        status: 'error',
        title: 'Operation failed',
        description: getErrorMessage(operationError),
      });

      return false;
    }
  };

  // ---------------------------------------------------------------------------
  // Completion Operations
  // ---------------------------------------------------------------------------

  const handleRequestCompletion = () =>
    runOperation(
      () =>
        completionOperations.requestCompletion.mutateAsync({
          journeyCompletionPublicId: publicId,
        }),
      'Completion requested',
      'The completion request was submitted successfully.',
    );

  const handleConfirmCompletion = () =>
    runOperation(
      () =>
        completionOperations.confirmCompletion.mutateAsync({
          journeyCompletionPublicId: publicId,
        }),
      'Completion confirmed',
      'The completion confirmation was submitted successfully.',
    );

  const handleWithdrawConfirmation = () => {
    if (!selectedConfirmationPublicId) {
      return Promise.resolve(false);
    }

    return runOperation(
      () =>
        completionOperations.withdrawConfirmation.mutateAsync({
          journeyCompletionPublicId: publicId,
          confirmationPublicId: selectedConfirmationPublicId,
        }),
      'Confirmation withdrawn',
      'The completion confirmation was withdrawn successfully.',
    );
  };

  const handleCancelCompletion = () =>
    runOperation(
      () =>
        completionOperations.cancelCompletion.mutateAsync({
          journeyCompletionPublicId: publicId,
        }),
      'Completion cancelled',
      'The completion was cancelled successfully.',
    );

  // ---------------------------------------------------------------------------
  // Dispute Operations
  // ---------------------------------------------------------------------------

  const handleOpenDispute = (
    payload: AdminJourneyCompletionOpenDisputeRequest,
  ) =>
    runOperation(
      () =>
        disputeOperations.openDispute.mutateAsync({
          journeyCompletionPublicId: publicId,
          input: payload,
        }),
      'Dispute opened',
      'The dispute was opened successfully.',
    );

  const handleReviewDispute = (
    payload: AdminJourneyCompletionReviewDisputeRequest,
  ) => {
    if (!selectedDisputePublicId) {
      return Promise.resolve(false);
    }

    return runOperation(
      () =>
        disputeOperations.reviewDispute.mutateAsync({
          journeyCompletionPublicId: publicId,
          disputePublicId: selectedDisputePublicId,
          input: payload,
        }),
      'Dispute moved into review',
      'The dispute was successfully moved into review.',
    );
  };

  const handleResolveDispute = (
    payload: AdminJourneyCompletionResolveDisputeRequest,
  ) => {
    if (!selectedDisputePublicId) {
      return Promise.resolve(false);
    }

    return runOperation(
      () =>
        disputeOperations.resolveDispute.mutateAsync({
          journeyCompletionPublicId: publicId,
          disputePublicId: selectedDisputePublicId,
          input: payload,
        }),
      'Dispute resolved',
      'The dispute was successfully resolved.',
    );
  };

  const handleRejectDispute = (
    payload: AdminJourneyCompletionRejectDisputeRequest,
  ) => {
    if (!selectedDisputePublicId) {
      return Promise.resolve(false);
    }

    return runOperation(
      () =>
        disputeOperations.rejectDispute.mutateAsync({
          journeyCompletionPublicId: publicId,
          disputePublicId: selectedDisputePublicId,
          input: payload,
        }),
      'Dispute rejected',
      'The dispute was successfully rejected.',
    );
  };

  const handleWithdrawDispute = (
    payload: AdminJourneyCompletionWithdrawDisputeRequest,
  ) => {
    if (!selectedDisputePublicId) {
      return Promise.resolve(false);
    }

    return runOperation(
      () =>
        disputeOperations.withdrawDispute.mutateAsync({
          journeyCompletionPublicId: publicId,
          disputePublicId: selectedDisputePublicId,
          input: payload,
        }),
      'Dispute withdrawn',
      'The dispute was successfully withdrawn.',
    );
  };

  // ---------------------------------------------------------------------------
  // Settlement Operations
  // ---------------------------------------------------------------------------

  const handleCreateSettlement = (
    payload: AdminJourneySettlementCreateRequest,
  ) =>
    runOperation(
      () =>
        settlementOperations.createSettlement.mutateAsync({
          input: payload,
        }),
      'Settlement created',
      'The Journey Settlement was created successfully.',
    );

  const handleSubmitSettlement = (
    payload: AdminJourneySettlementSubmitRequest,
  ) => {
    if (!settlement) {
      return Promise.resolve(false);
    }

    return runOperation(
      () =>
        settlementOperations.submitSettlement.mutateAsync({
          journeySettlementPublicId: settlement.publicId,
          input: payload,
        }),
      'Settlement submitted',
      'The settlement was submitted successfully.',
    );
  };

  const handleProcessSettlement = (
    payload: AdminJourneySettlementProcessRequest,
  ) => {
    if (!settlement) {
      return Promise.resolve(false);
    }

    return runOperation(
      () =>
        settlementOperations.processSettlement.mutateAsync({
          journeySettlementPublicId: settlement.publicId,
          input: payload,
        }),
      'Settlement processing started',
      'The settlement was moved into processing.',
    );
  };

  const handleCompleteSettlement = (
    payload: AdminJourneySettlementCompleteRequest,
  ) => {
    if (!settlement) {
      return Promise.resolve(false);
    }

    return runOperation(
      () =>
        settlementOperations.completeSettlement.mutateAsync({
          journeySettlementPublicId: settlement.publicId,
          input: payload,
        }),
      'Settlement completed',
      'The settlement was marked as completed.',
    );
  };

  const handleFailSettlement = (
    payload: AdminJourneySettlementFailRequest,
  ) => {
    if (!settlement) {
      return Promise.resolve(false);
    }

    return runOperation(
      () =>
        settlementOperations.failSettlement.mutateAsync({
          journeySettlementPublicId: settlement.publicId,
          input: payload,
        }),
      'Settlement failed',
      'The settlement was marked as failed.',
    );
  };

  const handleHoldSettlement = (
    payload: AdminJourneySettlementHoldRequest,
  ) => {
    if (!settlement) {
      return Promise.resolve(false);
    }

    return runOperation(
      () =>
        settlementOperations.holdSettlement.mutateAsync({
          journeySettlementPublicId: settlement.publicId,
          input: payload,
        }),
      'Settlement placed on hold',
      'The settlement was placed on hold.',
    );
  };

  const handleCancelSettlement = (
    payload: AdminJourneySettlementCancelRequest,
  ) => {
    if (!settlement) {
      return Promise.resolve(false);
    }

    return runOperation(
      () =>
        settlementOperations.cancelSettlement.mutateAsync({
          journeySettlementPublicId: settlement.publicId,
          input: payload,
        }),
      'Settlement cancelled',
      'The settlement was cancelled successfully.',
    );
  };

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  if (!publicId) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="font-semibold">
            Completion not identified
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            The Journey Completion public identifier is missing.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => router.back()}
        >
          Go back
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 animate-pulse rounded-lg bg-muted" />
        <div className="h-40 animate-pulse rounded-lg bg-muted" />
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    );
  }

  if (isError || !completion) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
          <h2 className="font-semibold">
            Unable to load Journey Completion
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            {getErrorMessage(error)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => void refetch()}
          >
            Try again
          </Button>

          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            Go back
          </Button>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Derived Data
  // ---------------------------------------------------------------------------

  const journeyHref =
    `/admin/journeys/${encodeURIComponent(completion.journeyPublicId)}`;

  const providerHref =
    `/admin/providers/${encodeURIComponent(completion.providerPublicId)}`;


  const isCompletionPending = completion.status === 'PENDING';
  const isConfirmationRequired =
    completion.status === 'CONFIRMATION_REQUIRED';

  const activeConfirmation = completion.confirmations.find(
    (confirmation) => !confirmation.withdrawnAt,
  );

  const completionAvailableActions: JourneyCompletionAction[] = [
    ...(isCompletionPending ? ['request' as const] : []),
    ...(isConfirmationRequired &&
    completion.confirmedCount >= completion.requiredConfirmations
      ? ['confirm' as const]
      : []),
    ...(completion.status === 'CONFIRMED' && activeConfirmation
      ? ['withdraw-confirmation' as const]
      : []),
    ...(isCompletionPending || isConfirmationRequired
      ? ['cancel' as const]
      : []),
  ];

  const canOpenDispute = isConfirmationRequired;

  const getDisputeAvailableActions = (
    status: string,
  ): JourneyCompletionDisputeAction[] => {
    switch (status) {
      case 'OPEN':
        return ['REVIEW_DISPUTE', 'WITHDRAW_DISPUTE'];
      case 'UNDER_REVIEW':
        return [
          'RESOLVE_DISPUTE',
          'REJECT_DISPUTE',
          'WITHDRAW_DISPUTE',
        ];
      default:
        return [];
    }
  };

  const settlementAvailableActions: JourneySettlementAction[] =
    !settlement
      ? []
      : settlement.status === 'PENDING'
        ? ['SUBMIT', 'CANCEL']
        : settlement.status === 'SUBMITTED'
          ? ['PROCESS', 'FAIL', 'HOLD', 'CANCEL']
          : settlement.status === 'PROCESSING'
            ? ['COMPLETE', 'FAIL', 'HOLD', 'CANCEL']
            : settlement.status === 'HELD'
              ? ['PROCESS', 'CANCEL']
              : [];

  const handleCompletionAction = (action: JourneyCompletionAction) => {
    switch (action) {
      case 'request':
        openDialog('requestCompletion');
        break;
      case 'confirm':
        openDialog('confirmCompletion');
        break;
      case 'withdraw-confirmation':
        if (activeConfirmation) {
          openWithdrawConfirmationDialog(activeConfirmation.publicId);
        }
        break;
      case 'cancel':
        openDialog('cancelCompletion');
        break;
    }
  };

  const handleSettlementAction = (action: JourneySettlementAction) => {
    const dialogs: Record<JourneySettlementAction, ActiveDialog> = {
      SUBMIT: 'submitSettlement',
      PROCESS: 'processSettlement',
      COMPLETE: 'completeSettlement',
      FAIL: 'failSettlement',
      HOLD: 'holdSettlement',
      CANCEL: 'cancelSettlement',
    };

    openDialog(dialogs[action]);
  };

  const lifecycleEvents = activity.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    timestamp: event.occurredAt,
    variant: event.type.includes('WITHDRAWN')
      ? 'warning' as const
      : event.type.includes('RESOLVED')
        ? 'success' as const
        : event.type.includes('REJECTED')
          ? 'danger' as const
          : 'default' as const,
  }));

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="space-y-6">

      {/* ------------------------------------------------------------------- */}
      {/* Page Header */}
      {/* ------------------------------------------------------------------- */}

      <JourneyCompletionDetailHeader
        completion={completion}
        journeyHref={journeyHref}
        providerHref={providerHref}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <JourneyCompletionActionsMenu
              availableActions={completionAvailableActions}
              onAction={handleCompletionAction}
              disabled={completionOperations.isLoading}
            />

            {canOpenDispute && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => openDialog('openDispute')}
              >
                Open dispute
              </Button>
            )}
          </div>
        }
      />

      {/* ------------------------------------------------------------------- */}
      {/* Operation Feedback */}
      {/* ------------------------------------------------------------------- */}

      {feedback && (
        <JourneyCompletionOperationFeedback
          status={feedback.status}
          title={feedback.title}
          description={feedback.description}
          onDismiss={() => setFeedback(null)}
        />
      )}

      {/* ------------------------------------------------------------------- */}
      {/* Detail Panels */}
      {/* ------------------------------------------------------------------- */}

      <JourneyCompletionDetailsLayout
        variant="main-sidebar"
      >
        {/* Main Column */}

        <div className="space-y-6 lg:col-span-8">

          <JourneyCompletionIdentityPanel
            publicId={completion.publicId}
            status={completion.status}
            createdAt={completion.createdAt}
            updatedAt={completion.updatedAt}
          />

          <JourneyCompletionJourneyPanel
            journeyPublicId={completion.journeyPublicId}
            journeyHref={journeyHref}
          />

          <JourneyCompletionProviderPanel
            providerPublicId={completion.providerPublicId}
            providerHref={providerHref}
          />

          <JourneyCompletionBookingPanel
            bookingPublicId={
              completion.confirmations.find(
                (confirmation) =>
                  Boolean(confirmation.bookingPublicId),
              )?.bookingPublicId
            }
          />

          <JourneyCompletionInformationPanel
            completionRequestedAt={
              completion.completionRequestedAt
            }
            confirmedAt={completion.confirmedAt}
            disputedAt={completion.disputedAt}
            cancelledAt={completion.cancelledAt}
            requiredConfirmations={
              completion.requiredConfirmations
            }
            confirmedCount={completion.confirmedCount}
          />

          <JourneyCompletionOutcomePanel
            status={completion.status}
            confirmedCount={completion.confirmedCount}
            requiredConfirmations={
              completion.requiredConfirmations
            }
            confirmedAt={completion.confirmedAt}
            disputedAt={completion.disputedAt}
            cancelledAt={completion.cancelledAt}
          />

          <JourneyCompletionLifecycleTimeline
            events={lifecycleEvents}
            emptyMessage={
              isActivityLoading
                ? 'Loading completion activity...'
                : isActivityError
                  ? 'Unable to load completion activity.'
                  : 'No completion activity has been recorded.'
            }
          />

          {isActivityError && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => void refetchActivity()}
            >
              Retry activity
            </Button>
          )}

        </div>

        {/* Sidebar */}

        <div className="space-y-6 lg:col-span-4">

          <JourneyCompletionLifecyclePanel
            createdAt={completion.createdAt}
            completionRequestedAt={
              completion.completionRequestedAt
            }
            confirmedAt={completion.confirmedAt}
            disputedAt={completion.disputedAt}
            cancelledAt={completion.cancelledAt}
          />

          {/* Settlement Summary */}

          <section className="rounded-lg border bg-card p-5">
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-semibold">
                Journey Settlement
              </h3>

              {settlement && (
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                    {settlement.status.replaceAll('_', ' ')}
                  </span>
                  <JourneySettlementActionsMenu
                    availableActions={settlementAvailableActions}
                    onAction={handleSettlementAction}
                    disabled={settlementOperations.isLoading}
                  />
                </div>
              )}
            </div>

            {isSettlementLoading ? (
              <p className="mt-4 text-sm text-muted-foreground">
                Loading settlement...
              </p>
            ) : isSettlementError ? (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-destructive">
                  Unable to load settlement information.
                </p>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => void refetchSettlement()}
                >
                  Retry
                </Button>
              </div>
            ) : settlement ? (
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">
                    Settlement public ID
                  </p>
                  <p className="break-all font-medium">
                    {settlement.publicId}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">
                    Financial transaction
                  </p>
                  <p className="break-all font-medium">
                    {settlement.financialTransactionPublicId ?? 'Not linked'}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">
                    Created
                  </p>
                  <p className="font-medium">
                    {new Date(settlement.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-muted-foreground">
                  No Journey Settlement has been created for this completion.
                </p>

                <Button
                  size="sm"
                  disabled={settlementOperations.isCreating}
                  onClick={() =>
                    openDialog('createSettlement')
                  }
                >
                  Create settlement
                </Button>
              </div>
            )}
          </section>

          {/* Disputes */}

          <section className="rounded-lg border bg-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">
                Disputes
              </h3>

              <span className="rounded-full bg-muted px-2.5 py-1 text-xs">
                {completion.disputes.length}
              </span>
            </div>

            {completion.disputes.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                No disputes have been recorded.
              </p>
            ) : (
              <div className="mt-4 space-y-4">
                {completion.disputes.map((dispute) => (
                  <div
                    key={dispute.publicId}
                    className="space-y-2 border-t pt-3 first:border-t-0 first:pt-0"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-medium">
                        {dispute.reason.replaceAll('_', ' ')}
                      </span>

                      <span className="rounded-full bg-muted px-2 py-1 text-xs">
                        {dispute.status.replaceAll('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {dispute.description ?? 'No description provided.'}
                    </p>

                    <p className="break-all text-xs text-muted-foreground">
                      {dispute.publicId}
                    </p>

                    <JourneyCompletionDisputeActionsMenu
                      availableActions={getDisputeAvailableActions(dispute.status)}
                      disabled={disputeOperations.isLoading}
                      onAction={(action) => {
                        switch (action) {
                          case 'REVIEW_DISPUTE':
                            openDisputeDialog('reviewDispute', dispute.publicId);
                            break;
                          case 'RESOLVE_DISPUTE':
                            openDisputeDialog('resolveDispute', dispute.publicId);
                            break;
                          case 'REJECT_DISPUTE':
                            openDisputeDialog('rejectDispute', dispute.publicId);
                            break;
                          case 'WITHDRAW_DISPUTE':
                            openDisputeDialog('withdrawDispute', dispute.publicId);
                            break;
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </JourneyCompletionDetailsLayout>

      {/* ------------------------------------------------------------------- */}
      {/* Completion Confirmation Dialogs */}
      {/* ------------------------------------------------------------------- */}

      <JourneySettlementOperationConfirmation
        open={activeDialog === 'requestCompletion'}
        onOpenChange={(open) =>
          !open && closeDialog()
        }
        title="Request Journey Completion"
        description="This will move the Journey Completion into its confirmation phase."
        confirmLabel="Request completion"
        onConfirm={() => void handleRequestCompletion()}
        isPending={completionOperations.isRequesting}
      />

      <JourneySettlementOperationConfirmation
        open={activeDialog === 'confirmCompletion'}
        onOpenChange={(open) =>
          !open && closeDialog()
        }
        title="Confirm Journey Completion"
        description="Confirm that the required completion confirmations have been received."
        confirmLabel="Confirm completion"
        onConfirm={() => void handleConfirmCompletion()}
        isPending={completionOperations.isConfirming}
      />

      <JourneySettlementOperationConfirmation
        open={activeDialog === 'withdrawConfirmation'}
        onOpenChange={(open) => !open && closeDialog()}
        title="Withdraw Completion Confirmation"
        description="Are you sure you want to withdraw this completion confirmation?"
        confirmLabel="Withdraw confirmation"
        tone="danger"
        onConfirm={() => void handleWithdrawConfirmation()}
        isPending={completionOperations.isWithdrawingConfirmation}
      />

      <JourneySettlementOperationConfirmation
        open={activeDialog === 'cancelCompletion'}
        onOpenChange={(open) =>
          !open && closeDialog()
        }
        title="Cancel Journey Completion"
        description="Are you sure you want to cancel this Journey Completion?"
        confirmLabel="Cancel completion"
        tone="danger"
        onConfirm={() => void handleCancelCompletion()}
        isPending={completionOperations.isCancelling}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Dispute Dialogs */}
      {/* ------------------------------------------------------------------- */}

      <JourneyCompletionOpenDisputeDialog
        open={activeDialog === 'openDispute'}
        onOpenChange={(open) =>
          !open && closeDialog()
        }
        onSubmit={(payload) =>
          void handleOpenDispute(payload)
        }
        isPending={disputeOperations.isOpening}
      />

      <JourneyCompletionReviewDisputeDialog
        open={activeDialog === 'reviewDispute'}
        onOpenChange={(open) =>
          !open && closeDialog()
        }
        onSubmit={(payload) =>
          void handleReviewDispute(payload)
        }
        isPending={disputeOperations.isReviewing}
      />

      <JourneyCompletionResolveDisputeDialog
        open={activeDialog === 'resolveDispute'}
        onOpenChange={(open) =>
          !open && closeDialog()
        }
        onSubmit={(payload) =>
          void handleResolveDispute(payload)
        }
        isPending={disputeOperations.isResolving}
      />

      <JourneyCompletionRejectDisputeDialog
        open={activeDialog === 'rejectDispute'}
        onOpenChange={(open) =>
          !open && closeDialog()
        }
        onSubmit={(payload) =>
          void handleRejectDispute(payload)
        }
        isPending={disputeOperations.isRejecting}
      />

      <JourneyCompletionWithdrawDisputeDialog
        open={activeDialog === 'withdrawDispute'}
        onOpenChange={(open) =>
          !open && closeDialog()
        }
        onSubmit={(payload) =>
          void handleWithdrawDispute(payload)
        }
        isPending={disputeOperations.isWithdrawing}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Settlement Dialogs */}
      {/* ------------------------------------------------------------------- */}

      <JourneySettlementCreateDialog
        open={activeDialog === 'createSettlement'}
        onOpenChange={(open) =>
          !open && closeDialog()
        }
        onSubmit={(payload) =>
          void handleCreateSettlement(payload)
        }
        isPending={settlementOperations.isCreating}
        key={completion.publicId}
      />

      <JourneySettlementSubmitDialog
        open={activeDialog === 'submitSettlement'}
        onOpenChange={(open) =>
          !open && closeDialog()
        }
        onSubmit={(payload) =>
          void handleSubmitSettlement(payload)
        }
        isPending={settlementOperations.isSubmitting}
      />

      <JourneySettlementProcessDialog
        open={activeDialog === 'processSettlement'}
        onOpenChange={(open) =>
          !open && closeDialog()
        }
        onSubmit={(payload) =>
          void handleProcessSettlement(payload)
        }
        isPending={settlementOperations.isProcessing}
      />

      <JourneySettlementCompleteDialog
        open={activeDialog === 'completeSettlement'}
        onOpenChange={(open) =>
          !open && closeDialog()
        }
        onSubmit={(payload) =>
          void handleCompleteSettlement(payload)
        }
        isPending={settlementOperations.isCompleting}
      />

      <JourneySettlementFailDialog
        open={activeDialog === 'failSettlement'}
        onOpenChange={(open) =>
          !open && closeDialog()
        }
        onSubmit={(payload) =>
          void handleFailSettlement(payload)
        }
        isPending={settlementOperations.isFailing}
      />

      <JourneySettlementHoldDialog
        open={activeDialog === 'holdSettlement'}
        onOpenChange={(open) =>
          !open && closeDialog()
        }
        onSubmit={(payload) =>
          void handleHoldSettlement(payload)
        }
        isPending={settlementOperations.isHolding}
      />

      <JourneySettlementCancelDialog
        open={activeDialog === 'cancelSettlement'}
        onOpenChange={(open) =>
          !open && closeDialog()
        }
        onSubmit={(payload) =>
          void handleCancelSettlement(payload)
        }
        isPending={settlementOperations.isCancelling}
      />

    </div>
  );
}
