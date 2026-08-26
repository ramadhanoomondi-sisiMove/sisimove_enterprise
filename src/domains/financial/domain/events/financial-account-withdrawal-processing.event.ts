// -----------------------------------------------------------------------------
// Financial Account Withdrawal Processing Domain Event
// -----------------------------------------------------------------------------
//
// Emitted when a Financial Account Withdrawal transitions from PENDING to
// PROCESSING.
//
// This event represents the domain fact that the withdrawal request has been
// accepted for processing.
//
// It does NOT mean that:
// - the withdrawal has completed;
// - funds have reached the external destination;
// - an external provider has successfully processed the payout.
//
// External disbursement execution belongs to the Financial Disbursement
// Aggregate and its corresponding workflow.
//
// Aggregate identity is stored in DomainEvent.metadata.aggregateId.
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
 * Emitted when a Financial Account Withdrawal begins processing.
 *
 * Lifecycle transition:
 *
 *     PENDING -> PROCESSING
 *
 * The event establishes that the withdrawal request has entered active
 * processing.
 *
 * It does not establish successful completion or external disbursement.
 */
export class FinancialAccountWithdrawalProcessingEvent extends FinancialDomainEvent {
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
      'FinancialAccountWithdrawalProcessing',
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
   * Public identity of the withdrawal request.
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
