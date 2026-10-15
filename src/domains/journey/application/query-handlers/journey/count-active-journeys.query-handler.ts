// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Injectable, Inject } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { CountActiveJourneysQuery } from '../../queries/journey/count-active-journeys.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../journey.tokens';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

@Injectable()
export class CountActiveJourneysQueryHandler implements QueryHandler<
  CountActiveJourneysQuery,
  number
> {
  constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly repository: JourneyRepository,
  ) {}

  async execute(): Promise<number> {
    return this.repository.countActive();
  }
}
