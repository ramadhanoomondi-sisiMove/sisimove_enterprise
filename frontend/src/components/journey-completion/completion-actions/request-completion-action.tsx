// -----------------------------------------------------------------------------
// sisiMove — Request Completion Action
// -----------------------------------------------------------------------------
//
// Presents the operation for requesting Journey Completion.
//
// Responsibilities:
// - Determine whether the request operation is applicable to the supplied
//   completion projection.
// - Build the variables expected by useRequestJourneyCompletion.
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
  useRequestJourneyCompletion,
} from '@/features/journey-completion/hooks/mutations';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface RequestCompletionActionProps {
  /**
   * Current Journey Completion projection.
   */
  completion: JourneyCompletion;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function RequestCompletionAction({
  completion,
}: RequestCompletionActionProps) {
  const requestCompletion = useRequestJourneyCompletion();

  // ---------------------------------------------------------------------------
  // Client-visible applicability
  // ---------------------------------------------------------------------------
  //
  // Only a PENDING completion presents the request operation.
  //
  // This is a presentation optimization only. The backend remains responsible
  // for validating the actual lifecycle transition.
  // ---------------------------------------------------------------------------

  if (
    completion.status !==
    JourneyCompletionStatus.PENDING
  ) {
    return null;
  }

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleRequestCompletion = () => {
    requestCompletion.mutate({
      journeyCompletionPublicId: completion.publicId,
      request: {
        requestAt: new Date().toISOString(),
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
        loading={requestCompletion.isPending}
        disabled={requestCompletion.isPending}
        onClick={handleRequestCompletion}
      >
        {requestCompletion.isPending
          ? 'Requesting…'
          : 'Request completion'}
      </Button>

      {requestCompletion.isError && (
        <p
          role="alert"
          className="text-sm text-[var(--danger)]"
        >
          {requestCompletion.error instanceof Error
            ? requestCompletion.error.message
            : 'Unable to request completion. Please try again.'}
        </p>
      )}
    </div>
  );
}