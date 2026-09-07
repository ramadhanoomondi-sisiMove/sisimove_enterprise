// -----------------------------------------------------------------------------
// Notification — Fail Notification Delivery Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for marking a Notification Delivery as FAILED.
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
// - delegate the failure transition to NotificationAggregate;
// - persist the complete aggregate;
// - return the updated aggregate.
//
// -----------------------------------------------------------------------------
//
// This handler does NOT:
//
// - fail the Notification automatically;
// - mutate NotificationDeliveryEntity directly;
// - access Prisma;
// - communicate with external providers;
// - interpret provider behavior;
// - publish domain events directly.
//
// Delivery failure and Notification failure are separate domain transitions.
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

import { FailNotificationDeliveryCommand } from '../commands/fail-notification-delivery.command';

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
export class FailNotificationDeliveryHandler implements CommandHandler<
  FailNotificationDeliveryCommand,
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
   * Marks a Notification Delivery as FAILED.
   *
   * The failure reason and timestamp are passed to the aggregate, which
   * delegates the state transition to NotificationDeliveryEntity and records
   * the corresponding domain event.
   */
  public async execute(
    command: FailNotificationDeliveryCommand,
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

    aggregate.failDelivery(
      delivery.id,
      command.failureReason,
      command.correlationId,
      command.causationId,
      command.failedAt,
    );

    // -------------------------------------------------------------------------
    // Persist complete aggregate
    // -------------------------------------------------------------------------

    await this.notificationRepository.save(aggregate);

    return aggregate;
  }
}

export default FailNotificationDeliveryHandler;
