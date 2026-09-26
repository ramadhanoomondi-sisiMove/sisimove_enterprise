// -----------------------------------------------------------------------------
// sisiMove — Withdraw Completion Dispute Action
// -----------------------------------------------------------------------------
//
// Presentation action for withdrawing a journey-completion dispute.
//
// Responsibilities:
// - determine whether the supplied dispute is still withdrawable from the
//   client-visible perspective;
// - own the withdrawal mutation;
// - construct mutation variables;
// - expose loading state;
// - expose mutation errors.
//
// Non-responsibilities:
// - authorization;
// - authentication;
// - HTTP/API calls;
// - dispute lifecycle orchestration;
// - local model mutation.
//
// The backend remains authoritative for authorization and lifecycle validation.
//
// -----------------------------------------------------------------------------

import { Button } from '@/components/ui';

import {
  JourneyCompletionDisputeStatus,
  type JourneyCompletion,
  type JourneyCompletionDispute,
} from '@/features/journey-completion/models';

import {
  useWithdrawJourneyCompletionDispute,
} from '@/features/journey-completion/hooks/mutations';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface WithdrawCompletionDisputeActionProps {
  completion: JourneyCompletion;
  dispute: JourneyCompletionDispute;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawCompletionDisputeAction({
  completion,
  dispute,
}: WithdrawCompletionDisputeActionProps) {
  // ---------------------------------------------------------------------------
  // Mutation
  // ---------------------------------------------------------------------------

  const withdrawDispute =
    useWithdrawJourneyCompletionDispute();

  // ---------------------------------------------------------------------------
  // Presentation-level applicability
  // ---------------------------------------------------------------------------
  //
  // A withdrawn dispute no longer has a withdrawal action.
  //
  // Other lifecycle validation remains authoritative in the backend rather
  // than being duplicated in this presentation component.
  //

  if (
    dispute.status ===
    JourneyCompletionDisputeStatus.WITHDRAWN
  ) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Action handler
  // ---------------------------------------------------------------------------
  //
  // withdrawnByPublicId is intentionally omitted.
  //
  // The backend command supports an optional actor ID and derives the
  // authenticated member when it is not supplied.
  //

  const handleWithdrawDispute = () => {
    withdrawDispute.mutate({
      journeyCompletionPublicId: completion.publicId,
      disputePublicId: dispute.publicId,
      request: {
        withdrawnAt: new Date().toISOString(),
      },
    });
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="secondary"
        size="md"
        loading={withdrawDispute.isPending}
        disabled={withdrawDispute.isPending}
        onClick={handleWithdrawDispute}
      >
        {withdrawDispute.isPending
          ? 'Withdrawing…'
          : 'Withdraw dispute'}
      </Button>

      {withdrawDispute.isError && (
        <p
          role="alert"
          className="text-sm text-[var(--danger)]"
        >
          {withdrawDispute.error instanceof Error
            ? withdrawDispute.error.message
            : 'Unable to withdraw the dispute. Please try again.'}
        </p>
      )}
    </div>
  );
}