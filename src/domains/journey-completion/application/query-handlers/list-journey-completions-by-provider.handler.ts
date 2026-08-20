// -----------------------------------------------------------------------------
// List Journey Completions By Provider Query Handler
// -----------------------------------------------------------------------------
//
// Retrieves Journey Completion root entities belonging to a provider.
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
// Handler
// -----------------------------------------------------------------------------

export class ListJourneyCompletionsByProviderHandler implements QueryHandler<
  ListJourneyCompletionsByProviderQuery,
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

      return await this.repository.findJourneyCompletionsByProviderAndStatus(
        providerPublicId,
        status,
      );
    }

    // -------------------------------------------------------------------------
    // Provider only
    // -------------------------------------------------------------------------

    return await this.repository.findJourneyCompletionsByProviderPublicId(
      providerPublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ListJourneyCompletionsByProviderHandler;
