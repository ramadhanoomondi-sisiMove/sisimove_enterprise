// -----------------------------------------------------------------------------
// Notification — Get Notifications Query Handler
// -----------------------------------------------------------------------------
//
// Application handler for retrieving all Notification aggregates.
//
// Responsibilities:
//
// - receive the GetNotificationsQuery;
// - retrieve Notification aggregates through the repository;
// - return the aggregates to the caller.
//
// This handler does NOT:
//
// - modify Notification aggregates;
// - modify NotificationEntity;
// - modify NotificationDeliveryEntity;
// - access Prisma;
// - access infrastructure directly;
// - perform authorization;
// - publish domain events;
// - perform application orchestration;
// - load aggregates from other domains.
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

import { GetNotificationsQuery } from '../queries/get-notifications.query';

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
export class GetNotificationsHandler implements QueryHandler<
  GetNotificationsQuery,
  NotificationAggregate[]
> {
  public constructor(
    @Inject(NOTIFICATION_TOKENS.REPOSITORIES.NOTIFICATION)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async execute(
    query: GetNotificationsQuery,
  ): Promise<NotificationAggregate[]> {
    void query;

    return this.notificationRepository.findAll();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetNotificationsHandler;
