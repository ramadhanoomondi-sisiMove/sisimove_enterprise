// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneysByStatusQuery } from '../../queries/journey/get-journeys-by-status.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyEntity } from '../../../domain/entities/journey.entity';
import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

import { JourneyStatusValueObject } from '../../../domain/value-objects/journey-status.vo';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetJourneysByStatusQueryHandler implements QueryHandler<
  GetJourneysByStatusQuery,
  JourneyEntity[]
> {
  constructor(private readonly repository: JourneyRepository) {}

  async execute(query: GetJourneysByStatusQuery): Promise<JourneyEntity[]> {
    const status = new JourneyStatusValueObject(query.status);

    return this.repository.findJourneysByStatus(status);
  }
}
