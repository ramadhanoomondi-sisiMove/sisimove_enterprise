// -----------------------------------------------------------------------------
// Get Journey Completion Confirmation Query
// -----------------------------------------------------------------------------
//
// Retrieves a single Journey Completion confirmation by its public identity
// within the owning Journey Completion aggregate.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Query Props
// -----------------------------------------------------------------------------

export interface GetJourneyCompletionConfirmationQueryProps {
  completionPublicId: string;

  confirmationPublicId: string;
}

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetJourneyCompletionConfirmationQuery extends Query {
  // ===========================================================================
  // Journey Completion
  // ===========================================================================

  public readonly completionPublicId: string;

  // ===========================================================================
  // Confirmation
  // ===========================================================================

  public readonly confirmationPublicId: string;

  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(props: GetJourneyCompletionConfirmationQueryProps) {
    super();

    this.completionPublicId = props.completionPublicId;

    this.confirmationPublicId = props.confirmationPublicId;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyCompletionConfirmationQuery;
