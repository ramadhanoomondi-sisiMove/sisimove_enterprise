// -----------------------------------------------------------------------------
// Notification Delivery — Deliver Command
// -----------------------------------------------------------------------------
//
// Application command for marking a Notification Delivery as DELIVERED.
//
// NotificationDeliveryEntity is a child entity owned by NotificationAggregate.
//
// Aggregate:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// Responsibilities:
//
// - carry the Notification public identity;
// - carry the Notification Delivery internal identity;
// - carry correlation/causation metadata;
// - optionally carry the delivery timestamp.
//
// This command does NOT:
//
// - load the Notification aggregate;
// - mutate NotificationDeliveryEntity;
// - access repositories;
// - access Prisma;
// - communicate with external providers;
// - interpret provider-specific delivery behavior;
// - publish domain events.
//
// The application handler retrieves the Notification aggregate and delegates
// the state transition to NotificationAggregate.deliverDelivery().
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

// -----------------------------------------------------------------------------
// Foundation — Entity Identity
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Command
// =============================================================================

export class DeliverNotificationDeliveryCommand implements Command {
  public constructor(
    public readonly notificationPublicId: NotificationPublicId,

    public readonly deliveryId: UniqueEntityId,

    public readonly correlationId: string,

    public readonly deliveredAt: Date | undefined = undefined,

    public readonly causationId?: string,
  ) {}
}

export default DeliverNotificationDeliveryCommand;
