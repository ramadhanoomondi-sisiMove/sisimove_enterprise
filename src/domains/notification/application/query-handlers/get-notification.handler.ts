// -----------------------------------------------------------------------------
// Notification — Get Notification Query Handler
// -----------------------------------------------------------------------------
//
// Application handler for retrieving a single Notification aggregate by its
// public identifier.
//
// Aggregate:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// Responsibilities:
//
// - receive the GetNotificationQuery;
// - retrieve the complete Notification aggregate through the repository;
// - return the aggregate to the caller.
//
// This handler does NOT:
//
// - modify the Notification aggregate;
// - modify NotificationEntity;
// - modify NotificationDeliveryEntity;
// - access Prisma;
// - access infrastructure directly;
// - perform authorization;
// - publish domain events;
// - perform application orchestration;
// - load Identity;
// - load Journey;
// - load Booking;
// - load Financial;
// - load Support.
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

import { GetNotificationQuery } from '../queries/get-notification.query';

// -----------------------------------------------------------------------------
// Notification — Aggregate
// -----------------------------------------------------------------------------

import { NotificationAggregate } from '../../domain/aggregates/notification.aggregate';

// -----------------------------------------------------------------------------
// Notification — Repository
// -----------------------------------------------------------------------------

import type { NotificationRepository } from '../../domain/repositories/notification.repository';

// -----------------------------------------------------------------------------
// Notification — Exception
// -----------------------------------------------------------------------------

import { NotificationException } from '../../domain/exceptions/notification.exception';

// -----------------------------------------------------------------------------
// Notification — Tokens
// -----------------------------------------------------------------------------

import { NOTIFICATION_TOKENS } from '../notification.tokens';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetNotificationHandler implements QueryHandler<
  GetNotificationQuery,
  NotificationAggregate
> {
  public constructor(
    @Inject(NOTIFICATION_TOKENS.REPOSITORIES.NOTIFICATION)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async execute(
    query: GetNotificationQuery,
  ): Promise<NotificationAggregate> {
    const aggregate = await this.notificationRepository.findByPublicId(
      query.publicId,
    );

    if (aggregate === null) {
      throw new NotificationException(
        `Notification '${query.publicId.value}' was not found.`,
      );
    }

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetNotificationHandler;
