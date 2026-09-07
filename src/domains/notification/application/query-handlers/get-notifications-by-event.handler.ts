// -----------------------------------------------------------------------------
// Notification — Get Notifications By Event Query Handler
// -----------------------------------------------------------------------------
//
// Application handler for retrieving Notification aggregates produced from a
// specific source event.
//
// The source event is represented by:
//
//     eventType
//     eventPublicId
//
// These are opaque references to the originating event.
//
// The repository performs persistence filtering only.
//
// This handler does NOT:
//
// - load the source aggregate;
// - validate the source event;
// - interpret the source event;
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

import { GetNotificationsByEventQuery } from '../queries/get-notifications-by-event.query';

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
export class GetNotificationsByEventHandler implements QueryHandler<
  GetNotificationsByEventQuery,
  NotificationAggregate[]
> {
  public constructor(
    @Inject(NOTIFICATION_TOKENS.REPOSITORIES.NOTIFICATION)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async execute(
    query: GetNotificationsByEventQuery,
  ): Promise<NotificationAggregate[]> {
    return this.notificationRepository.findByEventTypeAndEventPublicId(
      query.eventType,
      query.eventPublicId,
    );
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetNotificationsByEventHandler;
