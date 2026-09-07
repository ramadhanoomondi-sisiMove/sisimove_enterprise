// -----------------------------------------------------------------------------
// Notification — Fail Command
// -----------------------------------------------------------------------------
//
// Application command for marking a Notification as FAILED.
//
// The command expresses the intent to fail a Notification.
//
// Responsibilities:
//
// - carry the Notification public identity;
// - carry the failure reason;
// - carry correlation/causation metadata;
// - optionally carry the failure timestamp.
//
// This command does NOT:
//
// - load the Notification aggregate;
// - mutate NotificationEntity;
// - validate the failure transition;
// - access repositories;
// - access Prisma;
// - fail NotificationDeliveryEntity instances automatically;
// - communicate with external providers;
// - publish domain events.
//
// NotificationAggregate.fail() owns the Notification failure transition.
//
// Delivery failure is a separate operation and must be explicitly requested
// through FailNotificationDeliveryCommand.
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

export class FailNotificationCommand implements Command {
  public constructor(
    public readonly notificationPublicId: NotificationPublicId,

    public readonly failureReason: string,

    public readonly correlationId: string,

    public readonly failedAt: Date | undefined = undefined,

    public readonly causationId?: string,
  ) {}
}

export default FailNotificationCommand;
