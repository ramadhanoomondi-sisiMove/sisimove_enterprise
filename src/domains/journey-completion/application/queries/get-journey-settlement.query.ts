// -----------------------------------------------------------------------------
// Get Journey Settlement Query
// -----------------------------------------------------------------------------
//
// Retrieves a Journey Settlement aggregate by its public identity.
//
// The application query carries the transport-level public identifier.
// Conversion into the domain value object is performed by the query handler.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Query Props
// -----------------------------------------------------------------------------

export interface GetJourneySettlementQueryProps {
  journeySettlementPublicId: string;
}

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class GetJourneySettlementQuery extends Query {
  // ===========================================================================
  // Journey Settlement Public ID
  // ===========================================================================

  public readonly journeySettlementPublicId: string;

  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(props: GetJourneySettlementQueryProps) {
    super();

    this.journeySettlementPublicId = props.journeySettlementPublicId;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneySettlementQuery;
