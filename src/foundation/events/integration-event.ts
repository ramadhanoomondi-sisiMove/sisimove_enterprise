//src/foundation/events/integration-event.ts
import { DomainEvent } from '../kernel/domain/domain-event';

export abstract class IntegrationEvent extends DomainEvent {
  protected constructor(
    aggregateId: string,
    aggregateType: string,
    eventName: string,
    correlationId: string,
    causationId?: string,
    eventVersion = 1,
    eventSchemaVersion = '1.0.0',
  ) {
    super(
      aggregateId,
      aggregateType,
      eventName,
      correlationId,
      causationId,
      eventVersion,
      eventSchemaVersion,
    );
  }
}
