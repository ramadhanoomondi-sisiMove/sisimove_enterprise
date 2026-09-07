// -----------------------------------------------------------------------------
// Notification — Get Notification Deliveries By Notification Query Handler
// -----------------------------------------------------------------------------
//
// Application handler for retrieving all deliveries belonging to a specific
// Notification aggregate.
//
// Aggregate:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// NotificationDeliveryEntity is a child entity owned by NotificationAggregate.
// It must therefore be retrieved through the Notification aggregate boundary.
//
// The handler loads the complete Notification aggregate through:
//
//     NotificationRepository.findByPublicId()
//
// and returns:
//
//     NotificationAggregate.deliveries
//
// The aggregate exposes its delivery collection as readonly. This handler
// preserves that immutability and does not create a mutable collection.
//
// This handler does NOT:
//
// - treat NotificationDeliveryEntity as an independent aggregate;
// - access a NotificationDeliveryRepository;
// - modify the Notification aggregate;
// - modify NotificationEntity;
// - modify NotificationDeliveryEntity;
// - access Prisma;
// - perform authorization;
// - publish domain events;
// - perform application orchestration.
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

import { GetNotificationDeliveriesByNotificationQuery } from '../queries/get-notification-deliveries-by-notification.query';

// -----------------------------------------------------------------------------
// Notification — Delivery Entity
// -----------------------------------------------------------------------------

import type { NotificationDeliveryEntity } from '../../domain/entities/notification-delivery.entity';

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
export class GetNotificationDeliveriesByNotificationHandler implements QueryHandler<
  GetNotificationDeliveriesByNotificationQuery,
  readonly NotificationDeliveryEntity[]
> {
  public constructor(
    @Inject(NOTIFICATION_TOKENS.REPOSITORIES.NOTIFICATION)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async execute(
    query: GetNotificationDeliveriesByNotificationQuery,
  ): Promise<readonly NotificationDeliveryEntity[]> {
    const aggregate = await this.notificationRepository.findByPublicId(
      query.notificationPublicId,
    );

    if (aggregate === null) {
      throw new NotificationException(
        `Notification '${query.notificationPublicId.value}' was not found.`,
      );
    }

    return aggregate.deliveries;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetNotificationDeliveriesByNotificationHandler;
