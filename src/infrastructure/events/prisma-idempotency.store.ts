import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Prisma } from '@prisma/client';

import type { IdempotencyStore } from '../../foundation/events/idempotency.interface';

import { PrismaTransactionContext } from '../database/prisma/prisma-transaction.context';

@Injectable()
export class PrismaIdempotencyStore implements IdempotencyStore {
  public constructor(
    private readonly transactionContext: PrismaTransactionContext,
  ) {}

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
   * PostgreSQL guarantees that only one worker can acquire an
   * unexpired claim for the same consumer and event.
   */
  public async acquireClaim(
    consumerName: string,
    eventId: string,
    leaseDurationMs: number,
  ): Promise<string | null> {
    if (!Number.isSafeInteger(leaseDurationMs) || leaseDurationMs <= 0) {
      throw new Error('Claim lease duration must be a positive safe integer.');
    }

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
        `Cannot acquire processing claim: stored event "${eventId}" was not found.`,
      );
    }

    const claimToken = randomUUID();
    const now = new Date();
    const lockedUntil = new Date(now.getTime() + leaseDurationMs);

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
      SELECT
        ${randomUUID()},
        ${storedEvent.id},
        ${consumerName},
        ${claimToken},
        NOW(),
        ${lockedUntil},
        1,
        NOW(),
        NOW()
      WHERE NOT EXISTS (
        SELECT 1
        FROM processed_events pe
        WHERE pe."storedEventId" = ${storedEvent.id}
          AND pe."consumerName" = ${consumerName}
      )
      ON CONFLICT ("consumerName", "storedEventId")
      DO UPDATE SET
        "claimToken" = EXCLUDED."claimToken",
        "claimedAt" = NOW(),
        "lockedUntil" = EXCLUDED."lockedUntil",
        attempts = event_processing_claims.attempts + 1,
        "updatedAt" = NOW()
      WHERE event_processing_claims."lockedUntil" <= NOW()
      RETURNING "claimToken"
    `);

    const claim = claims.at(0);

    if (claim === undefined) {
      return null;
    }

    return claim.claimToken;
  }

  /**
   * Atomically records successful processing and releases the claim.
   *
   * Only the worker holding the current claim token can complete
   * processing. A stale worker cannot complete a newer worker's claim.
   */
  public async markProcessed(
    consumerName: string,
    eventId: string,
    claimToken: string,
  ): Promise<void> {
    const prisma = this.transactionContext.getClient();

    const completedClaims = await prisma.$queryRaw<
      Array<{ storedEventId: string }>
    >(Prisma.sql`
      WITH owned_claim AS (
        DELETE FROM event_processing_claims AS claim
        USING stored_events AS stored_event
        WHERE claim."storedEventId" = stored_event.id
          AND stored_event."eventId" = ${eventId}
          AND claim."consumerName" = ${consumerName}
          AND claim."claimToken" = ${claimToken}
        RETURNING claim."storedEventId"
      ),
      inserted_event AS (
        INSERT INTO processed_events (
          id,
          "storedEventId",
          "consumerName",
          "processedAt"
        )
        SELECT
          ${randomUUID()},
          owned_claim."storedEventId",
          ${consumerName},
          NOW()
        FROM owned_claim
        ON CONFLICT ("consumerName", "storedEventId")
        DO NOTHING
        RETURNING id
      )
      SELECT "storedEventId"
      FROM owned_claim
    `);

    if (completedClaims.length === 0) {
      throw new Error(
        `Cannot mark event "${eventId}" as processed: claim ownership is missing or has expired.`,
      );
    }
  }
}
