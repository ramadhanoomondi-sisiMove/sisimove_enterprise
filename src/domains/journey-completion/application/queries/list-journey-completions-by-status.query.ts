// -----------------------------------------------------------------------------
// List Journey Completions By Status Query
// -----------------------------------------------------------------------------
//
// Retrieves Journey Completions matching a specific lifecycle status.
//
// Optional provider and Journey filters allow the caller to further constrain
// the result set.
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface ListJourneyCompletionsByStatusQueryProps {
  status: string;

  providerPublicId?: string;

  journeyPublicId?: string;
}

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class ListJourneyCompletionsByStatusQuery extends Query {
  public readonly status: string;

  public readonly providerPublicId?: string;

  public readonly journeyPublicId?: string;

  public constructor(props: ListJourneyCompletionsByStatusQueryProps) {
    super();

    this.status = props.status;

    if (props.providerPublicId !== undefined) {
      this.providerPublicId = props.providerPublicId;
    }

    if (props.journeyPublicId !== undefined) {
      this.journeyPublicId = props.journeyPublicId;
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ListJourneyCompletionsByStatusQuery;
