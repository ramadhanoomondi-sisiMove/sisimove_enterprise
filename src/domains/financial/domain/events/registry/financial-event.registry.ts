// -----------------------------------------------------------------------------
// Financial Domain — Event Registry
// -----------------------------------------------------------------------------
//
// Central registry responsible for rehydrating Financial domain events.
//
// Registered event families:
// 1. Financial Payment
// 2. Financial Account
// 3. Financial Account Hold
// 4. Financial Settlement
// 5. Financial Account Withdrawal
// 6. Financial Disbursement
// 7. Financial Transactions
//
// Responsibilities:
// - Register supported financial domain events.
// - Resolve event rehydrators using event name and version.
// - Rehydrate events using their static rehydrate() methods.
// - Preserve original event metadata.
// - Reject unsupported event names and versions.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation — Domain Events
// -----------------------------------------------------------------------------

import type {
  DomainEvent,
  EventMetadata,
} from '../../../../../foundation/kernel/domain/domain-event';

// =============================================================================
// Financial Payment Events
// =============================================================================

import { FinancialPaymentCreatedEvent } from '../financial-payment-created.event';
import { FinancialPaymentAttemptAddedEvent } from '../financial-payment-attempt-added.event';
import { FinancialPaymentProcessingEvent } from '../financial-payment-processing.event';
import { FinancialPaymentSucceededEvent } from '../financial-payment-succeeded.event';
import { FinancialPaymentFailedEvent } from '../financial-payment-failed.event';
import { FinancialPaymentCancelledEvent } from '../financial-payment-cancelled.event';
import { FinancialPaymentExpiredEvent } from '../financial-payment-expired.event';
import { FinancialPaymentTransactionLinkedEvent } from '../financial-payment-transaction-linked.event';

// =============================================================================
// Financial Account Events
// =============================================================================

import { FinancialAccountCreatedEvent } from '../financial-account-created.event';
import { FinancialAccountActivatedEvent } from '../financial-account-activated.event';
import { FinancialAccountSuspendedEvent } from '../financial-account-suspended.event';
import { FinancialAccountClosedEvent } from '../financial-account-closed.event';

// =============================================================================
// Financial Account Hold Events
// =============================================================================

import { FinancialAccountHoldCreatedEvent } from '../financial-account-hold-created.event';
import { FinancialAccountHoldCapturedEvent } from '../financial-account-hold-captured.event';
import { FinancialAccountHoldReleasedEvent } from '../financial-account-hold-released.event';
import { FinancialAccountHoldCancelledEvent } from '../financial-account-hold-cancelled.event';

// =============================================================================
// Financial Settlement Events
// =============================================================================

import { FinancialSettlementCreatedEvent } from '../financial-settlement-created.event';
import { FinancialSettlementProcessingEvent } from '../financial-settlement-processing.event';
import { FinancialSettlementAllocatedEvent } from '../financial-settlement-allocated.event';
import { FinancialSettlementCompletedEvent } from '../financial-settlement-completed.event';
import { FinancialSettlementFailedEvent } from '../financial-settlement-failed.event';
import { FinancialSettlementCancelledEvent } from '../financial-settlement-cancelled.event';

// =============================================================================
// Financial Account Withdrawal Events
// =============================================================================

import { FinancialAccountWithdrawalRequestedEvent } from '../financial-account-withdrawal-requested.event';
import { FinancialAccountWithdrawalProcessingEvent } from '../financial-account-withdrawal-processing.event';
import { FinancialAccountWithdrawalCompletedEvent } from '../financial-account-withdrawal-completed.event';
import { FinancialAccountWithdrawalFailedEvent } from '../financial-account-withdrawal-failed.event';
import { FinancialAccountWithdrawalCancelledEvent } from '../financial-account-withdrawal-cancelled.event';

// =============================================================================
// Financial Disbursement Events
// =============================================================================

