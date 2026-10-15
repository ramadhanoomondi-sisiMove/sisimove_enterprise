// -----------------------------------------------------------------------------
// List Journey Completions Query Handler
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// 1. Retrieve Journey Completion entities from the repository.
// 2. Support optional filtering by journey, provider, and status.
// 3. Delegate supported lookups to the existing repository methods.
// 4. Apply additional filters when the repository does not expose a combined
//    query for the requested criteria.
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

import type { ListJourneyCompletionsQuery } from '../queries/list-journey-completions.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyCompletionEntity } from '../../domain/entities/journey-completion.entity';

import type { JourneyCompletionRepository } from '../../domain/repositories/journey-completion.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { JourneyCompletionJourneyPublicId } from '../../domain/value-objects/journey-completion-journey-public-id.vo';

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
export class ListJourneyCompletionsHandler implements QueryHandler<
  ListJourneyCompletionsQuery,
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
    query: ListJourneyCompletionsQuery,
  ): Promise<JourneyCompletionEntity[]> {
    // -------------------------------------------------------------------------
    // No filters
    // -------------------------------------------------------------------------

    if (
      query.journeyPublicId === undefined &&
      query.providerPublicId === undefined &&
      query.status === undefined
    ) {
      return this.repository.findJourneyCompletions();
    }

    // -------------------------------------------------------------------------
    // Convert optional provider/status filters into domain value objects
    // -------------------------------------------------------------------------

    const providerPublicId =
      query.providerPublicId !== undefined
        ? new JourneyCompletionProviderPublicId(query.providerPublicId)
        : undefined;

    const status =
      query.status !== undefined
        ? JourneyCompletionStatus.create(query.status)
        : undefined;

    // -------------------------------------------------------------------------
    // Journey filter
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

      if (
        providerPublicId !== undefined &&
        !completion.providerPublicId.equals(providerPublicId)
      ) {
        return [];
      }

      if (status !== undefined && !completion.status.equals(status)) {
        return [];
      }

      return [completion];
    }

    // -------------------------------------------------------------------------
    // Provider + status
    // -------------------------------------------------------------------------

    if (providerPublicId !== undefined && status !== undefined) {
      return this.repository.findJourneyCompletionsByProviderAndStatus(
        providerPublicId,
        status,
      );
    }

    // -------------------------------------------------------------------------
    // Provider only
    // -------------------------------------------------------------------------

    if (providerPublicId !== undefined) {
      return this.repository.findJourneyCompletionsByProviderPublicId(
        providerPublicId,
      );
    }

    // -------------------------------------------------------------------------
    // Status only
    // -------------------------------------------------------------------------

    if (status !== undefined) {
      return this.repository.findJourneyCompletionsByStatus(status);
    }

    // -------------------------------------------------------------------------
    // Defensive fallback
    // -------------------------------------------------------------------------

    return this.repository.findJourneyCompletions();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ListJourneyCompletionsHandler;
