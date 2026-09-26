// -----------------------------------------------------------------------------
// sisiMove — Journey Completion Settlement Status
// -----------------------------------------------------------------------------
//
// Presentation-only status badge for a Journey Settlement.
//
// The settlement status is supplied by the backend and mapped to the
// frontend's JourneySettlementStatus enum. This component intentionally
// contains no lifecycle logic.
// -----------------------------------------------------------------------------

import { Badge } from '@/components/ui';

import {
  JourneySettlementStatus,
  type JourneySettlementStatus as JourneySettlementStatusValue,
} from '@/features/journey-completion/models';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface JourneyCompletionSettlementStatusProps {
  status: JourneySettlementStatusValue;
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

function getStatusLabel(status: JourneySettlementStatusValue): string {
  switch (status) {
    case JourneySettlementStatus.PENDING:
      return 'Pending';

    case JourneySettlementStatus.SUBMITTED:
      return 'Submitted';

    case JourneySettlementStatus.PROCESSING:
      return 'Processing';

    case JourneySettlementStatus.COMPLETED:
      return 'Completed';

    case JourneySettlementStatus.FAILED:
      return 'Failed';

    case JourneySettlementStatus.HELD:
      return 'Held';

    case JourneySettlementStatus.CANCELLED:
      return 'Cancelled';

    default:
      throw new Error(
        `Unsupported Journey Settlement status: ${String(status)}`,
      );
  }
}

function getStatusVariant(
  status: JourneySettlementStatusValue,
): 'default' | 'success' | 'warning' | 'danger' {
  switch (status) {
    case JourneySettlementStatus.PENDING:
      return 'default';

    case JourneySettlementStatus.SUBMITTED:
    case JourneySettlementStatus.PROCESSING:
      return 'warning';

    case JourneySettlementStatus.COMPLETED:
      return 'success';

    case JourneySettlementStatus.FAILED:
    case JourneySettlementStatus.CANCELLED:
      return 'danger';

    case JourneySettlementStatus.HELD:
      return 'warning';

    default:
      throw new Error(
        `Unsupported Journey Settlement status: ${String(status)}`,
      );
  }
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function JourneyCompletionSettlementStatus({
  status,
}: JourneyCompletionSettlementStatusProps) {
  return (
    <Badge variant={getStatusVariant(status)} size="sm">
      {getStatusLabel(status)}
    </Badge>
  );
}