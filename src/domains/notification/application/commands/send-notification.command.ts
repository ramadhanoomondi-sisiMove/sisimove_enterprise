// -----------------------------------------------------------------------------
// Notification — Send Command
// -----------------------------------------------------------------------------
//
// Application command for marking a Notification as SENT.
//
// The command expresses the intent to transition the Notification lifecycle
// from its current valid state to SENT.
//
// Responsibilities:
//
// - carry the Notification public identity;
// - carry correlation/causation metadata;
// - optionally carry the requested sent timestamp.
//
// This command does NOT:
//
// - load the Notification aggregate;
// - mutate NotificationEntity;
// - validate lifecycle transitions;
// - access repositories;
// - access Prisma;
// - send notifications through external providers;
// - communicate with Push providers;
// - communicate with Email providers;
// - communicate with SMS providers;
// - publish domain events.
//
// The application handler retrieves the aggregate and delegates the lifecycle
// transition to NotificationAggregate.send().
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

export class SendNotificationCommand implements Command {
  public constructor(
    public readonly notificationPublicId: NotificationPublicId,

    public readonly correlationId: string,

    public readonly sentAt: Date | undefined = undefined,

    public readonly causationId?: string,
  ) {}
}

export default SendNotificationCommand;
