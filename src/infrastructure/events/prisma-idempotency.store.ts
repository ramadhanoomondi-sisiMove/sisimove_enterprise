import { Injectable } from '@nestjs/common';

import type { IdempotencyStore } from '../../foundation/events/idempotency.interface';

import { PrismaTransactionContext } from '../database/prisma/prisma-transaction.context';

@Injectable()
export class PrismaIdempotencyStore implements IdempotencyStore {
  public constructor(
    private readonly transactionContext: PrismaTransactionContext,
  ) {}

  public async exists(consumerName: string, eventId: string): Promise<boolean> {
    const prisma = this.transactionContext.getClient();

    const processedEvent = await prisma.processedEvent.findFirst({
      where: {
        consumerName,
        storedEvent: {
          eventId,
        },
      },
      select: {
        id: true,
      },
    });

    return processedEvent !== null;
  }

  public async markProcessed(
    consumerName: string,
    eventId: string,
  ): Promise<void> {
    const prisma = this.transactionContext.getClient();

    const storedEvent = await prisma.storedEvent.findUnique({
      where: {
        eventId,
      },
      select: {
        id: true,
      },
    });

    if (storedEvent === null) {
      throw new Error(
        `Cannot mark event "${eventId}" as processed: stored event was not found.`,
      );
    }

    await prisma.processedEvent.createMany({
      data: [
        {
          consumerName,
          storedEventId: storedEvent.id,
        },
      ],
      skipDuplicates: true,
    });
  }
}
