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
// External entity:
//
// FinancialDisbursementDestinationEntity
//
// IMPORTANT:
//
// FinancialDisbursementDestinationEntity is NOT owned by the
// FinancialDisbursementAggregate.
//
// The application/query layer resolves the destination entity and supplies it
// to this mapper.
//
// The mapper exposes only the destination's PUBLIC identity and safe
// presentation information.
//
// Internal destination/account identities and sensitive provider references
// are never exposed.
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
  // Destination
  // ===========================================================================

  /**
   * Public representation of the destination.
   *
   * The destination itself belongs to a separate boundary and is therefore
   * represented as a safe nested response.
   */
  destination: FinancialDisbursementDestinationResponse;

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
   * Maps a Financial Disbursement aggregate together with its independently
   * resolved Financial Disbursement Destination.
   *
   * The destination is intentionally supplied by the application/query layer
   * because it is outside the Financial Disbursement aggregate boundary.
   */
  public static toResponse(
    aggregate: FinancialDisbursementAggregate,
    destination: FinancialDisbursementDestinationEntity,
  ): FinancialDisbursementResponse {
    return this.fromEntity(aggregate.disbursement, destination);
  }

  // ===========================================================================
  // Entity
  // ===========================================================================

  /**
   * Maps a Financial Disbursement entity together with its independently
   * resolved destination entity.
   */
  public static fromEntity(
    disbursement: FinancialDisbursementEntity,
    destination: FinancialDisbursementDestinationEntity,
  ): FinancialDisbursementResponse {
    // -------------------------------------------------------------------------
    // Destination Ownership Invariant
    // -------------------------------------------------------------------------

    if (!destination.id.equals(disbursement.destinationId)) {
      throw new Error(
        'Financial Disbursement Destination does not match the Financial Disbursement destination identity',
      );
    }

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
      // Destination
      // -----------------------------------------------------------------------

      destination: this.fromDestination(destination),

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
   * Maps Financial Disbursement aggregates together with their independently
   * resolved destinations.
   *
   * The destination collection corresponds positionally with the aggregate
   * collection.
   */
  public static fromAggregates(
    aggregates: readonly FinancialDisbursementAggregate[],
    destinations: readonly FinancialDisbursementDestinationEntity[],
  ): FinancialDisbursementResponse[] {
    if (aggregates.length !== destinations.length) {
      throw new Error(
        'Financial Disbursement aggregate and destination collections must have equal lengths',
      );
    }

    return aggregates.map((aggregate, index) => {
      const destination = destinations[index];

      if (destination === undefined) {
        throw new Error(
          `Financial Disbursement Destination is missing at index ${index}`,
        );
      }

      return this.toResponse(aggregate, destination);
    });
  }

  // ===========================================================================
  // Entity Collection
  // ===========================================================================

  /**
   * Maps Financial Disbursement entities together with their independently
   * resolved destinations.
   */
  public static fromEntities(
    disbursements: readonly FinancialDisbursementEntity[],
    destinations: readonly FinancialDisbursementDestinationEntity[],
  ): FinancialDisbursementResponse[] {
    if (disbursements.length !== destinations.length) {
      throw new Error(
        'Financial Disbursement entity and destination collections must have equal lengths',
      );
    }

    return disbursements.map((disbursement, index) => {
      const destination = destinations[index];

      if (destination === undefined) {
        throw new Error(
          `Financial Disbursement Destination is missing at index ${index}`,
        );
      }

      return this.fromEntity(disbursement, destination);
    });
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
