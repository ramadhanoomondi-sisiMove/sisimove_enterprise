import { Query } from '../../../../../foundation/kernel/application/query';

export class GetDetailedJourneyByPublicIdQuery extends Query {
  constructor(public readonly journeyPublicId: string) {
    super();
  }
}

export default GetDetailedJourneyByPublicIdQuery;
