// src/infrastructure/events/event-bus.ts

import { Injectable } from '@nestjs/common';

import { EventBus as EventBusInterface } from '../../foundation/events/event-bus.interface';
import { DomainEvent } from '../../foundation/kernel/domain/domain-event';

type EventHandler<T extends DomainEvent> = (event: T) => Promise<void>;

@Injectable()
export class EventBus implements EventBusInterface {
  private readonly handlers = new Map<string, EventHandler<DomainEvent>[]>();

  async publish(event: DomainEvent): Promise<void> {
    const eventName = event.metadata.eventName;
    const handlers = this.handlers.get(eventName) ?? [];

    await Promise.all(handlers.map((handler) => handler(event)));
  }

  async publishAll(events: readonly DomainEvent[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }

  subscribe<T extends DomainEvent>(
    eventName: string,
    handler: EventHandler<T>,
  ): void {
    const existingHandlers = this.handlers.get(eventName) ?? [];

    this.handlers.set(eventName, [
      ...existingHandlers,
      handler as EventHandler<DomainEvent>,
    ]);
  }
}
