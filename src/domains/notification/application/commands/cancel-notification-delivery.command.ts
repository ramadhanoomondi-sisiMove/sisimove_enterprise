// -----------------------------------------------------------------------------
// Notification Delivery — Cancel Command
// -----------------------------------------------------------------------------
//
// Application command for cancelling a Notification Delivery.
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
// - optionally carry the cancellation timestamp.
//
// This command does NOT:
//
// - load the Notification aggregate;
// - mutate NotificationDeliveryEntity;
// - access repositories;
// - access Prisma;
// - cancel the Notification automatically;
// - communicate with external providers;
// - publish domain events.
//
// NotificationAggregate.cancelDelivery() owns the delivery cancellation
// operation.
//
// Notification cancellation and delivery cancellation remain separate domain
// transitions.
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

export class CancelNotificationDeliveryCommand implements Command {
  public constructor(
    public readonly notificationPublicId: NotificationPublicId,

    public readonly deliveryId: UniqueEntityId,

    public readonly correlationId: string,

    public readonly cancelledAt: Date | undefined = undefined,

    public readonly causationId?: string,
  ) {}
}

export default CancelNotificationDeliveryCommand;
