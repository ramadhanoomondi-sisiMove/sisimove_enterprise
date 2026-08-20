// -----------------------------------------------------------------------------
// Journey Completion — rest Response Mapper
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyCompletionAggregate } from '../../../domain/aggregates/journey-completion.aggregate';

import type { JourneyCompletionEntity } from '../../../domain/entities/journey-completion.entity';

import type { JourneyCompletionConfirmationEntity } from '../../../domain/entities/journey-completion-confirmation.entity';

import type { JourneyCompletionDisputeEntity } from '../../../domain/entities/journey-completion-dispute.entity';

// -----------------------------------------------------------------------------
// Response Types
// -----------------------------------------------------------------------------

/**
 * HTTP representation of a Journey Completion aggregate.
 *
 * Domain value objects are converted to primitives at the presentation
 * boundary. Internal UniqueEntityId values are never exposed directly.
 */
export interface JourneyCompletionResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  publicId: string;

  journeyPublicId: string;

  providerPublicId: string;

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  status: string;

  completionRequestedAt: Date | undefined;

  confirmedAt: Date | undefined;

  disputedAt: Date | undefined;

  cancelledAt: Date | undefined;

  requiredConfirmations: number;

  confirmedCount: number;

  version: number;

  // ===========================================================================
  // Confirmations
  // ===========================================================================

  confirmations: JourneyCompletionConfirmationResponse[];

  // ===========================================================================
  // Disputes
  // ===========================================================================

  disputes: JourneyCompletionDisputeResponse[];

  // ===========================================================================
  // Audit
  // ===========================================================================

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Confirmation Response
// -----------------------------------------------------------------------------

/**
 * HTTP representation of a Journey Completion confirmation.
 */
export interface JourneyCompletionConfirmationResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  publicId: string;

  completionId: string;

  memberPublicId: string;

  bookingPublicId: string | undefined;

  // ===========================================================================
  // Confirmation
  // ===========================================================================

  role: string;

  status: string;

  confirmedAt: Date;

  withdrawnAt: Date | undefined;

  // ===========================================================================
  // Audit
  // ===========================================================================

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Dispute Response
// -----------------------------------------------------------------------------

/**
 * HTTP representation of a Journey Completion dispute.
 */
export interface JourneyCompletionDisputeResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  publicId: string;

  completionId: string;

  raisedByPublicId: string;

  // ===========================================================================
  // Dispute
  // ===========================================================================

  reason: string;

  description: string | undefined;

  status: string;

  // ===========================================================================
  // Resolution
  // ===========================================================================

  resolvedByPublicId: string | undefined;

  resolutionSummary: string | undefined;

  openedAt: Date;

  resolvedAt: Date | undefined;

  rejectedAt: Date | undefined;

  withdrawnAt: Date | undefined;

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
 * Maps Journey Completion domain objects into HTTP response objects.
 *
 * JourneyCompletionEntity owns only the root completion state.
 *
 * Confirmations and disputes are aggregate-owned child entities and are
 * therefore mapped from JourneyCompletionAggregate when a complete aggregate
 * representation is required.
 */
export class JourneyCompletionResponseMapper {
  // ===========================================================================
  // Aggregate
  // ===========================================================================

  /**
   * Maps a fully rehydrated Journey Completion aggregate.
   */
  public static toResponse(
    aggregate: JourneyCompletionAggregate,
  ): JourneyCompletionResponse {
    return this.fromEntity(
      aggregate.journeyCompletion,
      aggregate.confirmations,
      aggregate.disputes,
    );
  }

  // ===========================================================================
  // Entity
  // ===========================================================================

  /**
   * Maps the Journey Completion root entity.
   *
   * Confirmations and disputes are supplied separately because they belong to
   * the aggregate boundary rather than the root entity itself.
   */
  public static fromEntity(
    completion: JourneyCompletionEntity,
    confirmations: readonly JourneyCompletionConfirmationEntity[] = [],
    disputes: readonly JourneyCompletionDisputeEntity[] = [],
  ): JourneyCompletionResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: completion.publicId.value,

