// -----------------------------------------------------------------------------
// Financial Payment Provider Domain Event
// -----------------------------------------------------------------------------

import { FinancialDomainEvent } from '../../../financial/domain/events';

/**
 * Base event for the Financial Payment Provider aggregate.
 *
 * Provider capabilities are owned by the provider aggregate, so capability
 * changes also identify FinancialPaymentProvider as the emitting aggregate.
 */
export abstract class FinancialPaymentProviderDomainEvent extends FinancialDomainEvent {
  protected constructor(
    aggregateId: string,
    eventName: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      'FinancialPaymentProvider',
      eventName,
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );
  }

  protected override getBasePayload(): Record<string, unknown> {
    return {};
  }
}
