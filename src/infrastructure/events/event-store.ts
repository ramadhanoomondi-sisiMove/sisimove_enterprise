import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import type { EventStore as EventStoreInterface } from '../../foundation/events/event-store.interface';
import type { DomainEvent } from '../../foundation/kernel/domain/domain-event';
import type { EventMetadata } from '../../foundation/kernel/domain/domain-event';

import { PrismaTransactionContext } from '../database/prisma/prisma-transaction.context';
import { EventRehydratorRegistry } from './event-rehydrator.registry';

@Injectable()
export class EventStore implements EventStoreInterface {
  public constructor(
    private readonly transactionContext: PrismaTransactionContext,
    private readonly rehydratorRegistry: EventRehydratorRegistry,
  ) {}

  public async append(events: readonly DomainEvent[]): Promise<void> {
    if (events.length === 0) {
      return;
    }

    const prisma = this.transactionContext.getClient();

    for (const event of events) {
      const metadata = event.metadata;

      // Serialize the event and remove metadata from the JSON payload.
      const payload = { ...event.toJSON() };
      delete payload.metadata;

      await prisma.storedEvent.create({
        data: {
          eventId: metadata.eventId,
          eventName: metadata.eventName,
          eventVersion: metadata.eventVersion,
          aggregateId: metadata.aggregateId,
          aggregateType: metadata.aggregateType,
          correlationId: metadata.correlationId ?? null,
          causationId: metadata.causationId ?? null,
          eventTimestamp: metadata.eventTimestamp,
          producerPlatform: metadata.producerPlatform,
          eventSchemaVersion: metadata.eventSchemaVersion,
          payload: payload as Prisma.InputJsonValue,
          outboxMessage: {
            create: {},
          },
        },
      });
    }
  }

  public async getByAggregateId(
    aggregateId: string,
  ): Promise<readonly DomainEvent[]> {
    const prisma = this.transactionContext.getClient();

    const storedEvents = await prisma.storedEvent.findMany({
      where: {
        aggregateId,
      },
      orderBy: [{ eventTimestamp: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
    });

    return storedEvents.map((storedEvent) => {
      const metadata: EventMetadata = {
        eventId: storedEvent.eventId,
        eventName: storedEvent.eventName,
        eventVersion: storedEvent.eventVersion,
        aggregateId: storedEvent.aggregateId,
        aggregateType: storedEvent.aggregateType,
        ...(storedEvent.correlationId !== null && {
          correlationId: storedEvent.correlationId,
        }),
        ...(storedEvent.causationId !== null && {
          causationId: storedEvent.causationId,
        }),
        eventTimestamp: storedEvent.eventTimestamp,
        producerPlatform: storedEvent.producerPlatform,
        eventSchemaVersion: storedEvent.eventSchemaVersion,
      };

      if (
        typeof storedEvent.payload !== 'object' ||
        storedEvent.payload === null ||
        Array.isArray(storedEvent.payload)
      ) {
        throw new Error(
          `Invalid stored payload for event "${storedEvent.eventId}".`,
        );
      }

      const payload = storedEvent.payload as Record<string, unknown>;

      return this.rehydratorRegistry.rehydrate(metadata, payload);
    });
  }
}
