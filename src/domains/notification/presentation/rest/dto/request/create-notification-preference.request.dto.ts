// -----------------------------------------------------------------------------
// Notification Preference — Create Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for creating a Notification Preference aggregate.
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
// Route:
//
//   POST /notification-preferences
//
// Request body:
//
//   {
//     "memberPublicId": "MEM_550e8400-e29b-41d4-a716-446655440000"
//   }
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - accept the public identity of the member;
// - validate the transport representation of the member identity.
//
// The controller converts memberPublicId from its HTTP primitive representation
// into NotificationMemberPublicId before constructing the application command.
//
// -----------------------------------------------------------------------------
//
// The caller does NOT provide:
//
// - internal Notification Preference ID;
// - Notification Preference public ID;
// - Journey preference;
// - Booking preference;
// - Payment preference;
// - Wallet preference;
// - Trust preference;
// - Verification preference;
// - Message preference;
// - Support preference;
// - System preference;
// - correlation ID;
// - causation ID;
// - creation timestamp.
//
// The initial preference state is owned by NotificationPreferenceEntity.create().
//
// Newly created preferences default all supported notification categories
// according to the domain entity's creation policy.
//
// -----------------------------------------------------------------------------
//
// This DTO contains NO:
//
// - domain value objects;
// - application commands;
// - business rules;
// - repository access;
// - Prisma access;
// - authorization logic.
//
// -----------------------------------------------------------------------------

import { IsNotEmpty, IsString } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class CreateNotificationPreferenceRequestDto {
  // ===========================================================================
  // Member Public Identity
  // ===========================================================================

  /**
   * Public identity of the member whose Notification Preference aggregate
   * is being created.
   *
   * This is an opaque reference to the Identity domain.
   */
  @IsString()
  @IsNotEmpty()
  public readonly memberPublicId!: string;
}

// =============================================================================
// Default Export
// =============================================================================

export default CreateNotificationPreferenceRequestDto;
