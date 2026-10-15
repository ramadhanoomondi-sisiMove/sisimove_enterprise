// -----------------------------------------------------------------------------
// List Journey Settlements Query Handler
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// 1. Retrieve Journey Settlement root entities.
// 2. Support optional filtering by journey, provider, and status.
// 3. Delegate supported filtering combinations to the repository.
//
// Architectural rules:
//
// - NestJS manages this handler through @Injectable().
// - The repository is injected using JOURNEY_SETTLEMENT_TOKENS.REPOSITORY.
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

import type { ListJourneySettlementsQuery } from '../queries/list-journey-settlements.query';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { JourneySettlementEntity } from '../../domain/entities/journey-settlement.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneySettlementRepository } from '../../domain/repositories/journey-settlement.repository';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { JourneyCompletionJourneyPublicId } from '../../domain/value-objects/journey-completion-journey-public-id.vo';

import { JourneyCompletionProviderPublicId } from '../../domain/value-objects/journey-completion-provider-public-id.vo';

import { JourneySettlementStatus } from '../../domain/value-objects/journey-settlement-status.vo';

// -----------------------------------------------------------------------------
// Dependency Injection Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_SETTLEMENT_TOKENS } from '../journey-settlement.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles listing Journey Settlement root entities.
 *
 * NestJS injects the repository through the registered repository token.
 *
 * The handler delegates supported filtering combinations to the existing
 * JourneySettlementRepository contract.
 */
@Injectable()
export class ListJourneySettlementsHandler implements QueryHandler<
  ListJourneySettlementsQuery,
  JourneySettlementEntity[]
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
    query: ListJourneySettlementsQuery,
  ): Promise<JourneySettlementEntity[]> {
    // -------------------------------------------------------------------------
    // No filters
    // -------------------------------------------------------------------------

    if (
      query.journeyPublicId === undefined &&
      query.providerPublicId === undefined &&
      query.status === undefined
    ) {
      return this.repository.findJourneySettlements();
    }

    // -------------------------------------------------------------------------
    // Convert filters
    // -------------------------------------------------------------------------

    const journeyPublicId =
      query.journeyPublicId !== undefined
        ? new JourneyCompletionJourneyPublicId(query.journeyPublicId)
        : undefined;

    const providerPublicId =
      query.providerPublicId !== undefined
        ? new JourneyCompletionProviderPublicId(query.providerPublicId)
        : undefined;

    const status =
      query.status !== undefined
        ? JourneySettlementStatus.create(query.status)
        : undefined;

    // -------------------------------------------------------------------------
    // Journey + status
    // -------------------------------------------------------------------------

    if (journeyPublicId !== undefined && status !== undefined) {
      return this.repository.findJourneySettlementsByJourneyAndStatus(
        journeyPublicId,
        status,
      );
    }

    // -------------------------------------------------------------------------
    // Provider + status
    // -------------------------------------------------------------------------

    if (providerPublicId !== undefined && status !== undefined) {
      return this.repository.findJourneySettlementsByProviderAndStatus(
        providerPublicId,
        status,
      );
    }

    // -------------------------------------------------------------------------
    // Journey only
    // -------------------------------------------------------------------------

    if (journeyPublicId !== undefined) {
      return this.repository.findJourneySettlementsByJourneyPublicId(
        journeyPublicId,
      );
    }

    // -------------------------------------------------------------------------
    // Provider only
    // -------------------------------------------------------------------------

    if (providerPublicId !== undefined) {
      return this.repository.findJourneySettlementsByProviderPublicId(
        providerPublicId,
      );
    }

    // -------------------------------------------------------------------------
    // Status only
    // -------------------------------------------------------------------------

    if (status !== undefined) {
      return this.repository.findJourneySettlementsByStatus(status);
    }

    // -------------------------------------------------------------------------
    // Defensive fallback
    // -------------------------------------------------------------------------

    return this.repository.findJourneySettlements();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ListJourneySettlementsHandler;
