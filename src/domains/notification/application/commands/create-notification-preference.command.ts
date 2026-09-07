// -----------------------------------------------------------------------------
// Notification Preference — Create Command
// -----------------------------------------------------------------------------
//
// Application command for creating a Notification Preference aggregate.
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
// - carry the member public identity;
// - carry correlation metadata;
// - optionally carry the creation timestamp;
// - carry optional causation metadata.
//
// This command does NOT:
//
// - create NotificationPreferenceEntity;
// - create NotificationPreferenceAggregate;
// - access repositories;
// - access Prisma;
// - validate whether the member exists;
// - authorize the caller;
// - record domain events;
// - publish domain events;
// - define the initial preference state.
//
// The initial preference state is owned by
// NotificationPreferenceEntity.create().
//
// Newly-created Notification Preference entities default all supported
// notification categories to enabled:
//
// - Journey
// - Booking
// - Payment
// - Wallet
// - Trust
// - Verification
// - Message
// - Support
// - System
//
// Individual preference changes belong to the
// UpdateNotificationPreferenceCommand.
//
// The memberPublicId is an opaque reference to the Identity domain.
//
// -----------------------------------------------------------------------------
//
// Creation contract:
//
// NotificationPreferenceEntity.create(
//   memberPublicId,
//   createdAt?,
// )
//
// Therefore this command intentionally does not duplicate the entity's
// creation invariant by carrying nine initial boolean preference values.
//
// -----------------------------------------------------------------------------
//
// Command flow:
//
// CreateNotificationPreferenceCommand
//              │
//              ▼
// CreateNotificationPreferenceHandler
//              │
//              ▼
// NotificationPreferenceEntity.create()
//              │
//              ▼
// NotificationPreferenceAggregate.create()
//              │
//              ▼
// NotificationPreferenceCreatedEvent
//              │
//              ▼
// NotificationPreferenceRepository.save()
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { NotificationMemberPublicId } from '../../domain/value-objects/notification-member-public-id.vo';

// =============================================================================
// Command
// =============================================================================

export class CreateNotificationPreferenceCommand extends Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the member whose notification preferences
     * are being created.
     *
     * This is an opaque Identity-domain reference.
     */
    public readonly memberPublicId: NotificationMemberPublicId,

    /**
     * Application-level correlation identity.
     *
     * Used to correlate the command with the domain events and
     * subsequent application processing originating from this operation.
     */
    public readonly correlationId: string,

    /**
     * Optional creation timestamp.
     *
     * When omitted, NotificationPreferenceEntity.create() uses
     * the current timestamp.
     */
    public readonly createdAt: Date | undefined = undefined,

    /**
     * Optional causation identity.
     *
     * Identifies the command/event that caused this operation,
     * when the operation originates from another application or
     * domain message.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default CreateNotificationPreferenceCommand;
