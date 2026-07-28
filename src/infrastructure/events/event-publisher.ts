// src/infrastructure/events/event-publisher.ts

import { Injectable } from '@nestjs/common';

import { EventPublisher as EventPublisherInterface } from '../../foundation/events/event-publisher.interface';
import { DomainEvent } from '../../foundation/kernel/domain/domain-event';

import { EventBus } from './event-bus';
import { EventStore } from './event-store';

@Injectable()
export class EventPublisher implements EventPublisherInterface {
  constructor(
    private readonly eventBus: EventBus,
    private readonly eventStore: EventStore,
  ) {}

  async publish(event: DomainEvent): Promise<void> {
    await this.eventStore.append([event]);
    await this.eventBus.publish(event);
  }

  async publishAll(events: readonly DomainEvent[]): Promise<void> {
    await this.eventStore.append(events);
    await this.eventBus.publishAll(events);
  }
}
