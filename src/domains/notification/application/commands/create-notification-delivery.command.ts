// -----------------------------------------------------------------------------
// Notification Delivery — Create Command
// -----------------------------------------------------------------------------
//
// Application command for adding a Notification Delivery to a Notification
// aggregate.
//
// NotificationDeliveryEntity is NOT an aggregate root.
//
// It is a child entity owned by:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// Therefore this command targets the Notification aggregate rather than
// creating an independent NotificationDelivery aggregate.
//
// Responsibilities:
//
// - carry the Notification public identity;
// - carry the delivery channel;
// - carry correlation/causation metadata;
// - optionally carry the delivery creation timestamp.
//
// This command does NOT:
//
// - create NotificationDeliveryEntity;
// - create NotificationAggregate;
// - access repositories;
// - access Prisma;
// - send notifications;
// - communicate with delivery providers;
// - validate provider availability;
// - authorize the operation;
// - publish domain events.
//
// The application handler constructs the delivery entity and delegates its
// addition to NotificationAggregate.addDelivery().
//
// The aggregate enforces:
//
// - Notification lifecycle eligibility;
// - delivery ownership;
// - delivery identity uniqueness;
// - channel uniqueness;
// - pending delivery state;
// - NotificationDeliveryCreated domain event.
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

import type { NotificationChannel } from '../../domain/value-objects/notification-channel.vo';

// =============================================================================
// Command
// =============================================================================

export class CreateNotificationDeliveryCommand implements Command {
  public constructor(
    public readonly notificationPublicId: NotificationPublicId,

    public readonly channel: NotificationChannel,

    public readonly correlationId: string,

    public readonly createdAt: Date | undefined = undefined,

    public readonly causationId?: string,
  ) {}
}

export default CreateNotificationDeliveryCommand;
