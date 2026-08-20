// -----------------------------------------------------------------------------
// Get Journey Completion Query
// -----------------------------------------------------------------------------
//
// Retrieves a single Journey Completion aggregate by public identity.
//
// Optional filters allow the caller to constrain the lookup by Journey and/or
// provider identity without moving persistence concerns into the query.
//
// Compatible with:
// - exactOptionalPropertyTypes: true
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// =============================================================================
// Props
// =============================================================================

export interface GetJourneyCompletionQueryProps {
  journeyCompletionPublicId: string;

  journeyPublicId?: string;

  providerPublicId?: string;
}

// =============================================================================
// Query
// =============================================================================

export class GetJourneyCompletionQuery extends Query {
  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  public readonly journeyCompletionPublicId: string;

  public readonly journeyPublicId?: string;

  public readonly providerPublicId?: string;

  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(props: GetJourneyCompletionQueryProps) {
    super();

    this.journeyCompletionPublicId = props.journeyCompletionPublicId;

    if (props.journeyPublicId !== undefined) {
      this.journeyPublicId = props.journeyPublicId;
    }

    if (props.providerPublicId !== undefined) {
      this.providerPublicId = props.providerPublicId;
    }
  }
}
