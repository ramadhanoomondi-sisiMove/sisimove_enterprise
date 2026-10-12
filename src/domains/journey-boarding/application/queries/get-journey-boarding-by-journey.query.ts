// -----------------------------------------------------------------------------
// Journey Boarding — Get By Journey Query
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';
import type { JourneyPublicId } from '../../../journey/domain/value-objects';

/**
 * Retrieves the Journey Boarding associated with a Journey.
 *
 * A Journey owns at most one Journey Boarding aggregate.
 */
export class GetJourneyBoardingByJourneyQuery extends Query {
  constructor(
    /**
     * Public identifier of the Journey whose boarding process is requested.
     */
    public readonly journeyId: JourneyPublicId,
  ) {
    super();
  }
}
