// -----------------------------------------------------------------------------
// Financial Disbursement — REST Response Mapper
// -----------------------------------------------------------------------------
//
// Maps Financial Disbursement domain objects into REST response
// representations.
//
// Aggregate boundary:
//
// FinancialDisbursementAggregate
// └── FinancialDisbursementEntity
//     └── FinancialDisbursementAttemptEntity[]
//
// Destination:
//
// The disbursement owns an immutable withdrawal destination snapshot
// (type + value). It does not depend on a separately configured destination.
//
// FinancialDisbursementDestinationEntity remains a separate saved-destination
// feature and is mapped independently by the destination-specific methods.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { FinancialDisbursementAggregate } from '../../../domain/aggregates/financial-disbursement.aggregate';

// -----------------------------------------------------------------------------
// Domain — Entities
// -----------------------------------------------------------------------------

import type { FinancialDisbursementEntity } from '../../../domain/entities/financial-disbursement.entity';

import type { FinancialDisbursementAttemptEntity } from '../../../domain/entities/financial-disbursement-attempt.entity';

import type { FinancialDisbursementDestinationEntity } from '../../../domain/entities/financial-disbursement-destination.entity';

// -----------------------------------------------------------------------------
// Response Types
// -----------------------------------------------------------------------------

/**
 * REST representation of a Financial Disbursement Attempt.
 */
export interface FinancialDisbursementAttemptResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  publicId: string;

  // ===========================================================================
  // Provider
  // ===========================================================================

  provider: string;

  providerReference: string | undefined;

  // ===========================================================================
  // Amount
  // ===========================================================================

  amount: number;

  currency: string;

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  status: string;

  // ===========================================================================
  // Failure
  // ===========================================================================

  failureCode: string | undefined;

  failureMessage: string | undefined;

  // ===========================================================================
  // Lifecycle Timestamps
  // ===========================================================================

  startedAt: Date | undefined;

  completedAt: Date | undefined;

  failedAt: Date | undefined;

  // ===========================================================================
  // Audit
  // ===========================================================================

  createdAt: Date;

  updatedAt: Date;
}

/**
 * REST representation of a Financial Disbursement Destination.
 *
 * Only safe/public information is exposed.
 *
 * Internal account identity and authoritative provider reference are omitted.
 */
export interface FinancialDisbursementDestinationResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the destination.
   */
  publicId: string;

  // ===========================================================================
  // Destination
  // ===========================================================================

  /**
   * Destination type.
   */
  type: string;

  /**
   * Financial provider associated with the destination.
   */
  provider: string;

  /**
   * Presentation-safe destination name.
   */
  displayName: string | undefined;

  /**
   * Presentation-safe masked destination reference.
   */
  maskedReference: string | undefined;

  /**
   * Whether this is the account's default destination.
   */
  isDefault: boolean;

  /**
   * Whether this destination is active.
   */
  isActive: boolean;
}

/**
 * REST representation of the immutable destination supplied for a withdrawal.
 *
 * This is the destination snapshot stored on the disbursement, not a reference
 * to a configured FinancialDisbursementDestinationEntity.
 */
export interface FinancialDisbursementWithdrawalDestinationResponse {
  type: string;

  value: string;
}

/**
 * REST representation of a Financial Disbursement.
 */
