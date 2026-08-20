// -----------------------------------------------------------------------------
// Get Journey Completion Disputes Query
// -----------------------------------------------------------------------------
//
// Retrieves disputes belonging to a Journey Completion.
//
// Optional filters:
// - raisedByPublicId
// - status
// - reason
//
// Transport values remain primitives. The query handler converts them into
// the corresponding domain value objects before repository access.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Query Props
// -----------------------------------------------------------------------------

export interface GetJourneyCompletionDisputesQueryProps {
  completionPublicId: string;

  raisedByPublicId?: string;

  status?: string;

  reason?: string;
}

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetJourneyCompletionDisputesQuery extends Query {
  // ===========================================================================
  // Journey Completion
  // ===========================================================================

  public readonly completionPublicId: string;

  // ===========================================================================
  // Optional Raised By Filter
  // ===========================================================================

  public readonly raisedByPublicId?: string;

  // ===========================================================================
  // Optional Status Filter
  // ===========================================================================

  public readonly status?: string;

  // ===========================================================================
  // Optional Reason Filter
  // ===========================================================================

  public readonly reason?: string;

  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(props: GetJourneyCompletionDisputesQueryProps) {
    super();

    this.completionPublicId = props.completionPublicId;

    if (props.raisedByPublicId !== undefined) {
      this.raisedByPublicId = props.raisedByPublicId;
    }

    if (props.status !== undefined) {
      this.status = props.status;
    }

    if (props.reason !== undefined) {
      this.reason = props.reason;
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyCompletionDisputesQuery;
