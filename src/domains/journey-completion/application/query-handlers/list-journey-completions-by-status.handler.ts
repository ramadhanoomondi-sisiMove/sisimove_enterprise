// -----------------------------------------------------------------------------
// List Journey Completions By Status Query Handler
// -----------------------------------------------------------------------------
//
// Retrieves Journey Completion root entities matching a lifecycle status.
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
// Handler
// -----------------------------------------------------------------------------

export class ListJourneyCompletionsByStatusHandler implements QueryHandler<
  ListJourneyCompletionsByStatusQuery,
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

      return await this.repository.findJourneyCompletionsByProviderAndStatus(
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

    return await this.repository.findJourneyCompletionsByStatus(status);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ListJourneyCompletionsByStatusHandler;
