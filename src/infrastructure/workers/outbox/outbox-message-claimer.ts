import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../database/prisma/prisma.service';

export type ClaimedOutboxMessage = Prisma.OutboxMessageGetPayload<{
  include: {
    storedEvent: true;
  };
}>;

@Injectable()
export class OutboxMessageClaimer {
  public constructor(private readonly prisma: PrismaService) {}

  public async claimBatch(
    batchSize = 10,
    lockDurationMs = 60_000,
  ): Promise<ClaimedOutboxMessage[]> {
    if (!Number.isInteger(batchSize) || batchSize < 1) {
      throw new Error('Batch size must be a positive integer.');
    }

    if (!Number.isInteger(lockDurationMs) || lockDurationMs < 1) {
      throw new Error('Lock duration must be a positive integer.');
    }

    const now = new Date();
    const lockedUntil = new Date(now.getTime() + lockDurationMs);

    return this.prisma.$transaction(async (tx) => {
      const claimedRows = await tx.$queryRaw<Array<{ id: string }>>`
        WITH candidates AS (
          SELECT id
          FROM outbox_messages
          WHERE
            (
              "status" = 'PENDING'::"OutboxMessageStatus"
              AND "availableAt" <= ${now}
            )
            OR
            (
              "status" = 'PROCESSING'::"OutboxMessageStatus"
              AND "lockedUntil" IS NOT NULL
              AND "lockedUntil" <= ${now}
            )
          ORDER BY "availableAt" ASC, "createdAt" ASC, id ASC
          FOR UPDATE SKIP LOCKED
          LIMIT ${batchSize}
        )
        UPDATE outbox_messages AS message
        SET
          "status" = 'PROCESSING'::"OutboxMessageStatus",
          "attempts" = message."attempts" + 1,
          "lockedAt" = ${now},
          "lockedUntil" = ${lockedUntil},
          "lastAttemptAt" = ${now},
          "updatedAt" = ${now}
        FROM candidates
        WHERE message.id = candidates.id
        RETURNING message.id
      `;

      const claimedIds = claimedRows.map((row) => row.id);

      if (claimedIds.length === 0) {
        return [];
      }

      return tx.outboxMessage.findMany({
        where: {
          id: {
            in: claimedIds,
          },
        },
        include: {
          storedEvent: true,
        },
        orderBy: [{ availableAt: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }],
      });
    });
  }
}
