// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Publish Action
// -----------------------------------------------------------------------------
//
// Presentational publish action for an authenticated Journey Demand.
//
// Architecture:
// - Owns no server state.
// - Performs no API requests.
// - Performs no authorization checks.
// - Does not inspect Journey Demand lifecycle state.
// - Does not derive whether publishing is allowed.
// - Parent/container supplies the capability and callback.
// - Mutation state is supplied by the parent.
//
// The parent/container is responsible for:
// - authorization;
// - mutation execution;
// - backend validation;
// - success/error handling;
// - refreshing the authoritative Journey Demand projection.
// -----------------------------------------------------------------------------

'use client';

import { Button } from '@/components/ui';

export interface JourneyDemandPublishActionProps {
  readonly onPublish?: () => void;
  readonly isPublishing?: boolean;
  readonly disabled?: boolean;
}

export function JourneyDemandPublishAction({
  onPublish,
  isPublishing = false,
  disabled = false,
}: JourneyDemandPublishActionProps) {
  return (
    <Button
      type="button"
      variant="primary"
      size="md"
      onClick={onPublish}
      loading={isPublishing}
      disabled={disabled || !onPublish}
    >
      Publish demand
    </Button>
  );
}

