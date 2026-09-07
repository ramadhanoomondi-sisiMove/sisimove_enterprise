// -----------------------------------------------------------------------------
// Notification — Read Notification Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler for marking a Notification as READ.
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
// - delegate the Notification read transition to the aggregate;
// - persist the updated aggregate;
// - return the updated aggregate.
//
// This handler does NOT:
//
// - access Prisma directly;
// - perform persistence mapping;
// - implement Notification lifecycle rules;
// - determine whether the Notification may be read;
// - manipulate NotificationEntity state directly;
// - manipulate NotificationDeliveryEntity state;
// - create domain events directly.
//
// Notification lifecycle behavior remains inside NotificationAggregate and
// NotificationEntity.
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

import type { ReadNotificationCommand } from '../commands/read-notification.command';

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
export class ReadNotificationHandler implements CommandHandler<
  ReadNotificationCommand,
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
    command: ReadNotificationCommand,
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
    // Delegate Notification read transition
    // -------------------------------------------------------------------------
    //
    // NotificationAggregate owns:
    //
    // - Notification lifecycle validation;
    // - NotificationEntity.read();
    // - read timestamp validation;
    // - NotificationReadEvent creation.
    //
    // -------------------------------------------------------------------------

    aggregate.read(command.correlationId, command.causationId, command.readAt);

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

export default ReadNotificationHandler;
