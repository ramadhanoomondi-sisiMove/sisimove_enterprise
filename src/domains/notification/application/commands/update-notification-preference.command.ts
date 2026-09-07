// -----------------------------------------------------------------------------
// Notification Preference — Update Command
// -----------------------------------------------------------------------------
//
// Application command for updating a Notification Preference aggregate.
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
// - identify the Notification Preference aggregate;
// - carry the desired Journey preference;
// - carry the desired Booking preference;
// - carry the desired Payment preference;
// - carry the desired Wallet preference;
// - carry the desired Trust preference;
// - carry the desired Verification preference;
// - carry the desired Message preference;
// - carry the desired Support preference;
// - carry the desired System preference;
// - carry correlation metadata;
// - optionally carry the update timestamp;
// - optionally carry causation metadata.
//
// This command represents the desired complete preference state.
//
// -----------------------------------------------------------------------------
//
// This command does NOT:
//
// - load the aggregate;
// - access repositories;
// - access Prisma;
// - mutate the entity directly;
// - authorize the caller;
// - validate member existence;
// - enforce aggregate invariants;
// - record domain events;
// - publish domain events.
//
// The application handler loads the aggregate, applies the requested state
// through the aggregate boundary, records the updated domain event, and
// persists the aggregate.
//
// Business rules remain inside the domain model.
//
// -----------------------------------------------------------------------------
//
// Update semantics:
//
// The command supplies the desired state for all supported notification
// preference categories.
//
// The application handler delegates each preference change to the aggregate:
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
// The aggregate/entity remains responsible for validating and applying
// those state changes.
//
// -----------------------------------------------------------------------------
//
// Timestamp semantics:
//
// If updatedAt is supplied, the application handler may use it as the
// explicit update timestamp.
//
// If updatedAt is omitted, the application layer supplies the current time.
//
// The entity remains responsible for ensuring that the resulting timestamp
// is valid and does not move backwards.
//
// -----------------------------------------------------------------------------
//
// Aggregate flow:
//
// UpdateNotificationPreferenceCommand
//              │
//              ▼
// UpdateNotificationPreferenceHandler
//              │
//              ▼
// NotificationPreferenceRepository.findByPublicId()
//              │
//              ▼
// NotificationPreferenceAggregate
//              │
//              ├── setJourneyEnabled()
//              ├── setBookingEnabled()
//              ├── setPaymentEnabled()
//              ├── setWalletEnabled()
//              ├── setTrustEnabled()
//              ├── setVerificationEnabled()
//              ├── setMessageEnabled()
//              ├── setSupportEnabled()
//              └── setSystemEnabled()
//              │
//              ▼
// NotificationPreferenceUpdatedEvent
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

import type { NotificationPreferencePublicId } from '../../domain/value-objects/notification-preference-public-id.vo';

// =============================================================================
// Command
// =============================================================================

export class UpdateNotificationPreferenceCommand extends Command {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identity of the Notification Preference aggregate.
     *
     * This identifies the preference aggregate to be updated.
     */
    public readonly preferencePublicId: NotificationPreferencePublicId,

    /**
     * Desired Journey notification preference.
     */
    public readonly journeyEnabled: boolean,

    /**
     * Desired Booking notification preference.
     */
    public readonly bookingEnabled: boolean,

    /**
     * Desired Payment notification preference.
     */
    public readonly paymentEnabled: boolean,

    /**
     * Desired Wallet notification preference.
     */
    public readonly walletEnabled: boolean,

    /**
     * Desired Trust notification preference.
     */
    public readonly trustEnabled: boolean,

    /**
     * Desired Verification notification preference.
     */
    public readonly verificationEnabled: boolean,

    /**
     * Desired Message notification preference.
     */
    public readonly messageEnabled: boolean,

    /**
     * Desired Support notification preference.
     */
    public readonly supportEnabled: boolean,

    /**
     * Desired System notification preference.
     */
    public readonly systemEnabled: boolean,

    /**
     * Application-level correlation identity.
     *
     * Used to correlate this command with the resulting domain event
     * and downstream application processing.
     */
    public readonly correlationId: string,

    /**
     * Optional update timestamp.
     *
     * When omitted, the application handler supplies the current time.
     */
    public readonly updatedAt: Date | undefined = undefined,

    /**
     * Optional causation identity.
     *
     * Identifies the command or event that caused this operation,
     * when applicable.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default UpdateNotificationPreferenceCommand;
