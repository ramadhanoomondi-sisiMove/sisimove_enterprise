// -----------------------------------------------------------------------------
// Financial Payment Created Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Payment is created.
//
// Aggregate:
// - FinancialPaymentAggregate
//
// Aggregate Root:
// - FinancialPaymentEntity
//
// The aggregate identity is stored in:
// - DomainEvent.metadata.aggregateId
//
// The externally meaningful Financial Payment public identity is included in
// the event payload.
//
// This event does NOT:
// - Execute a payment.
// - Call an external provider.
// - Move funds.
// - Create a Financial Transaction.
// - Modify Financial Account balances.
//
// Those responsibilities belong to the appropriate application,
// integration, and transaction boundaries.
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

import type {
  FinancialPaymentMethodPublicId,
  FinancialPaymentStatus,
  FinancialReferencePublicId,
  FinancialReferenceType,
  Money,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Emitted when a Financial Payment is created.
 *
 * The aggregate identity is stored in DomainEvent.metadata.aggregateId.
 *
 * The payment public identity is included in the payload because it is the
 * externally meaningful identity consumed by other bounded contexts.
 */
export class FinancialPaymentCreatedEvent extends FinancialDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    accountId: PublicEntityId,
    amount: Money,
    status: FinancialPaymentStatus,
    methodId: FinancialPaymentMethodPublicId | undefined,
    referenceType: FinancialReferenceType | undefined,
    referencePublicId: FinancialReferencePublicId | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialPayment',
      'FinancialPaymentCreated',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.accountId = accountId;
    this.amount = amount;
    this.status = status;
    this.methodId = methodId;
    this.referenceType = referenceType;
    this.referencePublicId = referencePublicId;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Financial Payment.
   */
  public readonly publicId: PublicEntityId;

  /**
   * Public identity of the Financial Account receiving the payment.
   *
   * This should be the externally meaningful account identity rather than the
   * persistence/internal FinancialAccount identifier.
   */
  public readonly accountId: PublicEntityId;

  /**
   * Monetary amount of the Financial Payment.
   *
   * Money keeps amount and currency inseparable inside the domain event.
   */
  public readonly amount: Money;

  /**
   * Initial lifecycle status of the Financial Payment.
   */
  public readonly status: FinancialPaymentStatus;

  /**
   * Selected Financial Payment Method, if one was supplied when the payment
   * was created.
   */
  public readonly methodId: FinancialPaymentMethodPublicId | undefined;

  /**
   * Optional originating business reference.
   */
  public readonly referenceType: FinancialReferenceType | undefined;

  /**
   * Public identity of the originating business object.
   */
  public readonly referencePublicId: FinancialReferencePublicId | undefined;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      accountId: this.accountId.toString(),

      amount: this.amount.amount,

      currency: this.amount.currency.toString(),

      status: this.status.toString(),

      methodId:
        this.methodId !== undefined ? this.methodId.toString() : undefined,

      referenceType:
        this.referenceType !== undefined
          ? this.referenceType.toString()
          : undefined,

      referencePublicId:
        this.referencePublicId !== undefined
          ? this.referencePublicId.toString()
          : undefined,
    };
  }
}
