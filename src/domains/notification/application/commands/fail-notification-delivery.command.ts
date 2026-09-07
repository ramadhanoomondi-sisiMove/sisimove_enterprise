// -----------------------------------------------------------------------------
// Notification Delivery — Fail Command
// -----------------------------------------------------------------------------
//
// Application command for marking a Notification Delivery as FAILED.
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
// - carry the failure reason;
// - carry correlation/causation metadata;
// - optionally carry the failure timestamp.
//
// This command does NOT:
//
// - load the Notification aggregate;
// - mutate NotificationDeliveryEntity;
// - access repositories;
// - access Prisma;
// - fail the Notification automatically;
// - communicate with external providers;
// - publish domain events.
//
// NotificationAggregate.failDelivery() owns the delivery failure operation.
//
// A delivery failure and a Notification failure remain separate domain
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

export class FailNotificationDeliveryCommand implements Command {
  public constructor(
    public readonly notificationPublicId: NotificationPublicId,

    public readonly deliveryId: UniqueEntityId,

    public readonly failureReason: string,

    public readonly correlationId: string,

    public readonly failedAt: Date | undefined = undefined,

    public readonly causationId?: string,
  ) {}
}

export default FailNotificationDeliveryCommand;
