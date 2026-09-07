// -----------------------------------------------------------------------------
// Notification — Send Notification Delivery Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for marking a Notification Delivery as SENT.
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
// - communicate with Push providers;
// - communicate with Email providers;
// - communicate with SMS providers;
// - interpret provider behavior;
// - mutate NotificationDeliveryEntity directly;
// - access Prisma;
// - create a delivery aggregate;
// - publish domain events directly.
//
// External provider communication belongs to the application/integration
// workflow. This handler records the resulting provider reference and delivery
// state through the Notification aggregate.
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

import { SendNotificationDeliveryCommand } from '../commands/send-notification-delivery.command';

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
export class SendNotificationDeliveryHandler implements CommandHandler<
  SendNotificationDeliveryCommand,
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
   * Marks a Notification Delivery as SENT.
   *
   * The delivery is identified by its internal identity within the owning
   * Notification aggregate.
   */
  public async execute(
    command: SendNotificationDeliveryCommand,
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

    aggregate.sendDelivery(
      delivery.id,
      command.providerReference,
      command.correlationId,
      command.causationId,
      command.sentAt,
    );

    // -------------------------------------------------------------------------
    // Persist complete aggregate
    // -------------------------------------------------------------------------

    await this.notificationRepository.save(aggregate);

    return aggregate;
  }
}

export default SendNotificationDeliveryHandler;
