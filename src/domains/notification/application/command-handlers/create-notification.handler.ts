// -----------------------------------------------------------------------------
// Notification — Create Notification Command Handler
// -----------------------------------------------------------------------------
//
// Application command handler for creating a Notification aggregate.
//
// Aggregate:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// Responsibilities:
//
// - create the Notification entity;
// - create the Notification aggregate;
// - record the Notification-created domain event;
// - persist the complete Notification aggregate;
// - return the created aggregate.
//
// This handler does NOT:
//
// - access Prisma directly;
// - perform persistence mapping;
// - validate Identity existence;
// - validate Identity state;
// - validate Journey existence;
// - validate Booking existence;
// - validate Financial existence;
// - validate Support existence;
// - authorize the caller;
// - create Notification deliveries;
// - send notifications;
// - deliver notifications;
// - communicate with notification providers;
// - implement Notification lifecycle rules.
//
// Cross-domain references remain opaque to Notification.
//
// Entity construction belongs to the Notification entity.
// Aggregate construction belongs to the Notification aggregate.
// Persistence belongs to the Notification repository.
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
// Notification — Application
// -----------------------------------------------------------------------------

import { NOTIFICATION_TOKENS } from '../notification.tokens';

// -----------------------------------------------------------------------------
// Notification — Command
// -----------------------------------------------------------------------------

import type { CreateNotificationCommand } from '../commands/create-notification.command';

// -----------------------------------------------------------------------------
// Notification — Domain Aggregate
// -----------------------------------------------------------------------------

import { NotificationAggregate } from '../../domain/aggregates/notification.aggregate';

// -----------------------------------------------------------------------------
// Notification — Domain Entity
// -----------------------------------------------------------------------------

import { NotificationEntity } from '../../domain/entities/notification.entity';

// -----------------------------------------------------------------------------
// Notification — Domain Repository
// -----------------------------------------------------------------------------

import type { NotificationRepository } from '../../domain/repositories/notification.repository';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class CreateNotificationHandler implements CommandHandler<
  CreateNotificationCommand,
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
    command: CreateNotificationCommand,
  ): Promise<NotificationAggregate> {
    // -------------------------------------------------------------------------
    // Create Notification entity
    // -------------------------------------------------------------------------
    //
    // The command already carries the domain-owned Notification value objects.
    //
    // Therefore:
    //
    // - recipientPublicId remains NotificationMemberPublicId;
    // - type remains NotificationType;
    // - priority remains NotificationPriority;
    // - title remains NotificationTitle;
    // - body remains NotificationBody;
    // - referenceType remains NotificationReferenceType | undefined.
    //
    // Cross-domain public identities remain opaque strings.
    //
    // No external aggregate is loaded or validated here.
    //
    // -------------------------------------------------------------------------

    const notification = NotificationEntity.create(
      command.recipientPublicId,
      command.type,
      command.priority,
      command.title,
      command.body,
      command.referenceType,
      command.referencePublicId,
      command.eventType,
      command.eventPublicId,
      command.createdAt,
    );

    // -------------------------------------------------------------------------
    // Create Notification aggregate
    // -------------------------------------------------------------------------
    //
    // Notification creation starts with the Notification root entity only.
    //
    // Deliveries are created through their own application command and are
    // subsequently added to the Notification aggregate.
    //
    // Initial aggregate state:
    //
    // NotificationAggregate
    // ├── NotificationEntity
    // └── []
    //
    // -------------------------------------------------------------------------

    const aggregate = NotificationAggregate.create(notification);

    // -------------------------------------------------------------------------
    // Record Notification-created domain event
    // -------------------------------------------------------------------------
    //
    // Aggregate construction does not implicitly record domain events.
    //
    // The application command provides the message correlation metadata used
    // by the aggregate when recording the creation event.
    //
    // -------------------------------------------------------------------------

    aggregate.recordCreated(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // Persist Notification aggregate
    // -------------------------------------------------------------------------
    //
    // Persistence is delegated entirely to the Notification repository.
    //
    // The handler does not:
    //
    // - access Prisma;
    // - map domain objects to persistence models;
    // - persist NotificationEntity directly;
    // - persist deliveries independently;
    // - publish domain events directly.
    //
    // The repository owns persistence of the aggregate boundary.
    //
    // -------------------------------------------------------------------------

    await this.notificationRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // Return created aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CreateNotificationHandler;
