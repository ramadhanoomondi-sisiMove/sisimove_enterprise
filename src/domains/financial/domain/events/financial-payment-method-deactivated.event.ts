// -----------------------------------------------------------------------------
// Financial Payment Method Deactivated Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Payment Method is deactivated.
//
// Aggregate:
// - FinancialPaymentMethodAggregate
//
// The aggregate identity is stored in DomainEvent.metadata.aggregateId.
// The payment-method public identity and deactivation state are included in
// the payload because they are meaningful to event consumers.
//
// Deactivation does NOT delete the payment method. Historical payments may
// continue to reference the method.
//
// This event does NOT:
// - Communicate with an external provider.
// - Delete the external payment instrument.
// - Modify Financial Account balances.
// - Cancel existing Financial Payments.
// - Execute or reverse transactions.
//
// Those responsibilities belong to the appropriate application,
// integration, payment, and transaction boundaries.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { PublicEntityId } from '../../../../foundation/kernel/domain/public-entity-id';

// -----------------------------------------------------------------------------
// Financial
// -----------------------------------------------------------------------------

import { FinancialDomainEvent } from './financial-domain.event';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { FinancialPaymentMethodType } from '../value-objects/financial-payment-method-type.vo';

import type { FinancialProvider } from '../value-objects/financial-provider.vo';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

export class FinancialPaymentMethodDeactivatedEvent extends FinancialDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    /**
     * Persistence/domain identity of the Financial Payment Method aggregate.
     *
     * This becomes DomainEvent.metadata.aggregateId.
     */
    aggregateId: string,

    /**
     * Public identity of the Financial Payment Method.
     */
    publicId: PublicEntityId,

    /**
     * Financial Account that owns the payment method.
     *
     * This remains an opaque account identity.
     */
    accountId: PublicEntityId,

    /**
     * Payment method type.
     */
    type: FinancialPaymentMethodType,

    /**
     * External provider associated with the method.
     */
    provider: FinancialProvider,

    /**
     * Whether the method was the default method immediately before
     * deactivation.
     *
     * This value is captured before the entity changes its lifecycle state.
     */
    wasDefault: boolean,

    /**
     * Time at which the payment method was deactivated.
     */
    deactivatedAt: Date,

    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialPaymentMethod',
      'FinancialPaymentMethodDeactivated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.accountId = accountId;
    this.type = type;
    this.provider = provider;
    this.wasDefault = wasDefault;
    this.deactivatedAt = deactivatedAt;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Financial Payment Method aggregate.
   */
  public readonly publicId: PublicEntityId;

  /**
   * Public identity of the owning Financial Account.
   */
  public readonly accountId: PublicEntityId;

  /**
   * Payment method type.
   */
  public readonly type: FinancialPaymentMethodType;

  /**
   * External provider.
   */
  public readonly provider: FinancialProvider;

  /**
   * Whether the method was default before deactivation.
   */
  public readonly wasDefault: boolean;

  /**
   * Deactivation timestamp.
   */
  public readonly deactivatedAt: Date;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      accountId: this.accountId.toString(),

      type: this.type.toString(),

      provider: this.provider.toString(),

      wasDefault: this.wasDefault,

      deactivatedAt: this.deactivatedAt.toISOString(),
    };
  }
}
