// -----------------------------------------------------------------------------
// Get Journey Settlement By Completion Query Handler
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// 1. Receive a query containing a Journey Completion public ID.
// 2. Construct the Journey Completion public ID value object.
// 3. Retrieve the associated Journey Settlement through its own repository.
//
// Architectural rules:
//
// - NestJS manages this handler through @Injectable().
// - The repository is injected using JOURNEY_SETTLEMENT_TOKENS.REPOSITORY.
// - Journey Settlement remains a separate aggregate.
// - The handler does not retrieve settlement data through the
//   Journey Completion aggregate.
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

import type { GetJourneySettlementByCompletionQuery } from '../queries/get-journey-settlement-by-completion.query';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { JourneySettlementEntity } from '../../domain/entities/journey-settlement.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneySettlementRepository } from '../../domain/repositories/journey-settlement.repository';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

import { JourneyCompletionPublicId } from '../../domain/value-objects/journey-completion-public-id.vo';

// -----------------------------------------------------------------------------
// Dependency Injection Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_SETTLEMENT_TOKENS } from '../journey-settlement.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of the Journey Settlement associated with a
 * Journey Completion.
 *
 * Journey Settlement is a separate aggregate. The handler queries the
 * Journey Settlement repository directly.
 *
 * NestJS injects the repository through its registered repository token.
 */
@Injectable()
export class GetJourneySettlementByCompletionHandler implements QueryHandler<
  GetJourneySettlementByCompletionQuery,
  JourneySettlementEntity | null
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(JOURNEY_SETTLEMENT_TOKENS.REPOSITORY)
    private readonly repository: JourneySettlementRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetJourneySettlementByCompletionQuery,
  ): Promise<JourneySettlementEntity | null> {
    const completionPublicId = new JourneyCompletionPublicId(
      query.completionPublicId,
    );

    return this.repository.findJourneySettlementByCompletionPublicId(
      completionPublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneySettlementByCompletionHandler;
