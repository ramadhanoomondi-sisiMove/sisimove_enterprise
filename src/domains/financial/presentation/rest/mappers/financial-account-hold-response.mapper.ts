// -----------------------------------------------------------------------------
// Financial Account Hold — REST Response Mapper
// -----------------------------------------------------------------------------
//
// Maps Financial Account Hold domain objects into REST response
// representations.
//
// Aggregate boundary:
//
// FinancialAccountHoldAggregate
// └── FinancialAccountHoldEntity
//
// IMPORTANT:
//
// Domain entities, aggregate roots, Entity IDs, and Value Objects are never
// exposed directly through the REST boundary.
//
// Value Objects are converted to their primitive representations here.
//
// Financial Account is represented only through its public identifier.
// The Financial Account aggregate is NOT traversed.
//
// Financial Transactions are represented only through their opaque public
// identifiers. The Financial Transaction aggregates are NOT traversed.
//
// Internal Financial Account IDs and other persistence-oriented identifiers
// must never cross the REST boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { FinancialAccountHoldAggregate } from '../../../domain/aggregates/financial-account-hold.aggregate';

// -----------------------------------------------------------------------------
// Domain — Entity
// -----------------------------------------------------------------------------

import type { FinancialAccountHoldEntity } from '../../../domain/entities/financial-account-hold.entity';

// -----------------------------------------------------------------------------
// Response Types
// -----------------------------------------------------------------------------

/**
 * REST representation of a Financial Account Hold aggregate.
 *
 * The response exposes the public representation of the hold while keeping
 * domain Value Objects and internal Entity IDs inside the domain boundary.
 *
 * Financial Account and Financial Transaction aggregates are intentionally
 * not embedded.
 */
export interface FinancialAccountHoldResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the Financial Account Hold.
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
  // Held Funds
  // ===========================================================================

  /**
   * Amount currently represented by the hold.
   *
   * Expressed in the smallest monetary unit supported by the Financial
   * domain.
   */
  amount: number;

  /**
   * Currency of the held funds.
   */
  currency: string;

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  /**
   * Current lifecycle status of the hold.
   *
   * Possible values:
   *
   * - ACTIVE
   * - RELEASED
   * - CAPTURED
   * - CANCELLED
   */
  status: string;

  /**
   * Whether the hold is currently ACTIVE.
   *
   * This reflects lifecycle status only and does not independently determine
   * whether an expiry has passed.
   */
  isActive: boolean;

  /**
   * Whether the hold has been RELEASED.
   */
  isReleased: boolean;

  /**
   * Whether the hold has been CAPTURED.
   */
  isCaptured: boolean;

  /**
   * Whether the hold has been CANCELLED.
   */
  isCancelled: boolean;

  /**
   * Whether the hold is in a terminal lifecycle state.
   */
  isTerminal: boolean;

  // ===========================================================================
  // Business Reference
  // ===========================================================================

  /**
   * Optional type of the business object that caused the hold.
   *
   * Examples:
   *
   * - JOURNEY_BOOKING
   * - JOURNEY_COMPLETION
   * - COMMERCIAL_BOOKING
   */
  referenceType: string | undefined;

  /**
   * Optional public identifier of the business object that caused the hold.
   */
  referencePublicId: string | undefined;

  // ===========================================================================
  // Expiry
  // ===========================================================================

  /**
   * Optional point in time at which the hold expires.
   */
  expiresAt: Date | undefined;

  /**
   * Whether an expiry has been configured for the hold.
   */
  hasExpiry: boolean;

  /**
   * Whether the hold has expired at the time of mapping.
   *
   * This is useful for presentation purposes and does not mutate the
   * aggregate lifecycle.
   */
  isExpired: boolean;

  /**
   * Whether the hold is currently usable according to its lifecycle status
   * and expiry.
   */
  isCurrentlyActive: boolean;

  // ===========================================================================
  // Financial Transaction References
  // ===========================================================================

  /**
   * Public identity of the Financial HOLD transaction that established
   * the reservation.
   */
  holdTransactionPublicId: string | undefined;

  /**
   * Public identity of the Financial RELEASE transaction associated with
   * resolving the reservation.
   *
   * This may be present for:
   *
   * - RELEASED holds;
   * - CANCELLED holds.
   */
  releaseTransactionPublicId: string | undefined;

  /**
   * Public identity of the Financial CAPTURE transaction that resolved
   * the reservation.
   */
  captureTransactionPublicId: string | undefined;

  // ===========================================================================
  // Lifecycle Audit
  // ===========================================================================

  /**
   * Timestamp at which the hold entered RELEASED state.
   */
  releasedAt: Date | undefined;

  /**
   * Timestamp at which the hold entered CAPTURED state.
   */
  capturedAt: Date | undefined;

  /**
   * Timestamp at which the hold entered CANCELLED state.
   */
  cancelledAt: Date | undefined;

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Timestamp at which the hold was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the hold was last updated.
   */
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps Financial Account Hold domain objects into REST response objects.
 *
 * Preferred usage:
 *
 *     FinancialAccountHoldResponseMapper.toResponse(aggregate)
 *
 * for complete Financial Account Hold aggregate responses.
 *
 * The mapper also supports mapping the root entity independently when a
 * query explicitly returns the entity rather than the aggregate.
 */
