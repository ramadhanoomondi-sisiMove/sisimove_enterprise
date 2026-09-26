// -----------------------------------------------------------------------------
// sisiMove — Withdraw Completion Confirmation Action
// -----------------------------------------------------------------------------
//
// Presentation action for withdrawing an existing journey-completion
// confirmation.
//
// Responsibilities:
// - determine whether the supplied confirmation can be withdrawn;
// - own the withdrawal mutation;
// - construct the mutation variables;
// - expose loading state;
// - expose mutation errors.
//
// Non-responsibilities:
// - authorization;
// - authentication;
// - HTTP/API calls;
// - completion lifecycle decisions;
// - local model mutation;
// - deciding whether the current member owns the confirmation.
//
// The backend remains authoritative for authorization and lifecycle validation.
// The component only performs client-visible applicability checks.
//
// -----------------------------------------------------------------------------

import { Button } from '@/components/ui';

import {
  JourneyCompletionConfirmationStatus,
  type JourneyCompletion,
  type JourneyCompletionConfirmation,
} from '@/features/journey-completion/models';

import {
  useWithdrawJourneyCompletionConfirmation,
} from '@/features/journey-completion/hooks/mutations';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface WithdrawConfirmationActionProps {
  /**
   * Current journey-completion projection.
   *
   * The completion supplies the aggregate public ID required by the
   * withdrawal command.
   */
  completion: JourneyCompletion;

  /**
   * Confirmation that is being withdrawn.
   *
   * The confirmation supplies the public ID required by the
   * withdrawal command.
   */
  confirmation: JourneyCompletionConfirmation;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function WithdrawConfirmationAction({
  completion,
  confirmation,
}: WithdrawConfirmationActionProps) {
  // ---------------------------------------------------------------------------
  // Mutation
  // ---------------------------------------------------------------------------
  //
  // The action component owns its mutation, following the sisiMove action
  // component pattern.
  //
  const withdrawConfirmation =
    useWithdrawJourneyCompletionConfirmation();

  // ---------------------------------------------------------------------------
  // Presentation-level applicability
  // ---------------------------------------------------------------------------
  //
  // Only an active CONFIRMED confirmation can be withdrawn.
  //
  // WITHDRAWN confirmations are already withdrawn and therefore have no
  // client-visible withdrawal action.
  //
  // The backend remains authoritative and will reject invalid lifecycle
  // transitions regardless of this presentation check.
  //
  if (
    confirmation.status !==
    JourneyCompletionConfirmationStatus.CONFIRMED
  ) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Action handler
  // ---------------------------------------------------------------------------
  //
  // memberPublicId is intentionally omitted.
  //
  // The backend command supports an optional memberPublicId and derives the
  // authenticated member when it is not supplied. The frontend therefore
  // does not need to invent or independently resolve the current member ID.
  //
  const handleWithdrawConfirmation = () => {
    withdrawConfirmation.mutate({
      journeyCompletionPublicId: completion.publicId,
      confirmationPublicId: confirmation.publicId,
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
        loading={withdrawConfirmation.isPending}
        disabled={withdrawConfirmation.isPending}
        onClick={handleWithdrawConfirmation}
      >
        {withdrawConfirmation.isPending
          ? 'Withdrawing…'
          : 'Withdraw confirmation'}
      </Button>

      {withdrawConfirmation.isError && (
        <p
          role="alert"
          className="text-sm text-[var(--danger)]"
        >
          {withdrawConfirmation.error instanceof Error
            ? withdrawConfirmation.error.message
            : 'Unable to withdraw the confirmation. Please try again.'}
        </p>
      )}
    </div>
  );
}