export interface FinancialDisbursementResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  publicId: string;

  // ===========================================================================
  // Source Financial Account
  // ===========================================================================

  sourceAccountPublicId: string;

  // ===========================================================================
  // Originating Financial Account Withdrawal
  // ===========================================================================

  /**
   * Public identity of the Financial Account Withdrawal that originated
   * this disbursement.
   *
   * Optional because a disbursement may also be created independently of
   * the Financial Account Withdrawal workflow.
   */
  withdrawalPublicId: string | undefined;

  // ===========================================================================
  // Destination
  // ===========================================================================

  /**
   * Immutable destination details supplied when the withdrawal was requested.
   */
  destination: FinancialDisbursementWithdrawalDestinationResponse;

  // ===========================================================================
  // Disbursement
  // ===========================================================================

  amount: number;

  currency: string;

  // ===========================================================================
  // Business Reference
  // ===========================================================================

  referenceType: string | undefined;

  referencePublicId: string | undefined;

  // ===========================================================================
  // Financial Transaction
  // ===========================================================================

  transactionPublicId: string | undefined;

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  status: string;

  // ===========================================================================
  // Attempts
  // ===========================================================================

  attempts: FinancialDisbursementAttemptResponse[];

  // ===========================================================================
  // Lifecycle Timestamps
  // ===========================================================================

  requestedAt: Date;

  completedAt: Date | undefined;

  failedAt: Date | undefined;

  cancelledAt: Date | undefined;

  // ===========================================================================
  // Audit
  // ===========================================================================

  createdAt: Date;

  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class FinancialDisbursementResponseMapper {
  // ===========================================================================
  // Aggregate
  // ===========================================================================

  /**
   * Maps a Financial Disbursement aggregate.
   *
   * The immutable withdrawal destination is owned by the disbursement entity;
   * no configured destination lookup is required.
   */
  public static toResponse(
    aggregate: FinancialDisbursementAggregate,
  ): FinancialDisbursementResponse {
    return this.fromEntity(aggregate.disbursement);
  }

  // ===========================================================================
  // Entity
  // ===========================================================================

  /**
   * Maps a Financial Disbursement entity and its immutable destination
   * snapshot.
   */
  public static fromEntity(
    disbursement: FinancialDisbursementEntity,
  ): FinancialDisbursementResponse {
    // -------------------------------------------------------------------------
    // Response
    // -------------------------------------------------------------------------

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: disbursement.publicId.value,

      // -----------------------------------------------------------------------
      // Source Financial Account
      // -----------------------------------------------------------------------

      sourceAccountPublicId: disbursement.sourceAccountPublicId.value,

      // -----------------------------------------------------------------------
      // Originating Financial Account Withdrawal
      // -----------------------------------------------------------------------

      withdrawalPublicId: disbursement.withdrawalPublicId,

      // -----------------------------------------------------------------------
      // Destination
      // -----------------------------------------------------------------------

      destination: {
        type: disbursement.destinationType,
        value: disbursement.destinationValue,
      },

      // -----------------------------------------------------------------------
      // Disbursement
      // -----------------------------------------------------------------------

      amount: disbursement.amount.amount,

      currency: disbursement.amount.currency.value,

      // -----------------------------------------------------------------------
      // Business Reference
      // -----------------------------------------------------------------------

      referenceType: disbursement.referenceType?.value,

      referencePublicId: disbursement.referencePublicId?.value,

      // -----------------------------------------------------------------------
      // Financial Transaction
      // -----------------------------------------------------------------------

      transactionPublicId: disbursement.transactionPublicId?.value,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: disbursement.status.value,

      // -----------------------------------------------------------------------
      // Attempts
      // -----------------------------------------------------------------------

      attempts: this.fromAttempts(disbursement.attempts),

      // -----------------------------------------------------------------------
      // Lifecycle Timestamps
      // -----------------------------------------------------------------------

      requestedAt: disbursement.requestedAt,

      completedAt: disbursement.completedAt,

      failedAt: disbursement.failedAt,

      cancelledAt: disbursement.cancelledAt,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: disbursement.createdAt,

      updatedAt: disbursement.updatedAt,
    };
  }

  // ===========================================================================
  // Destination
  // ===========================================================================

  /**
   * Maps a Financial Disbursement Destination entity into its safe REST
   * representation.
   *
   * IMPORTANT:
   *
   * The authoritative providerReference is intentionally NOT exposed.
   *
   * Only the safe maskedReference is returned.
   */
  public static fromDestination(
    destination: FinancialDisbursementDestinationEntity,
  ): FinancialDisbursementDestinationResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: destination.publicId.value,

      // -----------------------------------------------------------------------
      // Destination
      // -----------------------------------------------------------------------

      type: destination.type.value,

      provider: destination.provider.value,

      // -----------------------------------------------------------------------
      // Safe Presentation
      // -----------------------------------------------------------------------

      displayName: destination.displayName,

      maskedReference: destination.maskedReference,

      // -----------------------------------------------------------------------
      // State
      // -----------------------------------------------------------------------

      isDefault: destination.isDefault,

      isActive: destination.isActive,
    };
  }

  // ===========================================================================
  // Attempt
  // ===========================================================================

  /**
   * Maps a Financial Disbursement Attempt child entity.
   */
  public static fromAttempt(
    attempt: FinancialDisbursementAttemptEntity,
  ): FinancialDisbursementAttemptResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: attempt.publicId.value,

      // -----------------------------------------------------------------------
      // Provider
      // -----------------------------------------------------------------------

      provider: attempt.provider.value,

      providerReference: attempt.providerReference?.value,

      // -----------------------------------------------------------------------
      // Amount
      // -----------------------------------------------------------------------

      amount: attempt.amount.amount,

      currency: attempt.amount.currency.value,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: attempt.status.value,

      // -----------------------------------------------------------------------
      // Failure
      // -----------------------------------------------------------------------

      failureCode: attempt.failureCode,

      failureMessage: attempt.failureMessage,

      // -----------------------------------------------------------------------
      // Lifecycle Timestamps
      // -----------------------------------------------------------------------

      startedAt: attempt.startedAt,

      completedAt: attempt.completedAt,

      failedAt: attempt.failedAt,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: attempt.createdAt,

      updatedAt: attempt.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate Collection
  // ===========================================================================

  /**
   * Maps Financial Disbursement aggregates without resolving configured
   * destination entities.
   */
  public static fromAggregates(
    aggregates: readonly FinancialDisbursementAggregate[],
  ): FinancialDisbursementResponse[] {
    return aggregates.map((aggregate) => this.toResponse(aggregate));
  }

  // ===========================================================================
  // Entity Collection
  // ===========================================================================

  /**
   * Maps Financial Disbursement entities using their stored destination
   * snapshots.
   */
  public static fromEntities(
    disbursements: readonly FinancialDisbursementEntity[],
  ): FinancialDisbursementResponse[] {
    return disbursements.map((disbursement) => this.fromEntity(disbursement));
  }

  // ===========================================================================
  // Destination Collection
  // ===========================================================================

  /**
   * Maps Financial Disbursement Destination entities.
   */
  public static fromDestinations(
    destinations: readonly FinancialDisbursementDestinationEntity[],
  ): FinancialDisbursementDestinationResponse[] {
    return destinations.map((destination) => this.fromDestination(destination));
  }

  // ===========================================================================
  // Attempt Collection
  // ===========================================================================

  /**
   * Maps Financial Disbursement Attempt entities.
   */
  public static fromAttempts(
    attempts: readonly FinancialDisbursementAttemptEntity[],
  ): FinancialDisbursementAttemptResponse[] {
    return attempts.map((attempt) => this.fromAttempt(attempt));
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialDisbursementResponseMapper;
