// -----------------------------------------------------------------------------
// Notification Preference — Update Request DTO
// -----------------------------------------------------------------------------
//
// Transport DTO for updating a Notification Preference aggregate.
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
//   PATCH /notification-preferences/:preferencePublicId
//
// Request body:
//
//   {
//     "journeyEnabled": true,
//     "bookingEnabled": true,
//     "paymentEnabled": false,
//     "walletEnabled": true,
//     "trustEnabled": true,
//     "verificationEnabled": true,
//     "messageEnabled": true,
//     "supportEnabled": true,
//     "systemEnabled": true
//   }
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - accept the desired notification preference state;
// - validate that each preference value is a boolean.
//
// The controller converts the route preferencePublicId from its HTTP primitive
// representation into NotificationPreferencePublicId before constructing the
// application command.
//
// -----------------------------------------------------------------------------
//
// Update semantics:
//
// This DTO represents the COMPLETE desired preference state.
//
// Therefore all supported notification preference categories are required:
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
// A partial preference update is intentionally NOT represented here.
//
// -----------------------------------------------------------------------------
//
// The caller does NOT provide:
//
// - internal Notification Preference ID;
// - Notification Preference public ID;
// - member public ID;
// - correlation ID;
// - causation ID;
// - update timestamp.
//
// Those values belong to the route or application boundary.
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

import { IsBoolean } from 'class-validator';

// =============================================================================
// DTO
// =============================================================================

export class UpdateNotificationPreferenceRequestDto {
  // ===========================================================================
  // Journey
  // ===========================================================================

  /**
   * Whether Journey notifications are enabled.
   */
  @IsBoolean()
  public readonly journeyEnabled!: boolean;

  // ===========================================================================
  // Booking
  // ===========================================================================

  /**
   * Whether Booking notifications are enabled.
   */
  @IsBoolean()
  public readonly bookingEnabled!: boolean;

  // ===========================================================================
  // Payment
  // ===========================================================================

  /**
   * Whether Payment notifications are enabled.
   */
  @IsBoolean()
  public readonly paymentEnabled!: boolean;

  // ===========================================================================
  // Wallet
  // ===========================================================================

  /**
   * Whether Wallet notifications are enabled.
   */
  @IsBoolean()
  public readonly walletEnabled!: boolean;

  // ===========================================================================
  // Trust
  // ===========================================================================

  /**
   * Whether Trust notifications are enabled.
   */
  @IsBoolean()
  public readonly trustEnabled!: boolean;

  // ===========================================================================
  // Verification
  // ===========================================================================

  /**
   * Whether Verification notifications are enabled.
   */
  @IsBoolean()
  public readonly verificationEnabled!: boolean;

  // ===========================================================================
  // Message
  // ===========================================================================

  /**
   * Whether Message notifications are enabled.
   */
  @IsBoolean()
  public readonly messageEnabled!: boolean;

  // ===========================================================================
  // Support
  // ===========================================================================

  /**
   * Whether Support notifications are enabled.
   */
  @IsBoolean()
  public readonly supportEnabled!: boolean;

  // ===========================================================================
  // System
  // ===========================================================================

  /**
   * Whether System notifications are enabled.
   */
  @IsBoolean()
  public readonly systemEnabled!: boolean;
}

// =============================================================================
// Default Export
// =============================================================================

export default UpdateNotificationPreferenceRequestDto;
