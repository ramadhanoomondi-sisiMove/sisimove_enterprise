// -----------------------------------------------------------------------------
// Journey Settlement — Count By Status Query
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

import type { JourneySettlementStatusValue } from '../../domain/value-objects/journey-settlement-status.vo';

// =============================================================================
// Props
// =============================================================================

export interface CountJourneySettlementsByStatusQueryProps {
  status: JourneySettlementStatusValue;
}

// =============================================================================
// Query
// =============================================================================

export class CountJourneySettlementsByStatusQuery extends Query {
  public readonly status: JourneySettlementStatusValue;

  public constructor(props: CountJourneySettlementsByStatusQueryProps) {
    super();
    this.status = props.status;
  }
}
