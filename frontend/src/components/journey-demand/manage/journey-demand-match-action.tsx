// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Match Action
// -----------------------------------------------------------------------------
//
// Presentational match action for an authenticated Journey Demand.
//
// Architecture:
// - Owns no server state.
// - Performs no API requests.
// - Performs no authorization checks.
// - Does not inspect Journey Demand lifecycle state.
// - Does not determine whether matching is allowed.
// - Does not select or construct a Journey.
// - Parent/container supplies the capability and callback.
// - Mutation state is supplied by the parent.
//
// Matching is a backend-owned lifecycle operation. This component only
// provides the user-facing action that invokes the parent's callback.
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

export interface JourneyDemandMatchActionProps {
  readonly onMatch?: () => void;
  readonly isMatching?: boolean;
  readonly disabled?: boolean;
}

export function JourneyDemandMatchAction({
  onMatch,
  isMatching = false,
  disabled = false,
}: JourneyDemandMatchActionProps) {
  return (
    <Button
      type="button"
      variant="secondary"
      size="md"
      onClick={onMatch}
      loading={isMatching}
      disabled={disabled || !onMatch}
    >
      Match demand
    </Button>
  );
}

