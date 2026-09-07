// -----------------------------------------------------------------------------
// Notification — Cancel Notification Delivery Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for cancelling a Notification Delivery.
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
// - delegate the cancellation transition to NotificationAggregate;
// - persist the complete aggregate;
// - return the updated aggregate.
//
// -----------------------------------------------------------------------------
//
// This handler does NOT:
//
// - cancel the Notification automatically;
// - mutate NotificationDeliveryEntity directly;
// - access Prisma;
// - communicate with external providers;
// - publish domain events directly.
//
// Notification cancellation and delivery cancellation remain separate domain
// transitions.
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

import { CancelNotificationDeliveryCommand } from '../commands/cancel-notification-delivery.command';

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
export class CancelNotificationDeliveryHandler implements CommandHandler<
  CancelNotificationDeliveryCommand,
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
   * Cancels a Notification Delivery.
   *
   * The Notification aggregate verifies that the delivery belongs to the
   * Notification and delegates the cancellation transition to the child
   * entity.
   */
  public async execute(
    command: CancelNotificationDeliveryCommand,
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

    aggregate.cancelDelivery(
      delivery.id,
      command.correlationId,
      command.causationId,
      command.cancelledAt,
    );

    // -------------------------------------------------------------------------
    // Persist complete aggregate
    // -------------------------------------------------------------------------

    await this.notificationRepository.save(aggregate);

    return aggregate;
  }
}

export default CancelNotificationDeliveryHandler;
