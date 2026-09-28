'use client';

import { Button } from '@/components/ui';

/**
 * Props for the Journey Demand conversion action.
 *
 * This component deliberately does not:
 * - call the API;
 * - own mutation state;
 * - determine whether conversion is allowed;
 * - inspect Journey Demand lifecycle state;
 * - construct or create a Journey.
 *
 * The parent/container owns those responsibilities and supplies the
 * callback and current request state.
 */
export interface JourneyDemandConvertActionProps {
  readonly onConvert?: () => void;
  readonly isConverting?: boolean;
  readonly disabled?: boolean;
}

/**
 * Renders the action used to request conversion of a Journey Demand.
 *
 * Conversion semantics belong to the backend aggregate/application boundary.
 * This component only renders the user action.
 */
export function JourneyDemandConvertAction({
  onConvert,
  isConverting = false,
  disabled = false,
}: JourneyDemandConvertActionProps) {
  return (
    <Button
      type="button"
      variant="secondary"
      size="md"
      onClick={onConvert}
      loading={isConverting}
      disabled={disabled || !onConvert}
    >
      Convert demand
    </Button>
  );
}

