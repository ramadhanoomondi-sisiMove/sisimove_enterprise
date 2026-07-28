//src/foundation/events/event-publisher.interface.ts
import type { DomainEvent } from '../kernel/domain/domain-event';

export interface EventPublisher {
  publish(event: DomainEvent): Promise<void>;

  publishAll(events: readonly DomainEvent[]): Promise<void>;
}
