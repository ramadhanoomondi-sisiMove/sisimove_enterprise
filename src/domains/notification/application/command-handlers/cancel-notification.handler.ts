// -----------------------------------------------------------------------------
// Notification — Cancel Notification Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler for cancelling a Notification.
//
// Aggregate:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// Responsibilities:
//
// - retrieve the Notification aggregate;
// - delegate the Notification cancellation transition to the aggregate;
// - persist the updated aggregate;
// - return the updated aggregate.
//
// This handler does NOT:
//
// - access Prisma directly;
// - perform persistence mapping;
// - implement Notification cancellation rules;
// - manipulate NotificationEntity state directly;
// - manipulate NotificationDeliveryEntity state;
// - automatically cancel Notification deliveries;
// - communicate with notification providers;
// - implement authorization.
//
// NotificationAggregate owns Notification lifecycle behavior.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Notification
// -----------------------------------------------------------------------------

import { NOTIFICATION_TOKENS } from '../notification.tokens';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { CancelNotificationCommand } from '../commands/cancel-notification.command';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import { NotificationAggregate } from '../../domain/aggregates/notification.aggregate';

// -----------------------------------------------------------------------------
// Domain — Repository
// -----------------------------------------------------------------------------

import type { NotificationRepository } from '../../domain/repositories/notification.repository';

// -----------------------------------------------------------------------------
// Domain — Exceptions
// -----------------------------------------------------------------------------

import { NotificationException } from '../../domain/exceptions/notification.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class CancelNotificationHandler implements CommandHandler<
  CancelNotificationCommand,
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

  public async execute(
    command: CancelNotificationCommand,
  ): Promise<NotificationAggregate> {
    // -------------------------------------------------------------------------
    // Load Notification aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.notificationRepository.findByPublicId(
      command.notificationPublicId,
    );

    // -------------------------------------------------------------------------
    // Verify Notification existence
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new NotificationException(
        `Notification '${command.notificationPublicId.value}' was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // Delegate Notification cancellation transition
    // -------------------------------------------------------------------------
    //
    // NotificationAggregate owns:
    //
    // - Notification lifecycle validation;
    // - NotificationEntity.cancel();
    // - cancellation timestamp validation;
    // - NotificationCancelledEvent creation.
    //
    // -------------------------------------------------------------------------

    aggregate.cancel(
      command.correlationId,
      command.causationId,
      command.cancelledAt,
    );

    // -------------------------------------------------------------------------
    // Persist updated aggregate
    // -------------------------------------------------------------------------

    await this.notificationRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // Return aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CancelNotificationHandler;
