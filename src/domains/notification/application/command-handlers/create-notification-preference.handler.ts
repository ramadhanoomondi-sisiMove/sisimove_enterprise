// -----------------------------------------------------------------------------
// Notification Preference — Create Command Handler
// -----------------------------------------------------------------------------
//
// Application handler for creating a Notification Preference aggregate.
//
// Aggregate:
//
// NotificationPreferenceAggregate
// └── NotificationPreferenceEntity
//
// NotificationPreferenceEntity is the aggregate root entity.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - receive CreateNotificationPreferenceCommand;
// - create NotificationPreferenceEntity;
// - create NotificationPreferenceAggregate;
// - record NotificationPreferenceCreatedEvent;
// - persist the aggregate;
// - return the created aggregate.
//
// This handler does NOT:
//
// - access Prisma directly;
// - implement notification preference business rules;
// - validate Identity member existence;
// - authorize the caller;
// - publish domain events directly;
// - communicate with notification providers.
//
// Member existence and authorization belong to the appropriate application
// or domain boundary.
//
// The memberPublicId remains an opaque reference to the Identity domain.
//
// -----------------------------------------------------------------------------
//
// Creation behavior:
//
// NotificationPreferenceEntity.create() owns the initial preference state.
//
// Newly-created Notification Preference entities have:
//
// - Journey       = enabled
// - Booking       = enabled
// - Payment       = enabled
// - Wallet        = enabled
// - Trust         = enabled
// - Verification  = enabled
// - Message       = enabled
// - Support       = enabled
// - System        = enabled
//
// The optional command preference flags are therefore not passed to the
// entity factory. The entity owns the creation invariant.
//
// -----------------------------------------------------------------------------
//
// Workflow:
//
// 1. Create NotificationPreferenceEntity.
// 2. Wrap entity in NotificationPreferenceAggregate.
// 3. Record NotificationPreferenceCreatedEvent.
// 4. Persist the aggregate.
// 5. Return the aggregate.
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
// Commands
// -----------------------------------------------------------------------------

import { CreateNotificationPreferenceCommand } from '../commands/create-notification-preference.command';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { NotificationPreferenceAggregate } from '../../domain/aggregates/notification-preference.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { NotificationPreferenceEntity } from '../../domain/entities/notification-preference.entity';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { NotificationPreferenceRepository } from '../../domain/repositories/notification-preference.repository';

// -----------------------------------------------------------------------------
// Tokens
// -----------------------------------------------------------------------------

import { NOTIFICATION_TOKENS } from '../notification.tokens';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class CreateNotificationPreferenceHandler implements CommandHandler<
  CreateNotificationPreferenceCommand,
  NotificationPreferenceAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(NOTIFICATION_TOKENS.REPOSITORIES.NOTIFICATION_PREFERENCE)
    private readonly notificationPreferenceRepository: NotificationPreferenceRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the Create Notification Preference command.
   *
   * Entity construction remains inside the domain entity.
   * Aggregate construction remains inside the domain aggregate.
   *
   * The handler only orchestrates the application workflow and persistence.
   */
  public async execute(
    command: CreateNotificationPreferenceCommand,
  ): Promise<NotificationPreferenceAggregate> {
    // -------------------------------------------------------------------------
    // Create Entity
    // -------------------------------------------------------------------------
    //
    // NotificationPreferenceEntity.create() owns the default preference state.
    //
    // All nine notification categories are enabled when the entity is created.
    //
    // The command's optional createdAt value is passed as the entity creation
    // timestamp. When omitted, the entity factory supplies the current time.
    //

    const preference = NotificationPreferenceEntity.create(
      command.memberPublicId,
      command.createdAt,
    );

    // -------------------------------------------------------------------------
    // Create Aggregate
    // -------------------------------------------------------------------------
    //
    // NotificationPreferenceEntity is the aggregate root entity.
    //
    // The aggregate therefore wraps exactly this entity.
    //

    const aggregate = NotificationPreferenceAggregate.create(preference);

    // -------------------------------------------------------------------------
    // Record Created Event
    // -------------------------------------------------------------------------
    //
    // Domain-event recording belongs to the aggregate.
    //
    // Correlation and causation metadata originate from the application
    // command and are passed into the aggregate event.
    //

    aggregate.recordCreated(command.correlationId, command.causationId);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------
    //
    // Persistence occurs through the NotificationPreferenceRepository
    // abstraction.
    //
    // The handler has no knowledge of Prisma or the persistence mechanism.
    //

    await this.notificationPreferenceRepository.save(aggregate);

    // -------------------------------------------------------------------------
    // Return Aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default CreateNotificationPreferenceHandler;
