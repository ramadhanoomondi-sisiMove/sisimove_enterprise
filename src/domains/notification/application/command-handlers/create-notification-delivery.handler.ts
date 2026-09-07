// -----------------------------------------------------------------------------
// Notification — Create Notification Delivery Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler for creating a Notification Delivery.
//
// Aggregate:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// NotificationDeliveryEntity is a child entity of NotificationAggregate and
// must therefore be created through the owning Notification aggregate.
//
// Responsibilities:
//
// - retrieve the owning Notification aggregate;
// - create the NotificationDeliveryEntity;
// - add the delivery to the Notification aggregate;
// - record the delivery-created domain event through the aggregate;
// - persist the complete Notification aggregate;
// - return the updated Notification aggregate.
//
// This handler does NOT:
//
// - access Prisma directly;
// - perform persistence mapping;
// - create an independent NotificationDelivery aggregate;
// - validate Identity existence;
// - validate recipient Identity state;
// - authorize the caller;
// - implement delivery channel uniqueness;
// - implement delivery ownership rules;
// - implement Notification lifecycle rules;
// - send the delivery;
// - communicate with Email providers;
// - communicate with SMS providers;
// - communicate with Push providers.
//
// NotificationAggregate owns delivery creation and delivery invariants.
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

import type { CreateNotificationDeliveryCommand } from '../commands/create-notification-delivery.command';

// -----------------------------------------------------------------------------
// Domain — Aggregate
// -----------------------------------------------------------------------------

import { NotificationAggregate } from '../../domain/aggregates/notification.aggregate';

// -----------------------------------------------------------------------------
// Domain — Entity
// -----------------------------------------------------------------------------

import { NotificationDeliveryEntity } from '../../domain/entities/notification-delivery.entity';

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
export class CreateNotificationDeliveryHandler implements CommandHandler<
  CreateNotificationDeliveryCommand,
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
    command: CreateNotificationDeliveryCommand,
  ): Promise<NotificationAggregate> {
    // -------------------------------------------------------------------------
    // Load owning Notification aggregate
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
    // Create Notification Delivery entity
    // -------------------------------------------------------------------------
    //
    // The delivery is created with the internal Notification aggregate identity.
    //
    // NotificationDeliveryEntity.notificationId is an internal domain
    // relationship and therefore uses NotificationAggregate.id.
    //
    // -------------------------------------------------------------------------

    const delivery = NotificationDeliveryEntity.create(
      aggregate.id,
      command.channel,
      command.createdAt,
    );

    // -------------------------------------------------------------------------
    // Add delivery through Notification aggregate
    // -------------------------------------------------------------------------
    //
    // The aggregate owns:
    //
    // - Notification lifecycle validation;
    // - delivery ownership validation;
    // - delivery internal identity uniqueness;
    // - delivery channel uniqueness;
    // - delivery pending-state validation;
    // - NotificationDeliveryCreatedEvent creation.
    //
    // The handler must not push directly into aggregate.deliveries.
    //
    // -------------------------------------------------------------------------

    aggregate.addDelivery(delivery, command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // Persist complete Notification aggregate
    // -------------------------------------------------------------------------
    //
    // NotificationDeliveryEntity is persisted as part of the Notification
    // aggregate boundary.
    //
    // There is intentionally no NotificationDeliveryRepository involved.
    //
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

export default CreateNotificationDeliveryHandler;
