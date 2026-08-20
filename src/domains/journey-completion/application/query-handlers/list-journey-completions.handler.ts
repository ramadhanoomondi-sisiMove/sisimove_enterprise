// -----------------------------------------------------------------------------
// List Journey Completions Query Handler
// -----------------------------------------------------------------------------
//
// Retrieves Journey Completion root entities using the repository query
// contract.
//
// The repository is supplied explicitly and is not injected through NestJS.
// -----------------------------------------------------------------------------

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
// Handler
// -----------------------------------------------------------------------------

export class ListJourneyCompletionsHandler implements QueryHandler<
  ListJourneyCompletionsQuery,
  JourneyCompletionEntity[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
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
      return await this.repository.findJourneyCompletions();
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
    //
    // The repository exposes a dedicated Journey lookup rather than a
    // journey+provider/status combination query. Retrieve the completion
    // associated with the Journey and apply the remaining filters here.
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
      return await this.repository.findJourneyCompletionsByProviderAndStatus(
        providerPublicId,
        status,
      );
    }

    // -------------------------------------------------------------------------
    // Provider only
    // -------------------------------------------------------------------------

    if (providerPublicId !== undefined) {
      return await this.repository.findJourneyCompletionsByProviderPublicId(
        providerPublicId,
      );
    }

    // -------------------------------------------------------------------------
    // Status only
    // -------------------------------------------------------------------------

    if (status !== undefined) {
      return await this.repository.findJourneyCompletionsByStatus(status);
    }

    // -------------------------------------------------------------------------
    // Defensive fallback
    // -------------------------------------------------------------------------

    return await this.repository.findJourneyCompletions();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ListJourneyCompletionsHandler;
