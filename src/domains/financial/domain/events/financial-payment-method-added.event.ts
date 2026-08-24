// -----------------------------------------------------------------------------
// Financial Payment Method Added Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Payment Method is added to its
// FinancialPaymentMethodAggregate.
//
// Aggregate:
// - FinancialPaymentMethodAggregate
//
// The aggregate identity is stored in DomainEvent.metadata.aggregateId.
// The payment-method public identity and method information are included in
// the payload because they are meaningful to event consumers.
//
// This event does NOT:
// - Communicate with an external provider.
// - Store or expose sensitive payment credentials.
// - Execute a payment.
// - Modify Financial Account balances.
// - Select the method for a payment.
//
// Those responsibilities belong to the appropriate application,
// integration, and payment boundaries.
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

import type { FinancialProviderReference } from '../value-objects/financial-provider-reference.vo';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

export class FinancialPaymentMethodAddedEvent extends FinancialDomainEvent {
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
     * This remains an opaque account identity rather than embedding the
     * Financial Account aggregate.
     */
    accountId: PublicEntityId,

    /**
     * Payment method type.
     */
    type: FinancialPaymentMethodType,

    /**
     * External provider responsible for the payment method.
     */
    provider: FinancialProvider,

    /**
     * Provider-issued reference, when available.
     *
     * This should only contain a safe provider reference and never raw
     * credentials.
     */
    providerReference: FinancialProviderReference | undefined,

    /**
     * Safe human-readable display name.
     */
    displayName: string | undefined,

    /**
     * Safe masked identifier suffix.
     *
     * Example: last four characters of a card or account identifier.
     */
    lastFour: string | undefined,

    /**
     * Whether this method was designated as the account's default method
     * when added.
     */
    isDefault: boolean,

    /**
     * Whether the method is currently active.
     */
    isActive: boolean,

    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialPaymentMethod',
      'FinancialPaymentMethodAdded',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.accountId = accountId;
    this.type = type;
    this.provider = provider;
    this.providerReference = providerReference;
    this.displayName = displayName;
    this.lastFour = lastFour;
    this.isDefault = isDefault;
    this.isActive = isActive;
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
   * Safe provider-issued reference.
   */
  public readonly providerReference: FinancialProviderReference | undefined;

  /**
   * Safe display label.
   */
  public readonly displayName: string | undefined;

  /**
   * Safe masked identifier suffix.
   */
  public readonly lastFour: string | undefined;

  /**
   * Whether the method is the account's default.
   */
  public readonly isDefault: boolean;

  /**
   * Whether the method is active.
   */
  public readonly isActive: boolean;

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

      providerReference:
        this.providerReference !== undefined
          ? this.providerReference.toString()
          : undefined,

      displayName: this.displayName,

      lastFour: this.lastFour,

      isDefault: this.isDefault,

      isActive: this.isActive,
    };
  }
}
