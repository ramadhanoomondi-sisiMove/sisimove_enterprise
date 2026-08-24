// -----------------------------------------------------------------------------
// Financial Payment Method Defaulted Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Payment Method becomes the default payment method
// for its owning Financial Account.
//
// Aggregate:
// - FinancialPaymentMethodAggregate
//
// The aggregate identity is stored in DomainEvent.metadata.aggregateId.
// The payment-method and owning-account public identities are included in the
// payload because they are meaningful to event consumers.
//
// The FinancialPaymentMethod aggregate does not mutate sibling payment
// methods. Coordination of the account's single-default invariant belongs to
// the appropriate application/domain service boundary.
//
// This event does NOT:
// - Execute a payment.
// - Communicate with an external provider.
// - Modify Financial Account balances.
// - Deactivate another payment method.
// - Move money.
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

export class FinancialPaymentMethodDefaultedEvent extends FinancialDomainEvent {
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
     * Public identity of the owning Financial Account.
     *
     * This remains an opaque reference and does not embed the account
     * aggregate.
     */
    accountId: PublicEntityId,

    /**
     * Payment method type.
     */
    type: FinancialPaymentMethodType,

    /**
     * External provider associated with the payment method.
     */
    provider: FinancialProvider,

    /**
     * Time at which the payment method became the default method.
     */
    defaultedAt: Date,

    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialPaymentMethod',
      'FinancialPaymentMethodDefaulted',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.accountId = accountId;
    this.type = type;
    this.provider = provider;
    this.defaultedAt = defaultedAt;
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
   * Timestamp at which the method became default.
   */
  public readonly defaultedAt: Date;

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

      defaultedAt: this.defaultedAt.toISOString(),
    };
  }
}
