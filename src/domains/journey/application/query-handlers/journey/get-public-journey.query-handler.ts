// src/domains/journey/application/query-handlers/public/get-public-journey.query-handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetPublicJourneyQuery } from '../../queries/journey/get-public-journey.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyEntity } from '../../../domain/entities/journey.entity';
import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../journey.tokens';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

/**
 * Handles public Journey reads.
 *
 * This handler represents the Journey domain's public read boundary.
 *
 * It deliberately does not use the general Journey lookup because a Journey
 * being addressable by public identifier does not mean that it is publicly
 * discoverable.
 *
 * The repository applies the public visibility constraint and returns null
 * when the Journey does not exist or is not currently publicly discoverable.
 */
@Injectable()
export class GetPublicJourneyQueryHandler implements QueryHandler<
  GetPublicJourneyQuery,
  JourneyEntity | null
> {
  public constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly repository: JourneyRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execution
  // ---------------------------------------------------------------------------

  public async execute(
    query: GetPublicJourneyQuery,
  ): Promise<JourneyEntity | null> {
    return this.repository.findPublicJourneyByPublicId(query.journeyPublicId);
  }
}
