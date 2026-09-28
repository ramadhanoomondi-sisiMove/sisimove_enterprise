// -----------------------------------------------------------------------------
// sisiMove — Journey Demand Cancel Action
// -----------------------------------------------------------------------------
//
// Presentational cancel action for an authenticated Journey Demand.
//
// Architecture:
// - Owns no server state.
// - Performs no API requests.
// - Performs no authorization checks.
// - Does not inspect Journey Demand lifecycle state.
// - Does not determine whether cancellation is allowed.
// - Does not perform confirmation.
// - Parent/container supplies the capability and callback.
// - Mutation state is supplied by the parent.
//
// The cancellation confirmation experience is intentionally separated from
// this button. The higher-level cancel dialog/management component owns any
// confirmation workflow before invoking onCancel.
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

export interface JourneyDemandCancelActionProps {
  readonly onCancel?: () => void;
  readonly isCancelling?: boolean;
  readonly disabled?: boolean;
}

export function JourneyDemandCancelAction({
  onCancel,
  isCancelling = false,
  disabled = false,
}: JourneyDemandCancelActionProps) {
  return (
    <Button
      type="button"
      variant="danger"
      size="md"
      onClick={onCancel}
      loading={isCancelling}
      disabled={disabled || !onCancel}
    >
      Cancel demand
    </Button>
  );
}

