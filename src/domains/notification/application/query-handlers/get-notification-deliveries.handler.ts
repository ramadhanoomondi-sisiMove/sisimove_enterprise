// -----------------------------------------------------------------------------
// Notification — Get Notification Deliveries Query Handler
// -----------------------------------------------------------------------------
//
// Application handler for retrieving the deliveries belonging to a
// Notification aggregate.
//
// Aggregate:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// NotificationDeliveryEntity is a child entity and is therefore retrieved
// through the Notification aggregate boundary.
//
// This handler first loads the complete Notification aggregate and then returns
// its delivery children.
//
// The aggregate exposes its deliveries as a readonly collection. The handler
// therefore preserves that read-only contract instead of creating a mutable
// copy.
//
// This handler does NOT:
//
// - load NotificationDeliveryEntity as an independent aggregate;
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

import { GetNotificationDeliveriesQuery } from '../queries/get-notification-deliveries.query';

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
export class GetNotificationDeliveriesHandler implements QueryHandler<
  GetNotificationDeliveriesQuery,
  readonly NotificationDeliveryEntity[]
> {
  public constructor(
    @Inject(NOTIFICATION_TOKENS.REPOSITORIES.NOTIFICATION)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  public async execute(
    query: GetNotificationDeliveriesQuery,
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

export default GetNotificationDeliveriesHandler;
