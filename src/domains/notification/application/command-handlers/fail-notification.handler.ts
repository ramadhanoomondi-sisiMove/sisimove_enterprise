// -----------------------------------------------------------------------------
// Notification — Fail Notification Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler for failing a Notification.
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
// - delegate the Notification failure transition to the aggregate;
// - persist the updated aggregate;
// - return the updated aggregate.
//
// This handler does NOT:
//
// - access Prisma directly;
// - perform persistence mapping;
// - implement Notification failure rules;
// - manipulate NotificationEntity state directly;
// - manipulate NotificationDeliveryEntity state;
// - automatically fail Notification deliveries;
// - communicate with notification providers;
// - interpret provider failure behavior.
//
// NotificationAggregate explicitly owns Notification-level failure behavior.
// Delivery failure is a separate aggregate operation.
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

import type { FailNotificationCommand } from '../commands/fail-notification.command';

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
export class FailNotificationHandler implements CommandHandler<
  FailNotificationCommand,
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
    command: FailNotificationCommand,
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
    // Delegate Notification failure transition
    // -------------------------------------------------------------------------
    //
    // NotificationAggregate owns:
    //
    // - failure validation;
    // - NotificationEntity.fail();
    // - failure timestamp validation;
    // - failure reason validation;
    // - NotificationFailedEvent creation.
    //
    // This operation intentionally does NOT fail NotificationDeliveryEntity
    // instances automatically.
    //
    // -------------------------------------------------------------------------

    aggregate.fail(
      command.failureReason,
      command.correlationId,
      command.causationId,
      command.failedAt,
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

export default FailNotificationHandler;
