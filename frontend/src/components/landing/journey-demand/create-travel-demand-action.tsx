// -----------------------------------------------------------------------------
// sisiMove — Create Travel Demand Action
// -----------------------------------------------------------------------------
//
// Presentation action for continuing an empty Journey search into the
// Journey Demand creation flow.
//
// Responsibilities:
// - Present a clear invitation to create a Journey Demand.
// - Render the shared sisiMove Button primitive.
// - Delegate the actual action to the parent.
//
// This component intentionally does NOT:
// - create a Journey Demand;
// - authenticate the traveller;
// - call an API;
// - navigate;
// - manage application state;
// - decide whether a demand should be created.
//
// The parent composition/application layer owns the actual flow.
// -----------------------------------------------------------------------------

import { Button } from '@/components/ui';

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export interface CreateTravelDemandActionProps {
  /**
   * Called when the traveller chooses to continue with Journey Demand
   * creation.
   *
   * The parent decides whether this opens registration, login, or an
   * authenticated demand-creation flow.
   */
  readonly onCreate?: () => void;

  /**
   * Optional disabled state supplied by the parent.
   */
  readonly disabled?: boolean;

  /**
   * Optional loading state supplied by the parent.
   */
  readonly loading?: boolean;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function CreateTravelDemandAction({
  onCreate,
  disabled = false,
  loading = false,
}: CreateTravelDemandActionProps) {
  return (
    <Button
      type="button"
      variant="primary"
      size="md"
      disabled={disabled}
      loading={loading}
      onClick={onCreate}
    >
      Create travel demand
    </Button>
  );
}
