import { Query } from '../../../../../foundation/kernel/application/query';

export class GetDetailedJourneysQuery extends Query {
  constructor(public readonly providerPublicId: string) {
    super();
  }
}

export default GetDetailedJourneysQuery;
