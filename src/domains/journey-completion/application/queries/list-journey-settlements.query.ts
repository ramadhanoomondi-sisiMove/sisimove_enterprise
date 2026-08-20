// -----------------------------------------------------------------------------
// List Journey Settlements Query
// -----------------------------------------------------------------------------
//
// Retrieves Journey Settlement root entities.
//
// Optional filters:
// - journeyPublicId
// - providerPublicId
// - status
//
// The query carries transport/application primitives. The query handler is
// responsible for converting them into strongly typed domain value objects.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Query Props
// -----------------------------------------------------------------------------

export interface ListJourneySettlementsQueryProps {
  journeyPublicId?: string;

  providerPublicId?: string;

  status?: string;
}

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class ListJourneySettlementsQuery extends Query {
  // ===========================================================================
  // Journey Public ID
  // ===========================================================================

  public readonly journeyPublicId?: string;

  // ===========================================================================
  // Provider Public ID
  // ===========================================================================

  public readonly providerPublicId?: string;

  // ===========================================================================
  // Settlement Status
  // ===========================================================================

  public readonly status?: string;

  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(props: ListJourneySettlementsQueryProps = {}) {
    super();

    if (props.journeyPublicId !== undefined) {
      this.journeyPublicId = props.journeyPublicId;
    }

    if (props.providerPublicId !== undefined) {
      this.providerPublicId = props.providerPublicId;
    }

    if (props.status !== undefined) {
      this.status = props.status;
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ListJourneySettlementsQuery;
