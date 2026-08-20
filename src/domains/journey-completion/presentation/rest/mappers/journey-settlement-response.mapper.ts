// -----------------------------------------------------------------------------
// Journey Settlement — rest Response Mapper
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneySettlementAggregate } from '../../../domain/aggregates/journey-settlement.aggregate';

import type { JourneySettlementEntity } from '../../../domain/entities/journey-settlement.entity';

// -----------------------------------------------------------------------------
// Response Types
// -----------------------------------------------------------------------------

/**
 * HTTP representation of a Journey Settlement aggregate.
 *
 * Domain value objects and internal identifiers are converted to transport
 * primitives at the presentation boundary.
 */
export interface JourneySettlementResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  publicId: string;

  completionId: string;

  journeyPublicId: string;

  providerPublicId: string;

  // ===========================================================================
  // Financial Reference
  // ===========================================================================

  financialTransactionPublicId: string | undefined;

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  status: string;

  submittedAt: Date | undefined;

  processingAt: Date | undefined;

  completedAt: Date | undefined;

  failedAt: Date | undefined;

  heldAt: Date | undefined;

  cancelledAt: Date | undefined;

  failureReason: string | undefined;

  version: number;

  // ===========================================================================
  // Audit
  // ===========================================================================

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps Journey Settlement domain objects into HTTP response objects.
 *
 * Journey Settlement is a separate aggregate consisting only of its root
 * JourneySettlementEntity.
 */
export class JourneySettlementResponseMapper {
  // ===========================================================================
  // Aggregate
  // ===========================================================================

  /**
   * Maps a fully rehydrated Journey Settlement aggregate.
   */
  public static toResponse(
    aggregate: JourneySettlementAggregate,
  ): JourneySettlementResponse {
    return this.fromEntity(aggregate.journeySettlement);
  }

  // ===========================================================================
  // Entity
  // ===========================================================================

  /**
   * Maps a Journey Settlement root entity.
   */
  public static fromEntity(
    settlement: JourneySettlementEntity,
  ): JourneySettlementResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: settlement.publicId.value,

      completionId: settlement.completionId.toString(),

      journeyPublicId: settlement.journeyPublicId.value,

      providerPublicId: settlement.providerPublicId.value,

      // -----------------------------------------------------------------------
      // Financial Reference
      // -----------------------------------------------------------------------

      financialTransactionPublicId:
        settlement.financialTransactionPublicId?.value,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: settlement.status.value,

      submittedAt: settlement.submittedAt,

      processingAt: settlement.processingAt,

      completedAt: settlement.completedAt,

      failedAt: settlement.failedAt,

      heldAt: settlement.heldAt,

      cancelledAt: settlement.cancelledAt,

      failureReason: settlement.failureReason?.value,

      version: settlement.version,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: settlement.createdAt,

      updatedAt: settlement.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate Collection
  // ===========================================================================

  /**
   * Maps a collection of Journey Settlement aggregates.
   */
  public static fromAggregates(
    aggregates: readonly JourneySettlementAggregate[],
  ): JourneySettlementResponse[] {
    return aggregates.map((aggregate) => this.toResponse(aggregate));
  }

  // ===========================================================================
  // Entity Collection
  // ===========================================================================

  /**
   * Maps a collection of Journey Settlement root entities.
   */
  public static fromEntities(
    settlements: readonly JourneySettlementEntity[],
  ): JourneySettlementResponse[] {
    return settlements.map((settlement) => this.fromEntity(settlement));
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneySettlementResponseMapper;
