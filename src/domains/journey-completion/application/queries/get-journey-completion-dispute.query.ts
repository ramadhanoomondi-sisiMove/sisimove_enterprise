// -----------------------------------------------------------------------------
// Get Journey Completion Dispute Query
// -----------------------------------------------------------------------------
//
// Retrieves a single Journey Completion dispute by its public identity within
// the owning Journey Completion.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Query Props
// -----------------------------------------------------------------------------

export interface GetJourneyCompletionDisputeQueryProps {
  completionPublicId: string;

  disputePublicId: string;
}

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetJourneyCompletionDisputeQuery extends Query {
  // ===========================================================================
  // Journey Completion
  // ===========================================================================

  public readonly completionPublicId: string;

  // ===========================================================================
  // Dispute
  // ===========================================================================

  public readonly disputePublicId: string;

  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(props: GetJourneyCompletionDisputeQueryProps) {
    super();

    this.completionPublicId = props.completionPublicId;
    this.disputePublicId = props.disputePublicId;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyCompletionDisputeQuery;
