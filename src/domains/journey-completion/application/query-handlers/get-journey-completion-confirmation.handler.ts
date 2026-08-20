// -----------------------------------------------------------------------------
// Get Journey Completion Confirmation Query Handler
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyCompletionConfirmationQuery } from '../queries/get-journey-completion-confirmation.query';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { JourneyCompletionConfirmationEntity } from '../../domain/entities/journey-completion-confirmation.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyCompletionRepository } from '../../domain/repositories/journey-completion.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { JourneyCompletionPublicId } from '../../domain/value-objects/journey-completion-public-id.vo';

import { JourneyCompletionConfirmationPublicId } from '../../domain/value-objects/journey-completion-confirmation-public-id.vo';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of a single Journey Completion confirmation.
 *
 * The confirmation is resolved within its owning Journey Completion using
 * both public identities.
 *
 * The repository is supplied explicitly and is not injected through NestJS.
 */
export class GetJourneyCompletionConfirmationHandler implements QueryHandler<
  GetJourneyCompletionConfirmationQuery,
  JourneyCompletionConfirmationEntity | null
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
    query: GetJourneyCompletionConfirmationQuery,
  ): Promise<JourneyCompletionConfirmationEntity | null> {
    const completionPublicId = new JourneyCompletionPublicId(
      query.completionPublicId,
    );

    const confirmationPublicId = new JourneyCompletionConfirmationPublicId(
      query.confirmationPublicId,
    );

    return await this.repository.findConfirmationByCompletionPublicId(
      completionPublicId,
      confirmationPublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyCompletionConfirmationHandler;
