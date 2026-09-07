// -----------------------------------------------------------------------------
// Notification Delivery — Send Command
// -----------------------------------------------------------------------------
//
// Application command for marking a Notification Delivery as SENT.
//
// NotificationDeliveryEntity remains a child entity of NotificationAggregate.
//
// Aggregate:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// The command therefore identifies:
//
// - the Notification aggregate;
// - the delivery within that aggregate.
//
// Responsibilities:
//
// - carry the Notification public identity;
// - carry the Notification Delivery internal identity;
// - optionally carry a provider reference;
// - carry correlation/causation metadata;
// - optionally carry the sent timestamp.
//
// This command does NOT:
//
// - load the Notification aggregate;
// - mutate NotificationDeliveryEntity;
// - access repositories;
// - access Prisma;
// - communicate with a Push provider;
// - communicate with an Email provider;
// - communicate with an SMS provider;
// - interpret provider behavior;
// - publish domain events.
//
// External provider communication belongs to the application/integration
// workflow. Once the provider operation has produced its result, the handler
// uses NotificationAggregate.sendDelivery() to record that result in the
// domain.
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

import type { NotificationProviderReference } from '../../domain/value-objects/notification-provider-reference.vo';

// -----------------------------------------------------------------------------
// Foundation — Entity Identity
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Command
// =============================================================================

export class SendNotificationDeliveryCommand implements Command {
  public constructor(
    public readonly notificationPublicId: NotificationPublicId,

    public readonly deliveryId: UniqueEntityId,

    public readonly providerReference:
      NotificationProviderReference | undefined,

    public readonly correlationId: string,

    public readonly sentAt: Date | undefined = undefined,

    public readonly causationId?: string,
  ) {}
}

export default SendNotificationDeliveryCommand;
