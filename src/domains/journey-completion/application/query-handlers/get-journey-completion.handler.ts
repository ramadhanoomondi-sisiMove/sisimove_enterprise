// -----------------------------------------------------------------------------
// Get Journey Completion Query Handler
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// 1. Receive a query containing a Journey Completion public ID.
// 2. Construct the corresponding domain value object.
// 3. Retrieve the Journey Completion aggregate through the repository.
//
// Architectural rules:
//
// - NestJS manages this handler through @Injectable().
// - The repository is injected using JOURNEY_COMPLETION_TOKENS.REPOSITORY.
// - The handler delegates retrieval to the repository.
//
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
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { JourneyCompletionAggregate } from '../../domain/aggregates/journey-completion.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyCompletionRepository } from '../../domain/repositories/journey-completion.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { JourneyCompletionPublicId } from '../../domain/value-objects';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyCompletionQuery } from '../queries/get-journey-completion.query';

// -----------------------------------------------------------------------------
// Dependency Injection Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_COMPLETION_TOKENS } from '../journey-completion.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class GetJourneyCompletionHandler implements QueryHandler<
  GetJourneyCompletionQuery,
  JourneyCompletionAggregate | null
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(JOURNEY_COMPLETION_TOKENS.REPOSITORY)
    private readonly repository: JourneyCompletionRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetJourneyCompletionQuery,
  ): Promise<JourneyCompletionAggregate | null> {
    const journeyCompletionPublicId = new JourneyCompletionPublicId(
      query.journeyCompletionPublicId,
    );

    return this.repository.findByPublicId(journeyCompletionPublicId);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyCompletionHandler;
