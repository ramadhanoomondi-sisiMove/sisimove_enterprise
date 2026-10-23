
import { Query } from '../../../../../foundation/kernel/application/query';

/**
 * Requests complete Journey aggregates across all providers.
 *
 * Intended for authorized platform-wide administration views.
 * Provider-specific reads remain handled by GetDetailedJourneysQuery.
 */
export class GetAllDetailedJourneysQuery extends Query {
  constructor() {
    super();
  }
}

export default GetAllDetailedJourneysQuery;