import { FinancialDisbursementCreatedEvent } from '../financial-disbursement-created.event';
import { FinancialDisbursementProcessingEvent } from '../financial-disbursement-processing.event';
import { FinancialDisbursementAttemptSucceededEvent } from '../financial-disbursement-attempt-succeeded.event';
import { FinancialDisbursementCompletedEvent } from '../financial-disbursement-completed.event';
import { FinancialDisbursementFailedEvent } from '../financial-disbursement-failed.event';
import { FinancialDisbursementCancelledEvent } from '../financial-disbursement-cancelled.event';

// =============================================================================
// Financial Transaction Events
// =============================================================================

import { FinancialTransactionCreatedEvent } from '../financial-transaction-created.event';
import { FinancialTransactionCompletedEvent } from '../financial-transaction-completed.event';
import { FinancialTransactionFailedEvent } from '../financial-transaction-failed.event';
import { FinancialTransactionCancelledEvent } from '../financial-transaction-cancelled.event';
import { FinancialTransactionReversedEvent } from '../financial-transaction-reversed.event';

// =============================================================================
// Event Rehydrator
// =============================================================================

type FinancialEventRehydrator = (
  metadata: EventMetadata,
  payload: Record<string, unknown>,
) => DomainEvent;

// =============================================================================
// Financial Event Registry
// =============================================================================

export class FinancialEventRegistry {
  // ===========================================================================
  // Registered Event Rehydrators
  // ===========================================================================

