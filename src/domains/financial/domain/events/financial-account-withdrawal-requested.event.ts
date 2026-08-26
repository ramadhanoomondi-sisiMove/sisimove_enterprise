// -----------------------------------------------------------------------------
// Financial Account Withdrawal Requested Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Account Withdrawal Aggregate accepts a new
// withdrawal request.
//
// This event represents the domain fact that:
//
//     a Financial Account owner requested funds to be withdrawn.
//
// It does NOT mean that:
// - the withdrawal has been processed;
// - funds have been disbursed;
// - an external provider has been called;
// - the withdrawal has completed.
//
// Those are separate lifecycle facts.
//
// The withdrawal owns the selected destination as an immutable snapshot.
// Therefore this event carries the withdrawal destination snapshot itself.
//
// Aggregate identity is stored in DomainEvent.metadata.aggregateId.
//
// The public withdrawal identity and financially relevant request information
// are included in the event payload because they are consumed by application,
// integration, notification, reconciliation, and reporting workflows.
//
// -----------------------------------------------------------------------------
//
// Lifecycle:
//
//     Financial Account
//           |
//           | withdrawal requested
//           v
//     Withdrawal Aggregate
//           |
//           v
//     FinancialAccountWithdrawalRequestedEvent
//
// Subsequent lifecycle events belong to the Withdrawal Aggregate and should
// be emitted only when the corresponding domain state transition actually
// occurs.
//
// -----------------------------------------------------------------------------
//
// Destination:
//
//     FinancialAccountWithdrawal
//              |
//              └── FinancialAccountWithdrawalDestination
//                          |
//                          ├── type
//                          └── value
//
// The destination is an immutable request snapshot.
//
// It is NOT:
// - another aggregate;
// - a repository reference;
// - a FinancialDisbursementDestination aggregate;
// - a mutable external destination.
//
// The Financial Disbursement workflow may later interpret this snapshot when
// creating and executing the external payout.
//
// -----------------------------------------------------------------------------
//
// Important:
//
// - This event does not create a Financial Disbursement.
// - This event does not execute a Financial Disbursement.
// - This event does not mutate Financial Account balance.
// - This event does not create a Financial Transaction.
// - This event does not communicate with an external provider.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Financial
// -----------------------------------------------------------------------------

import { FinancialDomainEvent } from './financial-domain.event';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type {
  FinancialAccountWithdrawalDestination,
  FinancialAccountWithdrawalPublicId,
  FinancialAccountPublicId,
  FinancialReferenceType,
  FinancialReferencePublicId,
  Money,
} from '../value-objects';

// =============================================================================
// Event
// =============================================================================

/**
 * Emitted when a Financial Account Withdrawal is requested.
 *
 * The aggregate identity is stored in:
 *
 *     DomainEvent.metadata.aggregateId
 *
 * The public withdrawal identity is included in the payload because it is
 * the externally meaningful identifier of the withdrawal request.
 *
 * The selected withdrawal destination is included as an immutable snapshot.
 *
 * This event establishes the financial withdrawal request as a domain fact.
 *
 * It does not represent successful processing or disbursement.
 */
export class FinancialAccountWithdrawalRequestedEvent extends FinancialDomainEvent {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    aggregateId: string,

    withdrawalPublicId: FinancialAccountWithdrawalPublicId,

    accountPublicId: FinancialAccountPublicId,

    amount: Money,

    destination: FinancialAccountWithdrawalDestination,

    referenceType: FinancialReferenceType | undefined,

    referencePublicId: FinancialReferencePublicId | undefined,

    correlationId: string,

    causationId?: string,

    eventVersion = 1,

    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialAccountWithdrawal',
      'FinancialAccountWithdrawalRequested',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.withdrawalPublicId = withdrawalPublicId;
    this.accountPublicId = accountPublicId;
    this.amount = amount;
    this.destination = destination;
    this.referenceType = referenceType;
    this.referencePublicId = referencePublicId;
  }

  // ===========================================================================
  // Properties
  // ===========================================================================

  /**
   * Public identity of the withdrawal request.
   */
  public readonly withdrawalPublicId: FinancialAccountWithdrawalPublicId;

  /**
   * Public identity of the Financial Account from which funds are requested
   * to be withdrawn.
   */
  public readonly accountPublicId: FinancialAccountPublicId;

  /**
   * Amount and currency requested for withdrawal.
   */
  public readonly amount: Money;

  /**
   * Immutable snapshot of the selected external withdrawal destination.
   *
   * This is request-level domain data and is not an aggregate reference.
   */
  public readonly destination: FinancialAccountWithdrawalDestination;

  /**
   * Optional business reference type associated with the withdrawal.
   */
  public readonly referenceType: FinancialReferenceType | undefined;

  /**
   * Optional business reference public ID associated with the withdrawal.
   */
  public readonly referencePublicId: FinancialReferencePublicId | undefined;

  // ===========================================================================
  // Payload
  // ===========================================================================

  /**
   * Serializes the withdrawal-requested event payload.
   *
   * The destination snapshot is serialized using its actual domain contract:
   *
   *     type
   *     value
   *
   * No FinancialDisbursementDestinationPublicId is included because the
   * withdrawal owns a destination snapshot rather than a destination
   * aggregate reference.
   */
  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      withdrawalPublicId: this.withdrawalPublicId.toString(),

      accountPublicId: this.accountPublicId.toString(),

      amount: this.amount.amount,

      currency: this.amount.currency.toString(),

      destination: {
        type: this.destination.type,
        value: this.destination.value,
      },

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
