// -----------------------------------------------------------------------------
// Get Journey Settlement Query Handler
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// 1. Receive a query containing a Journey Settlement public ID.
// 2. Construct the corresponding domain value object.
// 3. Retrieve the Journey Settlement aggregate through the repository.
//
// Architectural rules:
//
// - NestJS manages this handler through @Injectable().
// - The repository is injected using JOURNEY_SETTLEMENT_TOKENS.REPOSITORY.
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

import type { GetJourneySettlementQuery } from '../queries/get-journey-settlement.query';

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { JourneySettlementAggregate } from '../../domain/aggregates/journey-settlement.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneySettlementRepository } from '../../domain/repositories/journey-settlement.repository';

// -----------------------------------------------------------------------------
// Value Object
// -----------------------------------------------------------------------------

import { JourneySettlementPublicId } from '../../domain/value-objects/journey-settlement-public-id.vo';

// -----------------------------------------------------------------------------
// Dependency Injection Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_SETTLEMENT_TOKENS } from '../journey-settlement.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles retrieval of a Journey Settlement aggregate by public identity.
 *
 * NestJS injects the repository through the registered repository token.
 */
@Injectable()
export class GetJourneySettlementHandler implements QueryHandler<
  GetJourneySettlementQuery,
  JourneySettlementAggregate | null
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
    query: GetJourneySettlementQuery,
  ): Promise<JourneySettlementAggregate | null> {
    const journeySettlementPublicId = new JourneySettlementPublicId(
      query.journeySettlementPublicId,
    );

    return this.repository.findByPublicId(journeySettlementPublicId);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetJourneySettlementHandler;
