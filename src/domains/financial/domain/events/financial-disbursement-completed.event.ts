// -----------------------------------------------------------------------------
// Financial Disbursement Completed Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Disbursement transitions to COMPLETED.
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
// - Modify Financial Account balances directly.
// - Create or post Financial Transactions.
// - Persist itself.
//
// The successful disbursement workflow coordinates the resulting Financial
// Transaction. Financial Transactions remain the authoritative record of
// money movement.
//
// -----------------------------------------------------------------------------
//
// Event meaning:
//
// FinancialDisbursementCompleted means:
//
// - the disbursement lifecycle reached COMPLETED;
// - a successful FinancialDisbursementAttempt exists;
// - the successful attempt was accepted by the aggregate;
// - the resulting Financial Transaction has been associated with the
//   disbursement;
// - downstream consumers may react to the completed disbursement.
//
// Provider-specific execution details remain outside this event.
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
 * Emitted when a Financial Disbursement has completed successfully.
 *
 * Completion requires the Financial Disbursement aggregate to have:
 *
 * - transitioned to COMPLETED;
 * - recorded a successful execution attempt;
 * - associated the resulting Financial Transaction.
 *
 * The aggregate identity is stored in DomainEvent.metadata.aggregateId.
 *
 * The event exposes public identities and immutable financial context needed
 * by downstream consumers without exposing persistence-level identifiers.
 */
export class FinancialDisbursementCompletedEvent extends FinancialDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    sourceAccountId: PublicEntityId,
    destinationId: PublicEntityId,
    amount: Money,
    status: FinancialDisbursementStatus,
    transactionPublicId: FinancialReferencePublicId,
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
      'FinancialDisbursementCompleted',
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
    this.transactionPublicId = transactionPublicId;
    this.referenceType = referenceType;
    this.referencePublicId = referencePublicId;
  }

  // ===========================================================================
  // Properties
  // ===========================================================================

  /**
   * Public identity of the Financial Disbursement.
   */
  public readonly publicId: PublicEntityId;

  /**
   * Public identity of the Financial Account from which funds were
   * disbursed.
   */
  public readonly sourceAccountId: PublicEntityId;

  /**
   * Public identity of the Financial Disbursement Destination that received
   * the disbursement.
   */
  public readonly destinationId: PublicEntityId;

  /**
   * Monetary amount successfully disbursed.
   *
   * Money keeps amount and currency inseparable inside the domain event.
   */
  public readonly amount: Money;

  /**
   * Lifecycle status after completion.
   *
   * Expected value:
   *
   * COMPLETED
   */
  public readonly status: FinancialDisbursementStatus;

  /**
   * Public identity of the Financial Transaction associated with the
   * completed disbursement.
   *
   * The transaction is created and posted by the Financial Transaction
   * boundary. This event only carries its public identity.
   */
  public readonly transactionPublicId: FinancialReferencePublicId;

  /**
   * Optional originating business reference.
   */
  public readonly referenceType: FinancialReferenceType | undefined;

  /**
   * Public identity of the originating business object.
   */
  public readonly referencePublicId: FinancialReferencePublicId | undefined;

  // ===========================================================================
  // Payload
  // ===========================================================================

  /**
   * Returns the immutable event payload.
   *
   * Only public identities and domain-level financial values are exposed.
   * Persistence identifiers and provider-specific execution details are not
   * included.
   */
  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      publicId: this.publicId.toString(),

      sourceAccountId: this.sourceAccountId.toString(),

      destinationId: this.destinationId.toString(),

      amount: this.amount.amount,

      currency: this.amount.currency.toString(),

      status: this.status.toString(),

      transactionPublicId: this.transactionPublicId.toString(),

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
