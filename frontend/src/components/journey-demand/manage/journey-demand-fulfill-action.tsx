'use client';

import { Button } from '@/components/ui';

/**
 * Props for the Journey Demand fulfillment action.
 *
 * This component deliberately does not:
 * - call the API;
 * - own mutation state;
 * - determine whether fulfillment is allowed;
 * - inspect Journey Demand lifecycle state;
 * - decide whether the demand is actually fulfilled.
 *
 * The parent/container owns those responsibilities and supplies the
 * callback and current request state.
 */
export interface JourneyDemandFulfillActionProps {
  readonly onFulfill?: () => void;
  readonly isFulfilling?: boolean;
  readonly disabled?: boolean;
}

/**
 * Renders the action used to request fulfillment of a Journey Demand.
 *
 * Fulfillment semantics remain owned by the backend aggregate/application
 * boundary. This component is intentionally a thin presentation layer.
 */
export function JourneyDemandFulfillAction({
  onFulfill,
  isFulfilling = false,
  disabled = false,
}: JourneyDemandFulfillActionProps) {
  return (
    <Button
      type="button"
      variant="primary"
      size="md"
      onClick={onFulfill}
      loading={isFulfilling}
      disabled={disabled || !onFulfill}
    >
      Fulfill demand
    </Button>
  );
}

