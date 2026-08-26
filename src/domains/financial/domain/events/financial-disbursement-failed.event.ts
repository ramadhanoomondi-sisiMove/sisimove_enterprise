// -----------------------------------------------------------------------------
// Financial Disbursement Failed Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Disbursement transitions to FAILED.
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
// - Retry the disbursement.
// - Move funds.
// - Modify Financial Account balances directly.
// - Create ledger entries directly.
// - Persist itself.
//
// Retry orchestration belongs to the application/integration workflow.
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
 * Emitted when a Financial Disbursement fails.
 *
 * The failure represents the lifecycle state of the disbursement aggregate.
 * Provider-specific execution details belong to the corresponding
 * FinancialDisbursementAttempt and integration boundary.
 *
 * The aggregate identity is stored in DomainEvent.metadata.aggregateId.
 */
export class FinancialDisbursementFailedEvent extends FinancialDomainEvent {
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
      'FinancialDisbursementFailed',
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
   * Monetary amount of the failed disbursement.
   *
   * Money keeps amount and currency inseparable inside the domain event.
   */
  public readonly amount: Money;

  /**
   * Lifecycle status after failure.
   *
   * For this event the expected value is FAILED.
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