      journeyPublicId: completion.journeyPublicId.value,

      providerPublicId: completion.providerPublicId.value,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: completion.status.value,

      completionRequestedAt: completion.completionRequestedAt,

      confirmedAt: completion.confirmedAt,

      disputedAt: completion.disputedAt,

      cancelledAt: completion.cancelledAt,

      requiredConfirmations: completion.requiredConfirmations,

      confirmedCount: completion.confirmedCount,

      version: completion.version,

      // -----------------------------------------------------------------------
      // Confirmations
      // -----------------------------------------------------------------------

      confirmations: this.mapConfirmations(confirmations),

      // -----------------------------------------------------------------------
      // Disputes
      // -----------------------------------------------------------------------

      disputes: this.mapDisputes(disputes),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: completion.createdAt,

      updatedAt: completion.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate Collection
  // ===========================================================================

  /**
   * Maps a collection of Journey Completion aggregates.
   */
  public static fromAggregates(
    aggregates: readonly JourneyCompletionAggregate[],
  ): JourneyCompletionResponse[] {
    return aggregates.map((aggregate) => this.toResponse(aggregate));
  }

  // ===========================================================================
  // Entity Collection
  // ===========================================================================

  /**
   * Maps a collection of Journey Completion root entities.
   *
   * Child collections remain empty because root entities do not own them
   * directly.
   */
  public static fromEntities(
    completions: readonly JourneyCompletionEntity[],
  ): JourneyCompletionResponse[] {
    return completions.map((completion) => this.fromEntity(completion));
  }

  // ===========================================================================
  // Confirmation Collection
  // ===========================================================================

  private static mapConfirmations(
    confirmations: readonly JourneyCompletionConfirmationEntity[],
  ): JourneyCompletionConfirmationResponse[] {
    return confirmations.map((confirmation) =>
      this.mapConfirmation(confirmation),
    );
  }

  // ===========================================================================
  // Confirmation
  // ===========================================================================

  private static mapConfirmation(
    confirmation: JourneyCompletionConfirmationEntity,
  ): JourneyCompletionConfirmationResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: confirmation.publicId.value,

      completionId: confirmation.completionId.value,

      memberPublicId: confirmation.memberPublicId.value,

      bookingPublicId: confirmation.bookingPublicId?.value,

      // -----------------------------------------------------------------------
      // Confirmation
      // -----------------------------------------------------------------------

      role: confirmation.role.value,

      status: confirmation.status.value,

      confirmedAt: confirmation.confirmedAt,

      withdrawnAt: confirmation.withdrawnAt,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: confirmation.createdAt,

      updatedAt: confirmation.updatedAt,
    };
  }

  // ===========================================================================
  // Dispute Collection
  // ===========================================================================

  private static mapDisputes(
    disputes: readonly JourneyCompletionDisputeEntity[],
  ): JourneyCompletionDisputeResponse[] {
    return disputes.map((dispute) => this.mapDispute(dispute));
  }

  // ===========================================================================
  // Dispute
  // ===========================================================================

  private static mapDispute(
    dispute: JourneyCompletionDisputeEntity,
  ): JourneyCompletionDisputeResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: dispute.publicId.value,

      completionId: dispute.completionId.value,

      raisedByPublicId: dispute.raisedByPublicId.value,

      // -----------------------------------------------------------------------
      // Dispute
      // -----------------------------------------------------------------------

      reason: dispute.reason.value,

      description: dispute.description?.value,

      status: dispute.status.value,

      // -----------------------------------------------------------------------
      // Resolution
      // -----------------------------------------------------------------------

      resolvedByPublicId: dispute.resolvedByPublicId?.value,

      resolutionSummary: dispute.resolutionSummary?.value,

      openedAt: dispute.openedAt,

      resolvedAt: dispute.resolvedAt,

      rejectedAt: dispute.rejectedAt,

      withdrawnAt: dispute.withdrawnAt,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: dispute.createdAt,

      updatedAt: dispute.updatedAt,
    };
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default JourneyCompletionResponseMapper;
