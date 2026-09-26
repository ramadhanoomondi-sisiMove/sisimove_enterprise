// -----------------------------------------------------------------------------
// sisiMove — Cancel Completion Action
// -----------------------------------------------------------------------------
//
// Presents the operation for cancelling Journey Completion.
//
// Responsibilities:
// - Determine whether cancellation is applicable to the supplied completion.
// - Build the variables expected by useCancelJourneyCompletion.
// - Invoke the Journey Completion mutation.
// - Present mutation progress and failure feedback.
//
// Non-responsibilities:
// - Does not perform HTTP requests directly.
// - Does not own Journey Completion aggregate rules.
// - Does not perform authorization.
// - Does not mutate the JourneyCompletion model locally.
//
// The backend JourneyCompletionAggregate remains authoritative.
// -----------------------------------------------------------------------------

import { Button } from '@/components/ui';

import {
  JourneyCompletionStatus,
  type JourneyCompletion,
} from '@/features/journey-completion/models';

import {
  useCancelJourneyCompletion,
} from '@/features/journey-completion/hooks/mutations';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface CancelCompletionActionProps {
  /**
   * Current Journey Completion projection.
   */
  completion: JourneyCompletion;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function CancelCompletionAction({
  completion,
}: CancelCompletionActionProps) {
  const cancelCompletion = useCancelJourneyCompletion();

  // ---------------------------------------------------------------------------
  // Client-visible applicability
  // ---------------------------------------------------------------------------
  //
  // Cancellation is presented during the pre-terminal completion states where
  // the operation is relevant to the UI.
  //
  // The backend remains responsible for determining whether cancellation is
  // actually permitted.
  // ---------------------------------------------------------------------------

  const isCancellable =
    completion.status === JourneyCompletionStatus.PENDING ||
    completion.status ===
      JourneyCompletionStatus.CONFIRMATION_REQUIRED;

  if (!isCancellable) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleCancelCompletion = () => {
    cancelCompletion.mutate({
      journeyCompletionPublicId: completion.publicId,
      request: {
        cancelledAt: new Date().toISOString(),
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
        loading={cancelCompletion.isPending}
        disabled={cancelCompletion.isPending}
        onClick={handleCancelCompletion}
      >
        {cancelCompletion.isPending
          ? 'Cancelling…'
          : 'Cancel completion'}
      </Button>

      {cancelCompletion.isError && (
        <p
          role="alert"
          className="text-sm text-[var(--danger)]"
        >
          {cancelCompletion.error instanceof Error
            ? cancelCompletion.error.message
            : 'Unable to cancel completion. Please try again.'}
        </p>
      )}
    </div>
  );
}