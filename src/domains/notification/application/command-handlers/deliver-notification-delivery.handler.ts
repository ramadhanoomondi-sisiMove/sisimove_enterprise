// -----------------------------------------------------------------------------
// Notification — Deliver Notification Delivery Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for marking a Notification Delivery as DELIVERED.
//
// Aggregate:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// NotificationDeliveryEntity is a child entity owned by the Notification
// aggregate.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - load the Notification aggregate;
// - locate the delivery by internal identity;
// - delegate the delivery transition to NotificationAggregate;
// - persist the complete aggregate;
// - return the updated aggregate.
//
// -----------------------------------------------------------------------------
//
// This handler does NOT:
//
// - communicate with external providers;
// - interpret provider-specific delivery behavior;
// - mutate NotificationDeliveryEntity directly;
// - access Prisma;
// - create a NotificationDelivery aggregate;
// - publish domain events directly.
//
// The aggregate owns the domain transition and event recording.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation — Application
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import { DeliverNotificationDeliveryCommand } from '../commands/deliver-notification-delivery.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { NotificationAggregate } from '../../domain/aggregates/notification.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { NotificationRepository } from '../../domain/repositories/notification.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { NotificationException } from '../../domain/exceptions/notification.exception';

// -----------------------------------------------------------------------------
// Tokens
// -----------------------------------------------------------------------------

import { NOTIFICATION_TOKENS } from '../notification.tokens';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class DeliverNotificationDeliveryHandler implements CommandHandler<
  DeliverNotificationDeliveryCommand,
  NotificationAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(NOTIFICATION_TOKENS.REPOSITORIES.NOTIFICATION)
    private readonly notificationRepository: NotificationRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Marks a Notification Delivery as DELIVERED.
   *
   * The Notification aggregate verifies that the delivery belongs to the
   * aggregate and delegates the lifecycle transition to the delivery entity.
   */
  public async execute(
    command: DeliverNotificationDeliveryCommand,
  ): Promise<NotificationAggregate> {
    // -------------------------------------------------------------------------
    // Load aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.notificationRepository.findByPublicId(
      command.notificationPublicId,
    );

    if (aggregate === null) {
      throw new NotificationException(
        `Notification '${command.notificationPublicId.value}' was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // Locate delivery
    // -------------------------------------------------------------------------

    const delivery = aggregate.getDelivery(command.deliveryId);

    if (delivery === undefined) {
      throw new NotificationException(
        `Notification delivery '${command.deliveryId.value}' was not found in notification '${command.notificationPublicId.value}'.`,
      );
    }

    // -------------------------------------------------------------------------
    // Delegate lifecycle transition to aggregate
    // -------------------------------------------------------------------------

    aggregate.deliverDelivery(
      delivery.id,
      command.correlationId,
      command.causationId,
      command.deliveredAt,
    );

    // -------------------------------------------------------------------------
    // Persist complete aggregate
    // -------------------------------------------------------------------------

    await this.notificationRepository.save(aggregate);

    return aggregate;
  }
}

export default DeliverNotificationDeliveryHandler;
