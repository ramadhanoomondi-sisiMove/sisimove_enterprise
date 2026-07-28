// src/infrastructure/events/event-store.ts

import { Injectable } from '@nestjs/common';

import { EventStore as EventStoreInterface } from '../../foundation/events/event-store.interface';
import { DomainEvent } from '../../foundation/kernel/domain/domain-event';

@Injectable()
export class EventStore implements EventStoreInterface {
  private readonly events: DomainEvent[] = [];

  append(events: readonly DomainEvent[]): Promise<void> {
    this.events.push(...events);

    return Promise.resolve();
  }

  getByAggregateId(aggregateId: string): Promise<readonly DomainEvent[]> {
    const events = this.events.filter(
      (event) => event.metadata.aggregateId === aggregateId,
    );

    return Promise.resolve(events);
  }
}
