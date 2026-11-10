// -----------------------------------------------------------------------------
// Financial Domain — Event Registry
// -----------------------------------------------------------------------------
//
// Central registry responsible for rehydrating Financial domain events.
//
// Registered event families:
//
// 1. Financial Payment
// 2. Financial Account Withdrawal
// 3. Financial Disbursement
//
// Responsibilities:
//
// - Register supported financial domain events.
// - Resolve event rehydrators using event name and version.
// - Rehydrate events using their static rehydrate() methods.
// - Preserve original event metadata.
// - Reject unsupported event names and versions.
//
// Event rehydration is delegated to individual event classes.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation — Domain Events
// -----------------------------------------------------------------------------

import type { DomainEvent } from '../../../../../foundation/kernel/domain/domain-event';

import type { EventMetadata } from '../../../../../foundation/kernel/domain/domain-event';

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

import { FinancialDisbursementCompletedEvent } from '../financial-disbursement-completed.event';

import { FinancialDisbursementFailedEvent } from '../financial-disbursement-failed.event';

import { FinancialDisbursementCancelledEvent } from '../financial-disbursement-cancelled.event';

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
    // -------------------------------------------------------------------------
    // Financial Payment
    // -------------------------------------------------------------------------

    [
      'FinancialPaymentCreated:1',
      (metadata, payload) =>
        FinancialPaymentCreatedEvent.rehydrate(metadata, payload),
    ],

    [
      'FinancialPaymentAttemptAdded:1',
      (metadata, payload) =>
        FinancialPaymentAttemptAddedEvent.rehydrate(metadata, payload),
    ],

    [
      'FinancialPaymentProcessing:1',
      (metadata, payload) =>
        FinancialPaymentProcessingEvent.rehydrate(metadata, payload),
    ],

    [
      'FinancialPaymentSucceeded:1',
      (metadata, payload) =>
        FinancialPaymentSucceededEvent.rehydrate(metadata, payload),
    ],

    [
      'FinancialPaymentFailed:1',
      (metadata, payload) =>
        FinancialPaymentFailedEvent.rehydrate(metadata, payload),
    ],

    [
      'FinancialPaymentCancelled:1',
      (metadata, payload) =>
        FinancialPaymentCancelledEvent.rehydrate(metadata, payload),
    ],

    [
      'FinancialPaymentExpired:1',
      (metadata, payload) =>
        FinancialPaymentExpiredEvent.rehydrate(metadata, payload),
    ],

    [
      'FinancialPaymentTransactionLinked:1',
      (metadata, payload) =>
        FinancialPaymentTransactionLinkedEvent.rehydrate(metadata, payload),
    ],

    // -------------------------------------------------------------------------
    // Financial Account Withdrawal
    // -------------------------------------------------------------------------

    [
      'FinancialAccountWithdrawalRequested:1',
      (metadata, payload) =>
        FinancialAccountWithdrawalRequestedEvent.rehydrate(metadata, payload),
    ],

    [
      'FinancialAccountWithdrawalProcessing:1',
      (metadata, payload) =>
        FinancialAccountWithdrawalProcessingEvent.rehydrate(metadata, payload),
    ],

    [
      'FinancialAccountWithdrawalCompleted:1',
      (metadata, payload) =>
        FinancialAccountWithdrawalCompletedEvent.rehydrate(metadata, payload),
    ],

    [
      'FinancialAccountWithdrawalFailed:1',
      (metadata, payload) =>
        FinancialAccountWithdrawalFailedEvent.rehydrate(metadata, payload),
    ],

    [
      'FinancialAccountWithdrawalCancelled:1',
      (metadata, payload) =>
        FinancialAccountWithdrawalCancelledEvent.rehydrate(metadata, payload),
    ],

    // -------------------------------------------------------------------------
    // Financial Disbursement
    // -------------------------------------------------------------------------

    [
      'FinancialDisbursementCreated:1',
      (metadata, payload) =>
        FinancialDisbursementCreatedEvent.rehydrate(metadata, payload),
    ],

    [
      'FinancialDisbursementProcessing:1',
      (metadata, payload) =>
        FinancialDisbursementProcessingEvent.rehydrate(metadata, payload),
    ],

    [
      'FinancialDisbursementCompleted:1',
      (metadata, payload) =>
        FinancialDisbursementCompletedEvent.rehydrate(metadata, payload),
    ],

    [
      'FinancialDisbursementFailed:1',
      (metadata, payload) =>
        FinancialDisbursementFailedEvent.rehydrate(metadata, payload),
    ],

    [
      'FinancialDisbursementCancelled:1',
      (metadata, payload) =>
        FinancialDisbursementCancelledEvent.rehydrate(metadata, payload),
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

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default FinancialEventRegistry;
