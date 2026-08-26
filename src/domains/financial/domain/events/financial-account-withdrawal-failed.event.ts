// -----------------------------------------------------------------------------
// Financial Account Withdrawal Failed Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Account Withdrawal transitions from PROCESSING
// to FAILED.
//
// This event represents the domain fact that the withdrawal could not be
// successfully completed.
//
// IMPORTANT:
//
// Failure of the withdrawal does NOT mean that an external provider must
// necessarily have rejected a payout. The failure may result from:
// - internal processing failure;
// - validation/reconciliation failure;
// - disbursement failure;
// - provider failure;
// - timeout or unavailable provider;
// - another recoverable or terminal processing condition.
//
// The event records the withdrawal lifecycle fact only.
//
// It does NOT:
// - retry the withdrawal;
// - communicate with an external provider;
// - reverse balances;
// - create a compensating transaction;
// - perform a refund.
//
// Those responsibilities belong to the appropriate application,
// financial transaction, disbursement, or integration workflow.
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
//      FAILED
//
// FAILED is terminal for this withdrawal request.
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
 * Emitted when a Financial Account Withdrawal fails.
 *
 * Lifecycle transition:
 *
 *     PROCESSING -> FAILED
 *
 * The event establishes that the withdrawal aggregate has reached its
 * terminal FAILED state.
 *
 * The failure reason is included as a normalized domain-level description.
 * Sensitive provider-specific information should not be placed in this event.
 */
export class FinancialAccountWithdrawalFailedEvent extends FinancialDomainEvent {
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
      'FinancialAccountWithdrawalFailed',
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );

    this.withdrawalPublicId = withdrawalPublicId;
    this.accountPublicId = accountPublicId;
    this.reason = FinancialAccountWithdrawalFailedEvent.normalizeReason(reason);
  }

  // ---------------------------------------------------------------------------
  // Properties
  // ---------------------------------------------------------------------------

  /**
   * Public identity of the failed withdrawal.
   */
  public readonly withdrawalPublicId: FinancialAccountWithdrawalPublicId;

  /**
   * Public identity of the Financial Account from which the withdrawal
   * originated.
   */
  public readonly accountPublicId: FinancialAccountPublicId;

  /**
   * Domain-level reason describing why the withdrawal failed.
   *
   * Provider-specific response payloads, credentials, sensitive account
   * information, and infrastructure details must not be exposed here.
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
        'Financial Account Withdrawal failure reason must not be empty',
      );
    }

    if (normalized.length > 500) {
      throw new Error(
        'Financial Account Withdrawal failure reason must not exceed 500 characters',
      );
    }

    return normalized;
  }
}
