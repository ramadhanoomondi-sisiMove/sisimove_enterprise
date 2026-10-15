// -----------------------------------------------------------------------------
// Get Journey Completion Confirmation Query Handler
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// 1. Receive the confirmation lookup query.
// 2. Construct the owning Journey Completion public ID.
// 3. Construct the confirmation public ID.
// 4. Retrieve the confirmation through the Journey Completion repository.
//
// Architectural rules:
//
// - NestJS manages this handler through @Injectable().
// - The repository is injected through the Journey Completion repository token.
// - Both public identities are required to resolve the confirmation within
//   its owning Journey Completion.
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
// Dependency Injection Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_COMPLETION_TOKENS } from '../journey-completion.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of a single Journey Completion confirmation.
 *
 * The confirmation is resolved within its owning Journey Completion using
 * both public identities.
 *
 * NestJS injects the repository through the registered repository token.
 */
@Injectable()
export class GetJourneyCompletionConfirmationHandler implements QueryHandler<
  GetJourneyCompletionConfirmationQuery,
  JourneyCompletionConfirmationEntity | null
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
    query: GetJourneyCompletionConfirmationQuery,
  ): Promise<JourneyCompletionConfirmationEntity | null> {
    const completionPublicId = new JourneyCompletionPublicId(
      query.completionPublicId,
    );

    const confirmationPublicId = new JourneyCompletionConfirmationPublicId(
      query.confirmationPublicId,
    );

    return this.repository.findConfirmationByCompletionPublicId(
      completionPublicId,
      confirmationPublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneyCompletionConfirmationHandler;
