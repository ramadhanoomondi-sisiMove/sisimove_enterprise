// -----------------------------------------------------------------------------
// Financial Payment Method — REST Response Mapper
// -----------------------------------------------------------------------------
//
// Maps Financial Payment Method domain objects into REST response
// representations.
//
// Aggregate boundary:
//
// FinancialPaymentMethodAggregate
// └── FinancialPaymentMethodEntity
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
// Provider references are exposed only through their opaque domain
// representation. Raw payment credentials must never cross this boundary.
//
// Safe display metadata such as displayName and lastFour may be returned.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import type { FinancialPaymentMethodAggregate } from '../../../domain/aggregates/financial-payment-method.aggregate';

// -----------------------------------------------------------------------------
// Domain — Entity
// -----------------------------------------------------------------------------

import type { FinancialPaymentMethodEntity } from '../../../domain/entities/financial-payment-method.entity';

// -----------------------------------------------------------------------------
// Response Types
// -----------------------------------------------------------------------------

/**
 * REST representation of a Financial Payment Method aggregate.
 *
 * This is the public transport representation of a registered external
 * funding instrument.
 *
 * The response intentionally contains only safe payment-method metadata.
 *
 * No raw credentials, secrets, tokens, PANs, CVVs, or provider authentication
 * material are exposed.
 */
export interface FinancialPaymentMethodResponse {
  // ===========================================================================
  // Identity
  // ===========================================================================

  /**
   * Public identity of the Financial Payment Method.
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
  // Payment Method
  // ===========================================================================

  /**
   * Type of payment method.
   */
  type: string;

  /**
   * External financial provider.
   */
  provider: string;

  /**
   * Opaque provider-issued reference.
   *
   * This is safe to expose only because the domain guarantees that it is an
   * external reference rather than raw payment credentials.
   */
  providerReference: string | undefined;

  /**
   * Safe human-readable display label.
   */
  displayName: string | undefined;

  /**
   * Last four characters of the masked payment instrument identifier.
   */
  lastFour: string | undefined;

  // ===========================================================================
  // Lifecycle
  // ===========================================================================

  /**
   * Whether this payment method is the default method for its account.
   */
  isDefault: boolean;

  /**
   * Whether this payment method is active and usable.
   */
  isActive: boolean;

  // ===========================================================================
  // Audit
  // ===========================================================================

  /**
   * Timestamp at which the payment method was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the payment method was last updated.
   */
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

/**
 * Maps Financial Payment Method domain objects into REST response objects.
 *
 * Preferred usage:
 *
 *     FinancialPaymentMethodResponseMapper.toResponse(aggregate)
 *
 * for complete Financial Payment Method aggregate responses.
 *
 * The mapper also supports mapping the root entity independently when a
 * query explicitly returns the entity rather than the aggregate.
 */
export class FinancialPaymentMethodResponseMapper {
  // ===========================================================================
  // Aggregate
  // ===========================================================================

  /**
   * Maps a fully rehydrated Financial Payment Method aggregate.
   *
   * This is the preferred mapping method for REST responses because the
   * aggregate is the application's domain boundary.
   */
  public static toResponse(
    aggregate: FinancialPaymentMethodAggregate,
  ): FinancialPaymentMethodResponse {
    return this.fromEntity(aggregate.paymentMethod);
  }

  // ===========================================================================
  // Entity
  // ===========================================================================

  /**
   * Maps a Financial Payment Method entity into its REST representation.
   *
   * Only safe primitive representations are exposed.
   *
   * Internal Entity IDs and Value Objects never cross the REST boundary.
   */
  public static fromEntity(
    paymentMethod: FinancialPaymentMethodEntity,
  ): FinancialPaymentMethodResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: paymentMethod.publicId.value,

      // -----------------------------------------------------------------------
      // Owning Financial Account
      // -----------------------------------------------------------------------

      accountPublicId: paymentMethod.accountPublicId.value,

      // -----------------------------------------------------------------------
      // Payment Method
      // -----------------------------------------------------------------------

      type: paymentMethod.type.value,

      provider: paymentMethod.provider.value,

      providerReference: paymentMethod.providerReference?.value,

      displayName: paymentMethod.displayName,

      lastFour: paymentMethod.lastFour,

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      isDefault: paymentMethod.isDefault,

      isActive: paymentMethod.isActive,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: paymentMethod.createdAt,

      updatedAt: paymentMethod.updatedAt,
    };
  }

  // ===========================================================================
  // Aggregate Collection
  // ===========================================================================

  /**
   * Maps a collection of Financial Payment Method aggregates.
   *
   * Useful for list/query responses.
   */
  public static fromAggregates(
    aggregates: readonly FinancialPaymentMethodAggregate[],
  ): FinancialPaymentMethodResponse[] {
    return aggregates.map((aggregate) => this.toResponse(aggregate));
  }

  // ===========================================================================
  // Entity Collection
  // ===========================================================================

  /**
   * Maps a collection of Financial Payment Method entities.
   *
   * Useful when an application query intentionally returns payment-method
   * entities without wrapping them in aggregates.
   */
  public static fromEntities(
    paymentMethods: readonly FinancialPaymentMethodEntity[],
  ): FinancialPaymentMethodResponse[] {
    return paymentMethods.map((paymentMethod) =>
      this.fromEntity(paymentMethod),
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialPaymentMethodResponseMapper;
