import { Injectable } from '@nestjs/common';
import { OutboxMessageStatus } from '@prisma/client';

import type { EventMetadata } from '../../../foundation/kernel/domain/domain-event';

import { EventBus } from '../../events/event-bus';
import { EventRehydratorRegistry } from '../../events/event-rehydrator.registry';
import { PrismaService } from '../../database/prisma/prisma.service';

import { OutboxMessageClaimer } from './outbox-message-claimer';
import { OUTBOX_DEFAULTS } from './outbox.constants';

@Injectable()
export class OutboxDispatcher {
  public constructor(
    private readonly claimer: OutboxMessageClaimer,
    private readonly eventBus: EventBus,
    private readonly rehydratorRegistry: EventRehydratorRegistry,
    private readonly prisma: PrismaService,
  ) {}

  public async dispatchBatch(): Promise<{
    claimed: number;
    published: number;
    retried: number;
    deadLettered: number;
  }> {
    const messages = await this.claimer.claimBatch(
      OUTBOX_DEFAULTS.BATCH_SIZE,
      OUTBOX_DEFAULTS.LOCK_DURATION_MS,
    );

    const result = {
      claimed: messages.length,
      published: 0,
      retried: 0,
      deadLettered: 0,
    };

    for (const message of messages) {
      try {
        const storedEvent = message.storedEvent;

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

        const event = this.rehydratorRegistry.rehydrate(
          metadata,
          storedEvent.payload,
        );

        await this.eventBus.publish(event);

        const published = await this.prisma.outboxMessage.updateMany({
          where: {
            id: message.id,
            status: OutboxMessageStatus.PROCESSING,
            lockedAt: message.lockedAt,
          },
          data: {
            status: OutboxMessageStatus.PUBLISHED,
            publishedAt: new Date(),
            lockedAt: null,
            lockedUntil: null,
            lastError: null,
          },
        });

        if (published.count === 1) {
          result.published += 1;
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        const now = new Date();
        const shouldDeadLetter =
          message.attempts >= OUTBOX_DEFAULTS.MAX_ATTEMPTS;

        if (shouldDeadLetter) {
          const updated = await this.prisma.outboxMessage.updateMany({
            where: {
              id: message.id,
              status: OutboxMessageStatus.PROCESSING,
              lockedAt: message.lockedAt,
            },
            data: {
              status: OutboxMessageStatus.DEAD_LETTERED,
              lockedAt: null,
              lockedUntil: null,
              lastError: errorMessage,
            },
          });

          if (updated.count === 1) {
            result.deadLettered += 1;
          }
        } else {
          const retryDelay = Math.min(
            OUTBOX_DEFAULTS.INITIAL_RETRY_DELAY_MS *
              2 ** (message.attempts - 1),
            OUTBOX_DEFAULTS.MAX_RETRY_DELAY_MS,
          );

          const updated = await this.prisma.outboxMessage.updateMany({
            where: {
              id: message.id,
              status: OutboxMessageStatus.PROCESSING,
              lockedAt: message.lockedAt,
            },
            data: {
              status: OutboxMessageStatus.PENDING,
              availableAt: new Date(now.getTime() + retryDelay),
              lockedAt: null,
              lockedUntil: null,
              lastError: errorMessage,
            },
          });

          if (updated.count === 1) {
            result.retried += 1;
          }
        }
      }
    }

    return result;
  }
}
