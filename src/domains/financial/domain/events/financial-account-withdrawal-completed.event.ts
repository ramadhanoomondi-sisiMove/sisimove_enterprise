// -----------------------------------------------------------------------------
// Financial Account Withdrawal Completed Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Account Withdrawal transitions from PROCESSING
// to COMPLETED.
//
// This event represents the domain fact that the withdrawal lifecycle has
// successfully completed.
//
// IMPORTANT:
//
// Completion of a withdrawal means the withdrawal itself has been
// successfully resolved. The actual external movement of funds is represented
// by the Financial Disbursement Aggregate and its own lifecycle/events.
//
// This event does NOT:
// - call an external provider;
// - execute a mobile-money or bank payout;
// - modify Financial Account balances;
// - create a Financial Disbursement;
// - represent provider communication.
//
// Those responsibilities belong to the appropriate application/integration
// workflow and Financial Disbursement Aggregate.
//
// Aggregate identity is stored in DomainEvent.metadata.aggregateId.
//
// Lifecycle:
//
//     PENDING
//        |
//        v
//     PROCESSING
//        |
//        v
//     COMPLETED
//
// COMPLETED is terminal.
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
  FinancialAccountWithdrawalPublicId,
  FinancialAccountPublicId,
} from '../value-objects';

// -----------------------------------------------------------------------------
// Event
// -----------------------------------------------------------------------------

/**
 * Emitted when a Financial Account Withdrawal is completed.
 *
 * Lifecycle transition:
 *
 *     PROCESSING -> COMPLETED
 *
 * The event establishes that the withdrawal aggregate has successfully
 * reached its terminal COMPLETED state.
 *
 * The aggregate identity is stored in:
 *
 *     DomainEvent.metadata.aggregateId
 *
 * The public withdrawal and account identities are included in the payload
 * because they are meaningful to application, reporting, notification,
 * reconciliation, and integration consumers.
 */
export class FinancialAccountWithdrawalCompletedEvent extends FinancialDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,

    withdrawalPublicId: FinancialAccountWithdrawalPublicId,

    accountPublicId: FinancialAccountPublicId,

    correlationId: string,

    causationId?: string,

    eventVersion = 1,

    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialAccountWithdrawal',
      'FinancialAccountWithdrawalCompleted',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.withdrawalPublicId = withdrawalPublicId;
    this.accountPublicId = accountPublicId;
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the completed withdrawal.
   */
  public readonly withdrawalPublicId: FinancialAccountWithdrawalPublicId;

  /**
   * Public identity of the Financial Account from which the withdrawal
   * originated.
   */
  public readonly accountPublicId: FinancialAccountPublicId;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      withdrawalPublicId: this.withdrawalPublicId.toString(),

      accountPublicId: this.accountPublicId.toString(),
    };
  }
}
