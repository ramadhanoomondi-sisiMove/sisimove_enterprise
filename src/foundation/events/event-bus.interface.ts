//src/foundation/events/event-bus.interface.ts
import type { DomainEvent } from '../kernel/domain/domain-event';

export interface EventBus {
  publish(event: DomainEvent): Promise<void>;

  publishAll(events: readonly DomainEvent[]): Promise<void>;

  subscribe<T extends DomainEvent>(
    eventName: string,
    handler: (event: T) => Promise<void>,
  ): void;
}
