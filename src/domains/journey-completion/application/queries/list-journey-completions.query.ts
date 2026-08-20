// -----------------------------------------------------------------------------
// List Journey Completions Query
// -----------------------------------------------------------------------------
//
// Retrieves Journey Completion root entities with optional filters.
//
// The query contains application-level filter values only. Conversion into
// domain value objects is performed by the query handler.
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface ListJourneyCompletionsQueryProps {
  journeyPublicId?: string;
  providerPublicId?: string;
  status?: string;
}

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class ListJourneyCompletionsQuery extends Query {
  public readonly journeyPublicId?: string;
  public readonly providerPublicId?: string;
  public readonly status?: string;

  public constructor(props: ListJourneyCompletionsQueryProps = {}) {
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

export default ListJourneyCompletionsQuery;
