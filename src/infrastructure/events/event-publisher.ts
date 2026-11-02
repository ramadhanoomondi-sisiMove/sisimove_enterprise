import { Injectable } from '@nestjs/common';

import type { EventPublisher as EventPublisherInterface } from '../../foundation/events/event-publisher.interface';
import type { DomainEvent } from '../../foundation/kernel/domain/domain-event';

import { EventStore } from './event-store';

@Injectable()
export class EventPublisher implements EventPublisherInterface {
  public constructor(private readonly eventStore: EventStore) {}

  public async publish(event: DomainEvent): Promise<void> {
    await this.eventStore.append([event]);
  }

  public async publishAll(events: readonly DomainEvent[]): Promise<void> {
    await this.eventStore.append(events);
  }
}
