// -----------------------------------------------------------------------------
// Journey Boarding — List Query Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { ListJourneyBoardingsQuery } from '../queries/list-journey-boardings.query';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { JourneyBoardingEntity } from '../../domain/entities/journey-boarding.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyBoardingRepository } from '../../domain/repositories/journey-boarding.repository';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of Journey Boarding root entities.
 *
 * This query intentionally returns root entities rather than aggregates,
 * matching the repository's read-side findJourneyBoardings() contract.
 */
export class ListJourneyBoardingsHandler implements QueryHandler<
  ListJourneyBoardingsQuery,
  JourneyBoardingEntity[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  constructor(private readonly repository: JourneyBoardingRepository) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: ListJourneyBoardingsQuery,
  ): Promise<JourneyBoardingEntity[]> {
    // -------------------------------------------------------------------------
    // Query is intentionally parameterless.
    // -------------------------------------------------------------------------

    void query;

    // -------------------------------------------------------------------------
    // Lookup
    // -------------------------------------------------------------------------

    return this.repository.findJourneyBoardings();
  }
}
