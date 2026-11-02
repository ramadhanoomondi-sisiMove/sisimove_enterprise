import { DomainEvent } from '../../../../foundation/kernel/domain/domain-event';

import type { EventMetadata } from '../../../../foundation/kernel/domain/domain-event';

export abstract class FinancialDomainEvent extends DomainEvent {
  protected constructor(
    aggregateId: string,
    aggregateType: string,
    eventName: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
    restoredMetadata?: EventMetadata,
  ) {
    super(
      aggregateId,
      aggregateType,
      eventName,
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
      'SisiMove Enterprise',
      restoredMetadata,
    );
  }

  protected getBasePayload(): Record<string, unknown> {
    return {};
  }
}
