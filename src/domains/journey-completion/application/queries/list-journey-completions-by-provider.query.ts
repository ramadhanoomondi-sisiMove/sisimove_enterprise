// -----------------------------------------------------------------------------
// List Journey Completions By Provider Query
// -----------------------------------------------------------------------------
//
// Retrieves Journey Completions belonging to a specific provider.
//
// Optional status filtering allows the caller to constrain the result set by
// Journey Completion lifecycle status.
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface ListJourneyCompletionsByProviderQueryProps {
  providerPublicId: string;
  status?: string;
}

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

export class ListJourneyCompletionsByProviderQuery extends Query {
  public readonly providerPublicId: string;

  public readonly status?: string;

  public constructor(props: ListJourneyCompletionsByProviderQueryProps) {
    super();

    this.providerPublicId = props.providerPublicId;

    if (props.status !== undefined) {
      this.status = props.status;
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ListJourneyCompletionsByProviderQuery;
