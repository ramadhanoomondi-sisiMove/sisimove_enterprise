// -----------------------------------------------------------------------------
// List Journey Completions By Status Query Handler
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// 1. Retrieve Journey Completion entities matching a lifecycle status.
// 2. Optionally filter by provider public ID.
// 3. Optionally filter by journey public ID.
// 4. Apply combined filters when both provider and journey IDs are supplied.
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

import type { ListJourneyCompletionsByStatusQuery } from '../queries/list-journey-completions-by-status.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyCompletionEntity } from '../../domain/entities/journey-completion.entity';

import type { JourneyCompletionRepository } from '../../domain/repositories/journey-completion.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { JourneyCompletionStatus } from '../../domain/value-objects/journey-completion-status.vo';

import { JourneyCompletionProviderPublicId } from '../../domain/value-objects/journey-completion-provider-public-id.vo';

import { JourneyCompletionJourneyPublicId } from '../../domain/value-objects/journey-completion-journey-public-id.vo';

// -----------------------------------------------------------------------------
// Dependency Injection Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_COMPLETION_TOKENS } from '../journey-completion.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class ListJourneyCompletionsByStatusHandler implements QueryHandler<
  ListJourneyCompletionsByStatusQuery,
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
    query: ListJourneyCompletionsByStatusQuery,
  ): Promise<JourneyCompletionEntity[]> {
    const status = JourneyCompletionStatus.create(query.status);

    // -------------------------------------------------------------------------
    // Status + Provider + Journey
    // -------------------------------------------------------------------------

    if (
      query.providerPublicId !== undefined &&
      query.journeyPublicId !== undefined
    ) {
      const providerPublicId = new JourneyCompletionProviderPublicId(
        query.providerPublicId,
      );

      const journeyPublicId = new JourneyCompletionJourneyPublicId(
        query.journeyPublicId,
      );

      const completion =
        await this.repository.findJourneyCompletionByJourneyPublicId(
          journeyPublicId,
        );

      if (completion === null) {
        return [];
      }

      if (!completion.providerPublicId.equals(providerPublicId)) {
        return [];
      }

      if (!completion.status.equals(status)) {
        return [];
      }

      return [completion];
    }

    // -------------------------------------------------------------------------
    // Status + Provider
    // -------------------------------------------------------------------------

    if (query.providerPublicId !== undefined) {
      const providerPublicId = new JourneyCompletionProviderPublicId(
        query.providerPublicId,
      );

      return this.repository.findJourneyCompletionsByProviderAndStatus(
        providerPublicId,
        status,
      );
    }

    // -------------------------------------------------------------------------
    // Status + Journey
    // -------------------------------------------------------------------------

    if (query.journeyPublicId !== undefined) {
      const journeyPublicId = new JourneyCompletionJourneyPublicId(
        query.journeyPublicId,
      );

      const completion =
        await this.repository.findJourneyCompletionByJourneyPublicId(
          journeyPublicId,
        );

      if (completion === null) {
        return [];
      }

      if (!completion.status.equals(status)) {
        return [];
      }

      return [completion];
    }

    // -------------------------------------------------------------------------
    // Status only
    // -------------------------------------------------------------------------

    return this.repository.findJourneyCompletionsByStatus(status);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ListJourneyCompletionsByStatusHandler;
