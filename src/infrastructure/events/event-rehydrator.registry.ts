import { Injectable } from '@nestjs/common';

import type { DomainEvent } from '../../foundation/kernel/domain/domain-event';
import type { EventMetadata } from '../../foundation/kernel/domain/domain-event';
import type { EventRehydrator } from '../../foundation/events/event-rehydrator.interface';

@Injectable()
export class EventRehydratorRegistry {
  private readonly rehydrators: EventRehydrator[] = [];

  public register(rehydrator: EventRehydrator): void {
    if (this.rehydrators.includes(rehydrator)) {
      throw new Error('This event rehydrator instance is already registered.');
    }

    this.rehydrators.push(rehydrator);
  }

  public supports(eventName: string, eventVersion: number): boolean {
    return this.rehydrators.some((rehydrator) =>
      rehydrator.supports(eventName, eventVersion),
    );
  }

  public rehydrate(
    metadata: EventMetadata,
    payload: Record<string, unknown>,
  ): DomainEvent {
    const matchingRehydrators = this.rehydrators.filter((rehydrator) =>
      rehydrator.supports(metadata.eventName, metadata.eventVersion),
    );

    if (matchingRehydrators.length === 0) {
      throw new Error(
        `No event rehydrator registered for "${metadata.eventName}" version ${metadata.eventVersion}.`,
      );
    }

    if (matchingRehydrators.length > 1) {
      throw new Error(
        `Multiple event rehydrators registered for "${metadata.eventName}" version ${metadata.eventVersion}.`,
      );
    }

    const rehydrator = matchingRehydrators[0];

    if (rehydrator === undefined) {
      throw new Error(
        `No event rehydrator registered for "${metadata.eventName}" version ${metadata.eventVersion}.`,
      );
    }

    return rehydrator.rehydrate(metadata, payload);
  }
}
