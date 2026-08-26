// -----------------------------------------------------------------------------
// Financial Account Withdrawal Cancelled Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Account Withdrawal transitions to CANCELLED.
//
// This event represents the domain fact that the withdrawal request has been
// intentionally cancelled before successful completion.
//
// IMPORTANT:
//
// Cancellation is a lifecycle fact of the Withdrawal Aggregate.
//
// It does NOT:
// - execute a disbursement;
// - call an external provider;
// - modify Financial Account balances;
// - create a Financial Transaction;
// - release or reverse funds by itself.
//
// Any required financial reversal or balance adjustment must be performed by
// the appropriate Financial workflow and represented by its own transaction
// events.
//
// Aggregate identity is stored in DomainEvent.metadata.aggregateId.
//
// Lifecycle:
//
//     PENDING
//        |
//        v
//     CANCELLED
//
// or:
//
//     PROCESSING
//        |
//        v
//     CANCELLED
//
// CANCELLED is terminal.
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
 * Emitted when a Financial Account Withdrawal is cancelled.
 *
 * Valid lifecycle transitions:
 *
 *     PENDING    -> CANCELLED
 *     PROCESSING -> CANCELLED
 *
 * The event establishes that the withdrawal aggregate has reached its
 * terminal CANCELLED state.
 *
 * A domain-level cancellation reason is included to explain why the request
 * was cancelled.
 *
 * Sensitive provider-specific information and infrastructure details must not
 * be included in the reason.
 */
export class FinancialAccountWithdrawalCancelledEvent extends FinancialDomainEvent {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------

  public constructor(
    aggregateId: string,

    withdrawalPublicId: FinancialAccountWithdrawalPublicId,

    accountPublicId: FinancialAccountPublicId,

    reason: string,

    correlationId: string,

    causationId?: string,

    eventVersion = 1,

    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialAccountWithdrawal',
      'FinancialAccountWithdrawalCancelled',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.withdrawalPublicId = withdrawalPublicId;
    this.accountPublicId = accountPublicId;
    this.reason =
      FinancialAccountWithdrawalCancelledEvent.normalizeReason(reason);
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the cancelled withdrawal.
   */
  public readonly withdrawalPublicId: FinancialAccountWithdrawalPublicId;

  /**
   * Public identity of the Financial Account from which the withdrawal
   * originated.
   */
  public readonly accountPublicId: FinancialAccountPublicId;

  /**
   * Domain-level reason explaining why the withdrawal was cancelled.
   */
  public readonly reason: string;

  // ---------------------------------------------------------------------------
  // Payload
  // ---------------------------------------------------------------------------

  protected override getPayload(): Record<string, unknown> {
    return {
      ...this.getBasePayload(),

      withdrawalPublicId: this.withdrawalPublicId.toString(),

      accountPublicId: this.accountPublicId.toString(),

      reason: this.reason,
    };
  }

  // ---------------------------------------------------------------------------
  // Validation
  // ---------------------------------------------------------------------------

  private static normalizeReason(reason: string): string {
    const normalized = reason.trim();

    if (normalized.length === 0) {
      throw new Error(
        'Financial Account Withdrawal cancellation reason must not be empty',
      );
    }

    if (normalized.length > 500) {
      throw new Error(
        'Financial Account Withdrawal cancellation reason must not exceed 500 characters',
      );
    }

    return normalized;
  }
}
