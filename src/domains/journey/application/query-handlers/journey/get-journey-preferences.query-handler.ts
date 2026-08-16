// src/domains/journey/application/query-handlers/journey/get-journey-preferences.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyPreferencesQuery } from '../../queries/journey/get-journey-preferences.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyPreferencesEntity } from '../../../domain/entities/journey-preferences.entity';
import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyNotFoundException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetJourneyPreferencesQueryHandler implements QueryHandler<
  GetJourneyPreferencesQuery,
  JourneyPreferencesEntity | null
> {
  constructor(private readonly repository: JourneyRepository) {}

  async execute(
    query: GetJourneyPreferencesQuery,
  ): Promise<JourneyPreferencesEntity | null> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      query.journeyPublicId,
    );

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Resolve Preferences
    //
    // Preferences are owned by the Journey aggregate.
    // -------------------------------------------------------------------------

    return this.repository.findPreferences(aggregate.journeyId);
  }
}
