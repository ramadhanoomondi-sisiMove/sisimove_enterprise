// -----------------------------------------------------------------------------
// Financial Disbursement Processing Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Disbursement transitions from PENDING to
// PROCESSING.
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
// - Move funds.
// - Modify Financial Account balances.
// - Create a Financial Transaction.
// - Determine provider-specific execution behavior.
//
// Provider communication belongs to the Integration boundary.
// Financial Transactions remain the authoritative record of money movement.
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
 * Emitted when a Financial Disbursement begins processing.
 *
 * The aggregate identity is stored in DomainEvent.metadata.aggregateId.
 *
 * The event exposes public identities and immutable financial context needed
 * by downstream consumers without exposing persistence-level identifiers.
 */
export class FinancialDisbursementProcessingEvent extends FinancialDomainEvent {
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
      'FinancialDisbursementProcessing',
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
   * originates.
   */
  public readonly sourceAccountId: PublicEntityId;

  /**
   * Public identity of the destination receiving the disbursement.
   */
  public readonly destinationId: PublicEntityId;

  /**
   * Monetary amount being disbursed.
   *
   * Money keeps amount and currency inseparable inside the domain event.
   */
  public readonly amount: Money;

  /**
   * Lifecycle status after the transition.
   *
   * For this event the expected value is PROCESSING.
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
