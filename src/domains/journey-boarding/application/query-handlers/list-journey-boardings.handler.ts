// -----------------------------------------------------------------------------
// Journey Boarding — List Query Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { ListJourneyBoardingsQuery } from '../queries/list-journey-boardings.query';

// -----------------------------------------------------------------------------
// Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_BOARDING_TOKENS } from '../journey-boarding.tokens';

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
 *
 * Dependency injection:
 *
 * - Resolves the repository through JOURNEY_BOARDING_TOKENS.REPOSITORY.
 * - Keeps the repository implementation in the infrastructure layer.
 *
 * Query behavior:
 *
 * - The query is currently parameterless.
 * - The repository owns the retrieval of Journey Boarding root entities.
 * - This handler does not rehydrate aggregates or apply write-side behavior.
 */
@Injectable()
export class ListJourneyBoardingsHandler implements QueryHandler<
  ListJourneyBoardingsQuery,
  JourneyBoardingEntity[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(JOURNEY_BOARDING_TOKENS.REPOSITORY)
    private readonly repository: JourneyBoardingRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: ListJourneyBoardingsQuery,
  ): Promise<JourneyBoardingEntity[]> {
    // -------------------------------------------------------------------------
    // Query is intentionally parameterless.
    //
    // Explicitly consume the parameter to satisfy TypeScript configurations
    // that flag unused parameters.
    // -------------------------------------------------------------------------

    void query;

    // -------------------------------------------------------------------------
    // Lookup
    // -------------------------------------------------------------------------

    return this.repository.findJourneyBoardings();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ListJourneyBoardingsHandler;
