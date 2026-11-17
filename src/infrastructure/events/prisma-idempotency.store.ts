import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';

import type { IdempotencyStore } from '../../foundation/events/idempotency.interface';

import {
  PrismaTransactionContext,
  type PrismaClientLike,
} from '../database/prisma/prisma-transaction.context';

import { PrismaService } from '../database/prisma/prisma.service';

@Injectable()
export class PrismaIdempotencyStore implements IdempotencyStore {
  public constructor(
    private readonly transactionContext: PrismaTransactionContext,
  ) {}

  /**
   * Executes work in a transaction.
   *
   * Reuses the ambient transaction when one already exists.
   * Otherwise, creates a transaction using the root PrismaService.
   */
  private async inTransaction<T>(
    work: (prisma: PrismaClientLike) => Promise<T>,
  ): Promise<T> {
    const prisma = this.transactionContext.getClient();

    if (prisma instanceof PrismaService) {
      return prisma.$transaction(async (tx) => {
        return this.transactionContext.run(tx, () => work(tx));
      });
    }

    return work(prisma);
  }

  /**
   * Locks the stored event row.
   *
   * Claim acquisition and successful processing use this same
   * lock to serialize operations for a given event.
   */
  private async lockStoredEvent(
    prisma: PrismaClientLike,
    eventId: string,
  ): Promise<string> {
    const rows = await prisma.$queryRaw<Array<{ id: string }>>(
      Prisma.sql`
        SELECT id
        FROM stored_events
        WHERE "eventId" = ${eventId}
        FOR UPDATE
      `,
    );

    const storedEvent = rows.at(0);

    if (storedEvent === undefined) {
      throw new Error(`Stored event "${eventId}" was not found.`);
    }

    return storedEvent.id;
  }

  /**
   * Returns true if this consumer has already processed the event.
   */
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

  /**
   * Atomically acquires a processing claim.
   *
   * The stored event row is locked before checking processed events
   * or creating/reclaiming a processing claim.
   */
  public async acquireClaim(
    consumerName: string,
    eventId: string,
    leaseDurationMs: number,
  ): Promise<string | null> {
    if (!Number.isSafeInteger(leaseDurationMs) || leaseDurationMs <= 0) {
      throw new Error('Claim lease duration must be a positive safe integer.');
    }

    return this.inTransaction(async (prisma) => {
      const storedEventId = await this.lockStoredEvent(prisma, eventId);

      const processedEvent = await prisma.processedEvent.findFirst({
        where: {
          consumerName,
          storedEventId,
        },
        select: {
          id: true,
        },
      });

      if (processedEvent !== null) {
        return null;
      }

      const claimToken = randomUUID();

      const claims = await prisma.$queryRaw<
        Array<{ claimToken: string }>
      >(Prisma.sql`
        INSERT INTO event_processing_claims (
          id,
          "storedEventId",
          "consumerName",
          "claimToken",
          "claimedAt",
          "lockedUntil",
          attempts,
          "createdAt",
          "updatedAt"
        )
        VALUES (
          ${randomUUID()},
          ${storedEventId},
          ${consumerName},
          ${claimToken},
          clock_timestamp(),
          clock_timestamp() + (
            ${leaseDurationMs} * INTERVAL '1 millisecond'
          ),
          1,
          clock_timestamp(),
          clock_timestamp()
        )
        ON CONFLICT ("consumerName", "storedEventId")
        DO UPDATE SET
          "claimToken" = EXCLUDED."claimToken",
          "claimedAt" = clock_timestamp(),
          "lockedUntil" = EXCLUDED."lockedUntil",
          attempts = event_processing_claims.attempts + 1,
          "updatedAt" = clock_timestamp()
        WHERE event_processing_claims."lockedUntil"
          <= clock_timestamp()
        RETURNING "claimToken"
      `);

      return claims.at(0)?.claimToken ?? null;
    });
  }

  /**
   * Atomically records successful processing and releases the claim.
   *
   * Only the worker holding the current, unexpired claim token can
   * complete processing.
   *
   * The stored event row is locked first, using the same lock
   * strategy as acquireClaim().
   */
  public async markProcessed(
    consumerName: string,
    eventId: string,
    claimToken: string,
  ): Promise<void> {
    await this.inTransaction(async (prisma) => {
      const storedEventId = await this.lockStoredEvent(prisma, eventId);

      const claims = await prisma.$queryRaw<
        Array<{
          id: string;
          storedEventId: string;
        }>
      >(Prisma.sql`
        SELECT
          id,
          "storedEventId"
        FROM event_processing_claims
        WHERE "storedEventId" = ${storedEventId}
          AND "consumerName" = ${consumerName}
          AND "claimToken" = ${claimToken}
          AND "lockedUntil" > clock_timestamp()
        FOR UPDATE
      `);

      const ownedClaim = claims.at(0);

      if (ownedClaim === undefined) {
        throw new Error(
          `Cannot mark event "${eventId}" as processed: claim ownership is missing, stale, or expired.`,
        );
      }

      const insertedEvents = await prisma.$queryRaw<
        Array<{ id: string }>
      >(Prisma.sql`
        INSERT INTO processed_events (
          id,
          "storedEventId",
          "consumerName",
          "processedAt"
        )
        VALUES (
          ${randomUUID()},
          ${storedEventId},
          ${consumerName},
          clock_timestamp()
        )
        ON CONFLICT ("consumerName", "storedEventId")
        DO NOTHING
        RETURNING id
      `);

      if (insertedEvents.length === 0) {
        throw new Error(
          `Cannot mark event "${eventId}" as processed: a processed-event record already exists.`,
        );
      }

      const deletedClaims = await prisma.$executeRaw(
        Prisma.sql`
          DELETE FROM event_processing_claims
          WHERE id = ${ownedClaim.id}
            AND "storedEventId" = ${storedEventId}
            AND "consumerName" = ${consumerName}
            AND "claimToken" = ${claimToken}
            AND "lockedUntil" > clock_timestamp()
        `,
      );

      if (deletedClaims !== 1) {
        throw new Error(
          `Cannot complete processing for event "${eventId}": the processing claim expired or ownership changed.`,
        );
      }
    });
  }
}
