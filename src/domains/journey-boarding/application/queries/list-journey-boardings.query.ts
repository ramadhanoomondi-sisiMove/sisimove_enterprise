// -----------------------------------------------------------------------------
// Journey Boarding — List Query
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Retrieves all Journey Boarding root entities.
 *
 * This is a read-side query and does not require aggregate rehydration.
 */
export class ListJourneyBoardingsQuery extends Query {
  constructor() {
    super();
  }
}
