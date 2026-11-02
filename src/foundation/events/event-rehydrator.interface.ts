import type { DomainEvent } from '../kernel/domain/domain-event';
import type { EventMetadata } from '../kernel/domain/domain-event';

export interface EventRehydrator {
  supports(eventName: string, eventVersion: number): boolean;

  rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): DomainEvent;
}
