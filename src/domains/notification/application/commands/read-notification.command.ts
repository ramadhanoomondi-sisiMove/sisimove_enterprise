// -----------------------------------------------------------------------------
// Notification — Read Command
// -----------------------------------------------------------------------------
//
// Application command for marking a Notification as READ.
//
// The command expresses the intent to mark a Notification as read.
//
// Responsibilities:
//
// - carry the Notification public identity;
// - carry correlation/causation metadata;
// - optionally carry the requested read timestamp.
//
// This command does NOT:
//
// - load the Notification aggregate;
// - mutate NotificationEntity;
// - validate lifecycle transitions;
// - access repositories;
// - access Prisma;
// - publish domain events.
//
// The application handler retrieves the aggregate and delegates the state
// transition to NotificationAggregate.read().
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Notification — Value Objects
// -----------------------------------------------------------------------------

import type { NotificationPublicId } from '../../domain/value-objects/notification-public-id.vo';

// =============================================================================
// Command
// =============================================================================

export class ReadNotificationCommand implements Command {
  public constructor(
    public readonly notificationPublicId: NotificationPublicId,

    public readonly correlationId: string,

    public readonly readAt: Date | undefined = undefined,

    public readonly causationId?: string,
  ) {}
}

export default ReadNotificationCommand;
