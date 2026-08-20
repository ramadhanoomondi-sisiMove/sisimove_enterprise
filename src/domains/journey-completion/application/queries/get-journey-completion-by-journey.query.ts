// -----------------------------------------------------------------------------
// Get Journey Completion By Journey Query
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

export interface GetJourneyCompletionByJourneyQueryProps {
  journeyPublicId: string;
}

export class GetJourneyCompletionByJourneyQuery extends Query {
  public readonly journeyPublicId: string;

  public constructor(props: GetJourneyCompletionByJourneyQueryProps) {
    super();

    this.journeyPublicId = props.journeyPublicId;
  }
}

export default GetJourneyCompletionByJourneyQuery;
