import type { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';
import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';

import { FinancialPaymentCreatedEvent } from './financial-payment-created.event';
import { FinancialPaymentAttemptAddedEvent } from './financial-payment-attempt-added.event';
import { FinancialPaymentProcessingEvent } from './financial-payment-processing.event';
import { FinancialPaymentSucceededEvent } from './financial-payment-succeeded.event';
import { FinancialPaymentFailedEvent } from './financial-payment-failed.event';
import { FinancialPaymentCancelledEvent } from './financial-payment-cancelled.event';
import { FinancialPaymentExpiredEvent } from './financial-payment-expired.event';
import { FinancialPaymentTransactionLinkedEvent } from './financial-payment-transaction-linked.event';

type PaymentEventRehydrator = (
  metadata: EventMetadata,
  payload: Record<string, unknown>,
) => DomainEvent;

export class FinancialPaymentEventRegistry {
  private readonly rehydrators = new Map<string, PaymentEventRehydrator>([
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
  ]);
  public supports(eventName: string, eventVersion: number): boolean {
    return this.rehydrators.has(`${eventName}:${eventVersion}`);
  }

  public rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): DomainEvent {
    const key = `${metadata.eventName}:${metadata.eventVersion}`;
    const rehydrator = this.rehydrators.get(key);

    if (!rehydrator) {
      throw new Error(
        `Unsupported Financial Payment event: ${metadata.eventName} version ${metadata.eventVersion}`,
      );
    }

    return rehydrator(metadata, payload);
  }
}
