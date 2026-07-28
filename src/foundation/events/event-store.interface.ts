//src/foundation/events/event-store.interface.ts
import type { DomainEvent } from '../kernel/domain/domain-event';

export interface EventStore {
  /**
   * Appends events to the store.
   * Events must never be updated or deleted after persistence.
   */
  append(events: readonly DomainEvent[]): Promise<void>;

  /**
   * Retrieves events for an aggregate in chronological order.
   */
  getByAggregateId(aggregateId: string): Promise<readonly DomainEvent[]>;
}
