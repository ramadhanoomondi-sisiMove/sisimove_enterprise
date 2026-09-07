// -----------------------------------------------------------------------------
// Notification — Send Notification Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler for sending a Notification.
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
// - delegate the Notification lifecycle transition to the aggregate;
// - persist the updated Notification aggregate;
// - return the updated aggregate.
//
// This handler does NOT:
//
// - access Prisma directly;
// - perform persistence mapping;
// - implement Notification lifecycle rules;
// - determine whether a Notification may be sent;
// - send through Email providers;
// - send through SMS providers;
// - send through Push providers;
// - communicate with external notification providers;
// - manipulate NotificationDeliveryEntity directly.
//
// Provider communication belongs to the application/infrastructure delivery
// workflow. NotificationAggregate owns the Notification lifecycle transition.
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

import type { SendNotificationCommand } from '../commands/send-notification.command';

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
export class SendNotificationHandler implements CommandHandler<
  SendNotificationCommand,
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
    command: SendNotificationCommand,
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
    // Delegate Notification lifecycle transition
    // -------------------------------------------------------------------------
    //
    // NotificationAggregate owns:
    //
    // - lifecycle validation;
    // - NotificationEntity state transition;
    // - sent timestamp validation;
    // - NotificationSentEvent creation.
    //
    // The handler only supplies application command data.
    //
    // -------------------------------------------------------------------------

    aggregate.send(command.correlationId, command.causationId, command.sentAt);

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

export default SendNotificationHandler;
