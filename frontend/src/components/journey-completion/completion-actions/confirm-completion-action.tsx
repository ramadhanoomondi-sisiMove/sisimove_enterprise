// -----------------------------------------------------------------------------
// sisiMove — Confirm Completion Action
// -----------------------------------------------------------------------------
//
// Presents the operation for confirming Journey Completion.
//
// Responsibilities:
// - Determine whether confirmation is applicable to the supplied completion.
// - Build the variables expected by useConfirmJourneyCompletion.
// - Invoke the Journey Completion mutation.
// - Present mutation progress and failure feedback.
//
// Non-responsibilities:
// - Does not perform HTTP requests directly.
// - Does not determine the authenticated member.
// - Does not own Journey Completion aggregate rules.
// - Does not perform authorization.
// - Does not mutate the JourneyCompletion model locally.
//
// The backend derives the authenticated member from the session and remains
// authoritative for the actual transition.
// -----------------------------------------------------------------------------

import { Button } from '@/components/ui';

import {
  JourneyCompletionStatus,
  type JourneyCompletion,
} from '@/features/journey-completion/models';

import {
  useConfirmJourneyCompletion,
} from '@/features/journey-completion/hooks/mutations';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface ConfirmCompletionActionProps {
  /**
   * Current Journey Completion projection.
   */
  completion: JourneyCompletion;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function ConfirmCompletionAction({
  completion,
}: ConfirmCompletionActionProps) {
  const confirmCompletion = useConfirmJourneyCompletion();

  // ---------------------------------------------------------------------------
  // Client-visible applicability
  // ---------------------------------------------------------------------------
  //
  // Only a CONFIRMATION_REQUIRED completion presents the confirmation
  // operation.
  //
  // This does not replace backend lifecycle validation.
  // ---------------------------------------------------------------------------

  if (
    completion.status !==
    JourneyCompletionStatus.CONFIRMATION_REQUIRED
  ) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleConfirmCompletion = () => {
    confirmCompletion.mutate({
      journeyCompletionPublicId: completion.publicId,
      request: {
        confirmedAt: new Date().toISOString(),
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
        variant="primary"
        size="md"
        loading={confirmCompletion.isPending}
        disabled={confirmCompletion.isPending}
        onClick={handleConfirmCompletion}
      >
        {confirmCompletion.isPending
          ? 'Confirming…'
          : 'Confirm completion'}
      </Button>

      {confirmCompletion.isError && (
        <p
          role="alert"
          className="text-sm text-[var(--danger)]"
        >
          {confirmCompletion.error instanceof Error
            ? confirmCompletion.error.message
            : 'Unable to confirm completion. Please try again.'}
        </p>
      )}
    </div>
  );
}