  private readonly rehydrators = new Map<string, FinancialEventRehydrator>([
    // =========================================================================
    // Financial Payment
    // =========================================================================

    [
      'FinancialPaymentCreated:1',
      (metadata, payload): DomainEvent =>
        FinancialPaymentCreatedEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialPaymentAttemptAdded:1',
      (metadata, payload): DomainEvent =>
        FinancialPaymentAttemptAddedEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialPaymentProcessing:1',
      (metadata, payload): DomainEvent =>
        FinancialPaymentProcessingEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialPaymentSucceeded:1',
      (metadata, payload): DomainEvent =>
        FinancialPaymentSucceededEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialPaymentFailed:1',
      (metadata, payload): DomainEvent =>
        FinancialPaymentFailedEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialPaymentCancelled:1',
      (metadata, payload): DomainEvent =>
        FinancialPaymentCancelledEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialPaymentExpired:1',
      (metadata, payload): DomainEvent =>
        FinancialPaymentExpiredEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialPaymentTransactionLinked:1',
      (metadata, payload): DomainEvent =>
        FinancialPaymentTransactionLinkedEvent.rehydrate(metadata, payload),
    ],

    // =========================================================================
    // Financial Account
    // =========================================================================

    [
      'FinancialAccountCreated:1',
      (metadata, payload): DomainEvent =>
        FinancialAccountCreatedEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialAccountActivated:1',
      (metadata, payload): DomainEvent =>
        FinancialAccountActivatedEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialAccountSuspended:1',
      (metadata, payload): DomainEvent =>
        FinancialAccountSuspendedEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialAccountClosed:1',
      (metadata, payload): DomainEvent =>
        FinancialAccountClosedEvent.rehydrate(metadata, payload),
    ],

    // =========================================================================
    // Financial Account Hold
    // =========================================================================

    [
      'FinancialAccountHoldCreated:1',
      (metadata, payload): DomainEvent =>
        FinancialAccountHoldCreatedEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialAccountHoldCaptured:1',
      (metadata, payload): DomainEvent =>
        FinancialAccountHoldCapturedEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialAccountHoldReleased:1',
      (metadata, payload): DomainEvent =>
        FinancialAccountHoldReleasedEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialAccountHoldCancelled:1',
      (metadata, payload): DomainEvent =>
        FinancialAccountHoldCancelledEvent.rehydrate(metadata, payload),
    ],

    // =========================================================================
    // Financial Settlement
    // =========================================================================

    [
      'FinancialSettlementCreated:1',
      (metadata, payload): DomainEvent =>
        FinancialSettlementCreatedEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialSettlementProcessing:1',
      (metadata, payload): DomainEvent =>
        FinancialSettlementProcessingEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialSettlementAllocated:1',
      (metadata, payload): DomainEvent =>
        FinancialSettlementAllocatedEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialSettlementCompleted:1',
      (metadata, payload): DomainEvent =>
        FinancialSettlementCompletedEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialSettlementFailed:1',
      (metadata, payload): DomainEvent =>
        FinancialSettlementFailedEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialSettlementCancelled:1',
      (metadata, payload): DomainEvent =>
        FinancialSettlementCancelledEvent.rehydrate(metadata, payload),
    ],

    // =========================================================================
    // Financial Account Withdrawal
    // =========================================================================

    [
      'FinancialAccountWithdrawalRequested:1',
      (metadata, payload): DomainEvent =>
        FinancialAccountWithdrawalRequestedEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialAccountWithdrawalProcessing:1',
      (metadata, payload): DomainEvent =>
        FinancialAccountWithdrawalProcessingEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialAccountWithdrawalCompleted:1',
      (metadata, payload): DomainEvent =>
        FinancialAccountWithdrawalCompletedEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialAccountWithdrawalFailed:1',
      (metadata, payload): DomainEvent =>
        FinancialAccountWithdrawalFailedEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialAccountWithdrawalCancelled:1',
      (metadata, payload): DomainEvent =>
        FinancialAccountWithdrawalCancelledEvent.rehydrate(metadata, payload),
    ],

    // =========================================================================
    // Financial Disbursement
    // =========================================================================

    [
      'FinancialDisbursementCreated:1',
      (metadata, payload): DomainEvent =>
        FinancialDisbursementCreatedEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialDisbursementProcessing:1',
      (metadata, payload): DomainEvent =>
        FinancialDisbursementProcessingEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialDisbursementAttemptSucceeded:1',
      (metadata, payload): DomainEvent =>
        FinancialDisbursementAttemptSucceededEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialDisbursementCompleted:1',
      (metadata, payload): DomainEvent =>
        FinancialDisbursementCompletedEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialDisbursementFailed:1',
      (metadata, payload): DomainEvent =>
        FinancialDisbursementFailedEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialDisbursementCancelled:1',
      (metadata, payload): DomainEvent =>
        FinancialDisbursementCancelledEvent.rehydrate(metadata, payload),
    ],

    // =========================================================================
    // Financial Transactions
    // =========================================================================

    [
      'FinancialTransactionCreated:1',
      (metadata, payload): DomainEvent =>
        FinancialTransactionCreatedEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialTransactionCompleted:1',
      (metadata, payload): DomainEvent =>
        FinancialTransactionCompletedEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialTransactionFailed:1',
      (metadata, payload): DomainEvent =>
        FinancialTransactionFailedEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialTransactionCancelled:1',
      (metadata, payload): DomainEvent =>
        FinancialTransactionCancelledEvent.rehydrate(metadata, payload),
    ],
    [
      'FinancialTransactionReversed:1',
      (metadata, payload): DomainEvent =>
        FinancialTransactionReversedEvent.rehydrate(metadata, payload),
    ],
  ]);

  // ===========================================================================
  // Supports
  // ===========================================================================

  public supports(eventName: string, eventVersion: number): boolean {
    return this.rehydrators.has(`${eventName}:${eventVersion}`);
  }

  // ===========================================================================
  // Rehydrate
  // ===========================================================================

  public rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): DomainEvent {
    const key = `${metadata.eventName}:${metadata.eventVersion}`;

    const rehydrator = this.rehydrators.get(key);

    if (!rehydrator) {
      throw new Error(
        `Unsupported Financial event: ${metadata.eventName} ` +
          `version ${metadata.eventVersion}`,
      );
    }

    return rehydrator(metadata, payload);
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default FinancialEventRegistry;
