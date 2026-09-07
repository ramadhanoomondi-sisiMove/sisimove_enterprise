// -----------------------------------------------------------------------------
// Notification — Get Notifications By Recipient Query Handler
// -----------------------------------------------------------------------------
//
// Application handler for retrieving Notification aggregates belonging to a
// specific recipient.
//
// recipientPublicId is an opaque reference to Identity.publicId.
//
// The repository performs persistence filtering only.
//
// This handler does NOT:
//
// - load Identity;
// - validate recipient existence;
// - validate recipient state;
// - modify Notification aggregates;
// - modify NotificationEntity;
// - modify NotificationDeliveryEntity;
// - access Prisma;
// - perform authorization;
// - publish domain events;
// - apply notification policy.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import { GetNotificationsByRecipientQuery } from '../queries/get-notifications-by-recipient.query';

// -----------------------------------------------------------------------------
// Notification — Aggregate
// -----------------------------------------------------------------------------

import { NotificationAggregate } from '../../domain/aggregates/notification.aggregate';

// -----------------------------------------------------------------------------
// Notification — Repository
// -----------------------------------------------------------------------------

import type { NotificationRepository } from '../../domain/repositories/notification.repository';

// -----------------------------------------------------------------------------
// Notification — Tokens
// -----------------------------------------------------------------------------

import { NOTIFICATION_TOKENS } from '../notification.tokens';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetNotificationsByRecipientHandler implements QueryHandler<
  GetNotificationsByRecipientQuery,
  NotificationAggregate[]
> {
  public constructor(
    @Inject(NOTIFICATION_TOKENS.REPOSITORIES.NOTIFICATION)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async execute(
    query: GetNotificationsByRecipientQuery,
  ): Promise<NotificationAggregate[]> {
    return this.notificationRepository.findByRecipientPublicId(
      query.recipientPublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetNotificationsByRecipientHandler;
