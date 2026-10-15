// -----------------------------------------------------------------------------
// List Journey Completions By Provider Query Handler
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// 1. Retrieve Journey Completion entities belonging to a provider.
// 2. Optionally filter the results by Journey Completion status.
// 3. Delegate retrieval to the Journey Completion repository.
//
// Architectural rules:
//
// - NestJS manages this handler through @Injectable().
// - The repository is injected using JOURNEY_COMPLETION_TOKENS.REPOSITORY.
// - Existing repository methods and domain value objects are preserved.
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
// Query
// -----------------------------------------------------------------------------

import type { ListJourneyCompletionsByProviderQuery } from '../queries/list-journey-completions-by-provider.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyCompletionEntity } from '../../domain/entities/journey-completion.entity';

import type { JourneyCompletionRepository } from '../../domain/repositories/journey-completion.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { JourneyCompletionProviderPublicId } from '../../domain/value-objects/journey-completion-provider-public-id.vo';

import { JourneyCompletionStatus } from '../../domain/value-objects/journey-completion-status.vo';

// -----------------------------------------------------------------------------
// Dependency Injection Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_COMPLETION_TOKENS } from '../journey-completion.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class ListJourneyCompletionsByProviderHandler implements QueryHandler<
  ListJourneyCompletionsByProviderQuery,
  JourneyCompletionEntity[]
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
    query: ListJourneyCompletionsByProviderQuery,
  ): Promise<JourneyCompletionEntity[]> {
    const providerPublicId = new JourneyCompletionProviderPublicId(
      query.providerPublicId,
    );

    // -------------------------------------------------------------------------
    // Provider + status
    // -------------------------------------------------------------------------

    if (query.status !== undefined) {
      const status = JourneyCompletionStatus.create(query.status);

      return this.repository.findJourneyCompletionsByProviderAndStatus(
        providerPublicId,
        status,
      );
    }

    // -------------------------------------------------------------------------
    // Provider only
    // -------------------------------------------------------------------------

    return this.repository.findJourneyCompletionsByProviderPublicId(
      providerPublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ListJourneyCompletionsByProviderHandler;
