// -----------------------------------------------------------------------------
// Financial Account Withdrawal — REST Response Mapper
// -----------------------------------------------------------------------------
//
// Maps Financial Account Withdrawal domain objects into REST response
// representations.
//
// Aggregate boundary:
//
// FinancialAccountWithdrawalAggregate
// └── FinancialAccountWithdrawalEntity
//
// IMPORTANT:
//
// Domain entities, aggregate roots, Entity IDs, and Value Objects are never
// exposed directly through the REST boundary.
//
// Value Objects are converted to primitive representations here.
//
// The withdrawal destination is represented by its immutable
// FinancialAccountWithdrawalDestination snapshot:
//
// - destinationType
// - destinationValue
//
// It is NOT represented by:
// - FinancialDisbursementDestinationPublicId;
// - FinancialDisbursementDestinationEntity;
// - a destination repository reference.
//
// The Financial Account aggregate is not traversed.
//
// Financial Disbursement references remain opaque public identifiers.
//
// No provider credentials, secrets, or internal persistence identifiers cross
// the REST boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { FinancialAccountWithdrawalAggregate } from '../../../domain/aggregates/financial-account-withdrawal.aggregate';

// -----------------------------------------------------------------------------
// Domain — Entity
// -----------------------------------------------------------------------------

import type { FinancialAccountWithdrawalEntity } from '../../../domain/entities/financial-account-withdrawal.entity';

// =============================================================================
// Response
// =============================================================================

/**
 * REST representation of a Financial Account Withdrawal.
 *
 * This is the public transport representation of a withdrawal request from
 * a Financial Account to an external destination.
 *
 * Internal Entity IDs and domain Value Objects are intentionally not exposed.
 */
export interface FinancialAccountWithdrawalResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the Financial Account Withdrawal.
   */
  publicId: string;

  // ===========================================================================
  // Owning Financial Account
  // ===========================================================================

  /**
   * Public identity of the owning Financial Account.
   *
   * The Financial Account aggregate itself is not embedded.
   */
  accountPublicId: string;

  // ===========================================================================
  // Withdrawal
  // ===========================================================================

  /**
   * Requested withdrawal amount.
   */
  amount: number;

  /**
   * Currency in which the withdrawal is denominated.
   */
  currency: string;

  // ===========================================================================
  // Destination Snapshot
  // ===========================================================================

  /**
   * Type of the external destination captured by the withdrawal.
   *
   * Examples:
   *
   * - MOBILE_MONEY
   * - BANK_ACCOUNT
   * - OTHER
   */
  destinationType: string;

  /**
   * External destination value captured by the withdrawal.
   *
   * This is the historical destination snapshot used by the withdrawal
   * workflow.
   */
  destinationValue: string;

  // ===========================================================================
  // Business Reference
  // ===========================================================================

  /**
   * Optional business reference type.
   */
  referenceType: string | undefined;

  /**
   * Optional public identifier of the originating business object.
   */
  referencePublicId: string | undefined;

  // ===========================================================================
  // Financial Disbursement
  // ===========================================================================

  /**
   * Public identity of the Financial Disbursement associated with this
   * withdrawal, when one exists.
   *
   * The Financial Disbursement aggregate itself is not embedded.
   */
  disbursementPublicId: string | undefined;

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  /**
   * Current lifecycle status of the withdrawal.
   */
  status: string;

  // ===========================================================================
  // Lifecycle Timestamps
  // ===========================================================================

  /**
   * Timestamp at which the withdrawal was requested.
   */
  requestedAt: Date;

  /**
   * Timestamp at which the withdrawal completed.
   */
  completedAt: Date | undefined;

  /**
   * Timestamp at which the withdrawal failed.
   */
  failedAt: Date | undefined;

  /**
   * Timestamp at which the withdrawal was cancelled.
   */
  cancelledAt: Date | undefined;

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Timestamp at which the withdrawal record was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the withdrawal record was last updated.
   */
  updatedAt: Date;
}

// =============================================================================
// Mapper
// =============================================================================

/**
 * Maps Financial Account Withdrawal domain objects into REST response
 * objects.
 *
 * Preferred usage:
 *
 *     FinancialAccountWithdrawalResponseMapper.toResponse(aggregate)
 *
 * The mapper also supports mapping entities directly for query workflows that
 * intentionally return entities rather than aggregate wrappers.
 */
export class FinancialAccountWithdrawalResponseMapper {
  // ===========================================================================
  // Aggregate
  // ===========================================================================

  /**
   * Maps a Financial Account Withdrawal aggregate into its REST response.
   */
  public static toResponse(
    aggregate: FinancialAccountWithdrawalAggregate,
  ): FinancialAccountWithdrawalResponse {
    return this.fromEntity(aggregate.withdrawal);
  }

  // ===========================================================================
  // Entity
  // ===========================================================================

  /**
   * Maps a Financial Account Withdrawal entity into its REST representation.
   *
   * Only safe primitive values cross the REST boundary.
   *
   * The destination is represented from the immutable snapshot owned by the
   * withdrawal.
   */
  public static fromEntity(
    withdrawal: FinancialAccountWithdrawalEntity,
  ): FinancialAccountWithdrawalResponse {
    const destination = withdrawal.destination;

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: withdrawal.publicId.value,

      // -----------------------------------------------------------------------
      // Owning Financial Account
      // -----------------------------------------------------------------------

      accountPublicId: withdrawal.accountPublicId.value,

      // -----------------------------------------------------------------------
      // Withdrawal
      // -----------------------------------------------------------------------

      amount: withdrawal.amountValue,

      currency: withdrawal.currency,

      // -----------------------------------------------------------------------
      // Destination Snapshot
      // -----------------------------------------------------------------------

      destinationType: destination.type,

      destinationValue: destination.value,

      // -----------------------------------------------------------------------
      // Business Reference
      // -----------------------------------------------------------------------

      referenceType: withdrawal.referenceType?.value,

      referencePublicId: withdrawal.referencePublicId?.value,

      // -----------------------------------------------------------------------
      // Financial Disbursement
      // -----------------------------------------------------------------------

      disbursementPublicId: withdrawal.disbursementPublicId,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: withdrawal.status.value,

      // -----------------------------------------------------------------------
      // Lifecycle Timestamps
      // -----------------------------------------------------------------------

      requestedAt: withdrawal.requestedAt,

      completedAt: withdrawal.completedAt,

      failedAt: withdrawal.failedAt,

      cancelledAt: withdrawal.cancelledAt,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: withdrawal.createdAt,

      updatedAt: withdrawal.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate Collection
  // ===========================================================================

  /**
   * Maps a collection of Financial Account Withdrawal aggregates.
   */
  public static fromAggregates(
    aggregates: readonly FinancialAccountWithdrawalAggregate[],
  ): FinancialAccountWithdrawalResponse[] {
    return aggregates.map((aggregate) => this.toResponse(aggregate));
  }

  // ===========================================================================
  // Entity Collection
  // ===========================================================================

  /**
   * Maps a collection of Financial Account Withdrawal entities.
   */
  public static fromEntities(
    withdrawals: readonly FinancialAccountWithdrawalEntity[],
  ): FinancialAccountWithdrawalResponse[] {
    return withdrawals.map((withdrawal) => this.fromEntity(withdrawal));
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialAccountWithdrawalResponseMapper;
