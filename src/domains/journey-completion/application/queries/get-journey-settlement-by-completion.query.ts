// -----------------------------------------------------------------------------
// Get Journey Settlement By Completion Query
// -----------------------------------------------------------------------------
//
// Retrieves the Journey Settlement associated with a Journey Completion.
//
// The Journey Completion public identifier remains a transport/application
// primitive until it is converted to its domain value object by the query
// handler.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Query Props
// -----------------------------------------------------------------------------

export interface GetJourneySettlementByCompletionQueryProps {
  completionPublicId: string;
}

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetJourneySettlementByCompletionQuery extends Query {
  // ===========================================================================
  // Journey Completion Public ID
  // ===========================================================================

  public readonly completionPublicId: string;

  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(props: GetJourneySettlementByCompletionQueryProps) {
    super();

    this.completionPublicId = props.completionPublicId;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneySettlementByCompletionQuery;
