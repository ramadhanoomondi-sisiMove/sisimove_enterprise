// -----------------------------------------------------------------------------
// sisiMove — Notification Preferences Model
// -----------------------------------------------------------------------------
//
// Frontend representation of the NotificationPreferenceResponse returned by
// the backend application layer.
//
// Backend aggregate:
//
// NotificationPreferenceAggregate
// └── NotificationPreferenceEntity
//
// The frontend does NOT reproduce the aggregate or entity.
//
// The backend response mapper is the source of truth for the response shape.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - represent the member-facing Notification Preference response;
// - expose all nine preference states;
// - expose backend-projected preference summary information;
// - expose public identities;
// - expose serialized lifecycle timestamps.
//
// -----------------------------------------------------------------------------
//
// The frontend does NOT:
//
// - calculate aggregate/domain state as a replacement for the backend;
// - validate member existence;
// - reproduce NotificationPreferenceEntity invariants;
// - record domain events;
// - perform persistence;
// - authorize preference changes.
//
// -----------------------------------------------------------------------------
//
// Update contract:
//
// PATCH /notification-preferences/:preferencePublicId
//
// accepts the complete desired preference state.
//
// Server-owned fields such as:
//
// - publicId
// - memberPublicId
// - summary fields
// - createdAt
// - updatedAt
//
// are not part of the update request.
// -----------------------------------------------------------------------------

// =============================================================================
// Notification Preferences
// =============================================================================

export interface NotificationPreferences {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Notification Preference aggregate.
   */
  publicId: string;

  /**
   * Opaque public identity reference of the owning member.
   */
  memberPublicId: string;

  // ---------------------------------------------------------------------------
  // Preference State
  // ---------------------------------------------------------------------------

  /**
   * Whether Journey notifications are enabled.
   */
  journeyEnabled: boolean;

  /**
   * Whether Booking notifications are enabled.
   */
  bookingEnabled: boolean;

  /**
   * Whether Payment notifications are enabled.
   */
  paymentEnabled: boolean;

  /**
   * Whether Wallet notifications are enabled.
   */
  walletEnabled: boolean;

  /**
   * Whether Trust notifications are enabled.
   */
  trustEnabled: boolean;

  /**
   * Whether Verification notifications are enabled.
   */
  verificationEnabled: boolean;

  /**
   * Whether Message notifications are enabled.
   */
  messageEnabled: boolean;

  /**
   * Whether Support notifications are enabled.
   */
  supportEnabled: boolean;

  /**
   * Whether System notifications are enabled.
   */
  systemEnabled: boolean;

  // ---------------------------------------------------------------------------
  // Backend-projected Preference Summary
  // ---------------------------------------------------------------------------
  //
  // These values are deliberately part of the frontend response model because
  // NotificationPreferenceResponseMapper exposes them as application-facing
  // state.
  //
  // They should not be treated as authoritative mutation mechanisms.
  // ---------------------------------------------------------------------------

  /**
   * Whether every notification category is enabled.
   */
  areAllEnabled: boolean;

  /**
   * Whether every notification category is disabled.
   */
  areAllDisabled: boolean;

  /**
   * Whether at least one notification category is enabled.
   */
  hasEnabledPreferences: boolean;

  /**
   * Number of enabled notification categories.
   */
  enabledPreferenceCount: number;

  /**
   * Number of disabled notification categories.
   */
  disabledPreferenceCount: number;

  // ---------------------------------------------------------------------------
  // Audit / Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * ISO-8601 creation timestamp returned by the HTTP API.
   */
  createdAt: string;

  /**
   * ISO-8601 last-update timestamp returned by the HTTP API.
   */
  updatedAt: string;
}

// =============================================================================
// Update Request
// =============================================================================
//
// The backend PATCH operation represents the complete desired preference
// state.
//
// Server-owned response properties are intentionally excluded.
// =============================================================================

export interface UpdateNotificationPreferencesRequest {
  journeyEnabled: boolean;
  bookingEnabled: boolean;
  paymentEnabled: boolean;
  walletEnabled: boolean;
  trustEnabled: boolean;
  verificationEnabled: boolean;
  messageEnabled: boolean;
  supportEnabled: boolean;
  systemEnabled: boolean;
}

// =============================================================================
// Preference Key
// =============================================================================
//
// A preference key is one of the mutable fields accepted by the backend
// complete-state update contract.
//
// Deriving this type from UpdateNotificationPreferencesRequest prevents the
// frontend presentation layer from introducing keys that are not accepted by
// the backend PATCH contract.
// =============================================================================

export type NotificationPreferenceKey =
  keyof UpdateNotificationPreferencesRequest;