// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Injectable, Inject } from '@nestjs/common';

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
// Application — Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../journey.tokens';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

@Injectable()
export class GetJourneysByStatusQueryHandler implements QueryHandler<
  GetJourneysByStatusQuery,
  JourneyEntity[]
> {
  constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly repository: JourneyRepository,
  ) {}

  async execute(query: GetJourneysByStatusQuery): Promise<JourneyEntity[]> {
    const status = new JourneyStatusValueObject(query.status);

    return this.repository.findJourneysByStatus(status);
  }
}