export class FinancialAccountHoldResponseMapper {
  // ===========================================================================
  // Aggregate
  // ===========================================================================

  /**
   * Maps a fully rehydrated Financial Account Hold aggregate.
   *
   * This is the preferred mapping method for REST responses because the
   * aggregate represents the application's domain boundary.
   */
  public static toResponse(
    aggregate: FinancialAccountHoldAggregate,
  ): FinancialAccountHoldResponse {
    return this.fromEntity(aggregate.hold);
  }

  // ===========================================================================
  // Entity
  // ===========================================================================

  /**
   * Maps a Financial Account Hold entity into its REST representation.
   *
   * Only primitive, transport-safe values are exposed.
   *
   * Internal Entity IDs and Value Objects never cross the REST boundary.
   */
  public static fromEntity(
    hold: FinancialAccountHoldEntity,
  ): FinancialAccountHoldResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: hold.publicId.value,

      // -----------------------------------------------------------------------
      // Owning Financial Account
      // -----------------------------------------------------------------------
      //
      // IMPORTANT:
      //
      // accountId is intentionally NOT exposed.
      //
      // The REST boundary uses the stable public Financial Account identifier.
      //

      accountPublicId: hold.accountPublicId.value,

      // -----------------------------------------------------------------------
      // Held Funds
      // -----------------------------------------------------------------------

      amount: hold.amount.value,

      currency: hold.currency,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: hold.status.value,

      isActive: hold.isActive(),

      isReleased: hold.isReleased(),

      isCaptured: hold.isCaptured(),

      isCancelled: hold.isCancelled(),

      isTerminal: hold.isTerminal(),

      // -----------------------------------------------------------------------
      // Business Reference
      // -----------------------------------------------------------------------

      referenceType: hold.reference?.type,

      referencePublicId: hold.reference?.publicId,

      // -----------------------------------------------------------------------
      // Expiry
      // -----------------------------------------------------------------------

      expiresAt: hold.expiresAt?.value,

      hasExpiry: hold.hasExpiry(),

      isExpired: hold.isExpired(),

      isCurrentlyActive: hold.isCurrentlyActive(),

      // -----------------------------------------------------------------------
      // Financial Transaction References
      // -----------------------------------------------------------------------

      holdTransactionPublicId: hold.holdTransactionPublicId,

      releaseTransactionPublicId: hold.releaseTransactionPublicId,

      captureTransactionPublicId: hold.captureTransactionPublicId,

      // -----------------------------------------------------------------------
      // Lifecycle Audit
      // -----------------------------------------------------------------------

      releasedAt: hold.releasedAt,

      capturedAt: hold.capturedAt,

      cancelledAt: hold.cancelledAt,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: hold.createdAt,

      updatedAt: hold.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate Collection
  // ===========================================================================

  /**
   * Maps a collection of Financial Account Hold aggregates.
   *
   * Useful for list/query responses such as:
   *
   *     GET /financial-accounts/:accountPublicId/holds
   */
  public static fromAggregates(
    aggregates: readonly FinancialAccountHoldAggregate[],
  ): FinancialAccountHoldResponse[] {
    return aggregates.map((aggregate) => this.toResponse(aggregate));
  }

  // ===========================================================================
  // Entity Collection
  // ===========================================================================

  /**
   * Maps a collection of Financial Account Hold entities.
   *
   * Useful when an application query intentionally returns hold entities
   * without wrapping them in aggregates.
   */
  public static fromEntities(
    holds: readonly FinancialAccountHoldEntity[],
  ): FinancialAccountHoldResponse[] {
    return holds.map((hold) => this.fromEntity(hold));
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialAccountHoldResponseMapper;
