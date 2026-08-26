// -----------------------------------------------------------------------------
// Financial Disbursement Cancelled Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Disbursement transitions to CANCELLED.
//
// Aggregate:
// - FinancialDisbursementAggregate
//
// Aggregate Root:
// - FinancialDisbursementEntity
//
// The aggregate identity is stored in:
// - DomainEvent.metadata.aggregateId
//
// This event does NOT:
// - Execute a provider API.
// - Guarantee provider-side cancellation.
// - Move funds.
// - Modify Financial Account balances directly.
// - Create ledger entries directly.
// - Persist itself.
//
// Cancellation is a Financial Disbursement lifecycle decision.
// Provider-side cancellation, where supported, belongs to the Integration
// boundary.
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
  FinancialDisbursementStatus,
  FinancialReferencePublicId,
  FinancialReferenceType,
  Money,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Emitted when a Financial Disbursement is cancelled.
 *
 * A disbursement may be cancelled while PENDING or PROCESSING according to
 * the aggregate lifecycle rules.
 *
 * Cancellation does not imply that an external provider request has been
 * cancelled. Provider communication belongs to the Integration boundary.
 *
 * The aggregate identity is stored in DomainEvent.metadata.aggregateId.
 */
export class FinancialDisbursementCancelledEvent extends FinancialDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    sourceAccountId: PublicEntityId,
    destinationId: PublicEntityId,
    amount: Money,
    status: FinancialDisbursementStatus,
    referenceType: FinancialReferenceType | undefined,
    referencePublicId: FinancialReferencePublicId | undefined,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialDisbursement',
      'FinancialDisbursementCancelled',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.publicId = publicId;
    this.sourceAccountId = sourceAccountId;
    this.destinationId = destinationId;
    this.amount = amount;
    this.status = status;
    this.referenceType = referenceType;
    this.referencePublicId = referencePublicId;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Financial Disbursement.
   */
  public readonly publicId: PublicEntityId;

  /**
   * Public identity of the Financial Account from which the disbursement
   * originated.
   */
  public readonly sourceAccountId: PublicEntityId;

  /**
   * Public identity of the destination to which the disbursement was
   * intended.
   */
  public readonly destinationId: PublicEntityId;

  /**
   * Monetary amount of the cancelled disbursement.
   *
   * Money keeps amount and currency inseparable inside the domain event.
   */
  public readonly amount: Money;

  /**
   * Lifecycle status after cancellation.
   *
   * For this event the expected value is CANCELLED.
   */
  public readonly status: FinancialDisbursementStatus;

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

      sourceAccountId: this.sourceAccountId.toString(),

      destinationId: this.destinationId.toString(),

      amount: this.amount.amount,

      currency: this.amount.currency.toString(),

      status: this.status.toString(),

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
