// -----------------------------------------------------------------------------
// Notification — Cancel Command
// -----------------------------------------------------------------------------
//
// Application command for cancelling a Notification.
//
// The command expresses the intent to cancel a Notification.
//
// Responsibilities:
//
// - carry the Notification public identity;
// - carry correlation/causation metadata;
// - optionally carry the cancellation timestamp.
//
// This command does NOT:
//
// - load the Notification aggregate;
// - mutate NotificationEntity;
// - validate cancellation rules;
// - access repositories;
// - access Prisma;
// - cancel NotificationDeliveryEntity instances automatically;
// - communicate with external providers;
// - publish domain events.
//
// NotificationAggregate.cancel() owns the Notification cancellation
// transition.
//
// Delivery cancellation is a separate operation and must be explicitly
// requested through CancelNotificationDeliveryCommand.
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

export class CancelNotificationCommand implements Command {
  public constructor(
    public readonly notificationPublicId: NotificationPublicId,

    public readonly correlationId: string,

    public readonly cancelledAt: Date | undefined = undefined,

    public readonly causationId?: string,
  ) {}
}

export default CancelNotificationCommand;
