// -----------------------------------------------------------------------------
// Financial Disbursement Created Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Disbursement is created.
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
// The externally meaningful Financial Disbursement public identity is included
// in the event payload.
//
// This event does NOT:
// - Execute a disbursement.
// - Call an external provider.
// - Move funds.
// - Create a Financial Transaction.
// - Modify Financial Account balances.
// - Modify the Financial Disbursement Destination.
//
// Those responsibilities belong to the appropriate application, integration,
// account, and transaction boundaries.
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
  FinancialDisbursementDestinationPublicId,
  FinancialDisbursementStatus,
  FinancialReferencePublicId,
  FinancialReferenceType,
  Money,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Emitted when a Financial Disbursement is created.
 *
 * The aggregate identity is stored in DomainEvent.metadata.aggregateId.
 *
 * The disbursement public identity is included in the payload because it is
 * the externally meaningful identity consumed by other bounded contexts and
 * application processes.
 */
export class FinancialDisbursementCreatedEvent extends FinancialDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,
    publicId: PublicEntityId,
    sourceAccountId: PublicEntityId,
    destinationId: FinancialDisbursementDestinationPublicId,
    amount: Money,
    status: FinancialDisbursementStatus,
    referenceType: FinancialReferenceType | undefined,
    referencePublicId: FinancialReferencePublicId | undefined,
    requestedAt: Date,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialDisbursement',
      'FinancialDisbursementCreated',
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
    this.requestedAt = requestedAt;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the Financial Disbursement.
   */
  public readonly publicId: PublicEntityId;

  /**
   * Public identity of the Financial Account from which funds are to be
   * disbursed.
   *
   * This is the externally meaningful Financial Account identity and must not
   * expose the persistence/internal account identifier.
   */
  public readonly sourceAccountId: PublicEntityId;

  /**
   * Public identity of the Financial Disbursement Destination receiving the
   * funds.
   */
  public readonly destinationId: FinancialDisbursementDestinationPublicId;

  /**
   * Monetary amount of the Financial Disbursement.
   *
   * Money keeps amount and currency inseparable inside the domain event.
   */
  public readonly amount: Money;

  /**
   * Initial lifecycle status of the Financial Disbursement.
   *
   * Newly created disbursements begin in PENDING state.
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

  /**
   * Timestamp at which the Financial Disbursement was requested.
   */
  public readonly requestedAt: Date;

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

      requestedAt: this.requestedAt,
    };
  }
}
