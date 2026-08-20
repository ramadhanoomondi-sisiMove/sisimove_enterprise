// -----------------------------------------------------------------------------
// List Journey Settlements Query Handler
// -----------------------------------------------------------------------------

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
// Handler
// -----------------------------------------------------------------------------

/**
 * Handles listing Journey Settlement root entities.
 *
 * Repository access is supplied explicitly. No NestJS dependency injection
 * is used inside the handler.
 *
 * The handler delegates supported filtering combinations directly to the
 * JourneySettlementRepository contract.
 */
export class ListJourneySettlementsHandler implements QueryHandler<
  ListJourneySettlementsQuery,
  JourneySettlementEntity[]
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
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
      return await this.repository.findJourneySettlements();
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
      return await this.repository.findJourneySettlementsByJourneyAndStatus(
        journeyPublicId,
        status,
      );
    }

    // -------------------------------------------------------------------------
    // Provider + status
    // -------------------------------------------------------------------------

    if (providerPublicId !== undefined && status !== undefined) {
      return await this.repository.findJourneySettlementsByProviderAndStatus(
        providerPublicId,
        status,
      );
    }

    // -------------------------------------------------------------------------
    // Journey only
    // -------------------------------------------------------------------------

    if (journeyPublicId !== undefined) {
      return await this.repository.findJourneySettlementsByJourneyPublicId(
        journeyPublicId,
      );
    }

    // -------------------------------------------------------------------------
    // Provider only
    // -------------------------------------------------------------------------

    if (providerPublicId !== undefined) {
      return await this.repository.findJourneySettlementsByProviderPublicId(
        providerPublicId,
      );
    }

    // -------------------------------------------------------------------------
    // Status only
    // -------------------------------------------------------------------------

    if (status !== undefined) {
      return await this.repository.findJourneySettlementsByStatus(status);
    }

    // -------------------------------------------------------------------------
    // Defensive fallback
    // -------------------------------------------------------------------------

    return await this.repository.findJourneySettlements();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ListJourneySettlementsHandler;
