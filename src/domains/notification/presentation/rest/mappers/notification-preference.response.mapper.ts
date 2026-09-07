// -----------------------------------------------------------------------------
// Notification Preference — Response Mapper
// -----------------------------------------------------------------------------
//
// Maps the NotificationPreferenceAggregate / NotificationPreferenceEntity
// domain model into an application-facing NotificationPreferenceResponse.
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
// Mapping principles:
//
// - expose Notification Preference-safe state;
// - serialize value objects into primitives;
// - expose the Notification Preference public identity;
// - expose the member public identity;
// - expose all nine notification preference states;
// - expose preference-state predicates;
// - expose preference summary information;
// - expose lifecycle timestamps;
// - return defensive Date instances;
// - exclude internal persistence identity.
//
// -----------------------------------------------------------------------------
//
// This mapper does NOT:
//
// - mutate the Notification Preference aggregate;
// - mutate the Notification Preference entity;
// - persist Notification Preference;
// - access Prisma;
// - access repositories;
// - resolve members;
// - perform authorization;
// - perform business validation;
// - emit domain events;
// - change Notification Preference state.
//
// -----------------------------------------------------------------------------
//
// Identity:
//
// publicId
//     → externally safe Notification Preference identifier.
//
// memberPublicId
//     → externally safe opaque reference to the owning member.
//
// The internal entity identity (`id`) is intentionally excluded.
//
// -----------------------------------------------------------------------------
//
// Preference categories:
//
// - JOURNEY
// - BOOKING
// - PAYMENT
// - WALLET
// - TRUST
// - VERIFICATION
// - MESSAGE
// - SUPPORT
// - SYSTEM
//
// -----------------------------------------------------------------------------
//
// Preference projections:
//
// - areAllEnabled
// - areAllDisabled
// - hasEnabledPreferences
// - enabledPreferenceCount
// - disabledPreferenceCount
//
// These values are read directly from the domain entity.
//
// -----------------------------------------------------------------------------
//
// Dates:
//
// Date instances are cloned before being placed into the response so that
// callers cannot mutate the domain entity's Date instances through the
// returned response object.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { NotificationPreferenceAggregate } from '../../../domain/aggregates/notification-preference.aggregate';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { NotificationPreferenceEntity } from '../../../domain/entities/notification-preference.entity';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { NotificationException } from '../../../domain/exceptions/notification.exception';

// =============================================================================
// Response
// =============================================================================

export interface NotificationPreferenceResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Notification Preference aggregate.
   *
   * This is the externally safe Notification Preference identifier.
   */
  publicId: string;

  /**
   * Public identifier of the member who owns these preferences.
   *
   * This is an opaque externally safe member reference.
   */
  memberPublicId: string;

  // ---------------------------------------------------------------------------
  // Notification Preference State
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether Journey notifications are enabled.
   */
  journeyEnabled: boolean;

  /**
   * Indicates whether Booking notifications are enabled.
   */
  bookingEnabled: boolean;

  /**
   * Indicates whether Payment notifications are enabled.
   */
  paymentEnabled: boolean;

  /**
   * Indicates whether Wallet notifications are enabled.
   */
  walletEnabled: boolean;

  /**
   * Indicates whether Trust notifications are enabled.
   */
  trustEnabled: boolean;

  /**
   * Indicates whether Verification notifications are enabled.
   */
  verificationEnabled: boolean;

  /**
   * Indicates whether Message notifications are enabled.
   */
  messageEnabled: boolean;

  /**
   * Indicates whether Support notifications are enabled.
   */
  supportEnabled: boolean;

  /**
   * Indicates whether System notifications are enabled.
   */
  systemEnabled: boolean;

  // ---------------------------------------------------------------------------
  // Preference Summary
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether every notification category is enabled.
   */
  areAllEnabled: boolean;

  /**
   * Indicates whether every notification category is disabled.
   */
  areAllDisabled: boolean;

  /**
   * Indicates whether at least one notification category is enabled.
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
   * Timestamp at which the Notification Preference was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the Notification Preference was last updated.
   */
  updatedAt: Date;
}

// =============================================================================
// Mapper
// =============================================================================

export class NotificationPreferenceResponseMapper {
  // ===========================================================================

  // Aggregate -> Response

  // ===========================================================================

  /**
   * Maps a NotificationPreferenceAggregate into an application-facing
   * NotificationPreferenceResponse.
   *
   * The aggregate remains the source of the aggregate boundary, while the
   * NotificationPreferenceEntity remains the authoritative owner of
   * Notification Preference state.
   *
   * No state is changed during mapping.
   */
  public static toResponse(
    aggregate: NotificationPreferenceAggregate,
  ): NotificationPreferenceResponse {
    if (aggregate === undefined || aggregate === null) {
      throw new NotificationException(
        'Notification Preference aggregate is required.',
      );
    }

    return NotificationPreferenceResponseMapper.mapPreference(
      aggregate.preference,
    );
  }

  // ===========================================================================

  // Entity -> Response

  // ===========================================================================

  /**
   * Maps a NotificationPreferenceEntity directly into an
   * application-facing NotificationPreferenceResponse.
   *
   * This is useful for application read workflows that already operate on the
   * aggregate root entity and do not require the aggregate wrapper.
   *
   * The same canonical mapping implementation is used as the aggregate path.
   */
  public static fromEntity(
    preference: NotificationPreferenceEntity,
  ): NotificationPreferenceResponse {
    if (preference === undefined || preference === null) {
      throw new NotificationException(
        'Notification Preference entity is required.',
      );
    }

    return NotificationPreferenceResponseMapper.mapPreference(preference);
  }

  // ===========================================================================

  // Canonical Preference Mapping

  // ===========================================================================

  /**
   * Performs the canonical Notification Preference entity-to-response
   * projection.
   *
   * All response paths delegate to this method so that aggregate and entity
   * mappings cannot drift apart.
   *
   * The mapper only reads domain state.
   *
   * No domain mutation, persistence operation, validation workflow,
   * authorization decision, or event recording occurs here.
   */
  private static mapPreference(
    preference: NotificationPreferenceEntity,
  ): NotificationPreferenceResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: preference.publicId.value,

      memberPublicId: preference.memberPublicId.value,

      // -----------------------------------------------------------------------
      // Notification Preference State
      // -----------------------------------------------------------------------

      journeyEnabled: preference.isJourneyEnabled(),

      bookingEnabled: preference.isBookingEnabled(),

      paymentEnabled: preference.isPaymentEnabled(),

      walletEnabled: preference.isWalletEnabled(),

      trustEnabled: preference.isTrustEnabled(),

      verificationEnabled: preference.isVerificationEnabled(),

      messageEnabled: preference.isMessageEnabled(),

      supportEnabled: preference.isSupportEnabled(),

      systemEnabled: preference.isSystemEnabled(),

      // -----------------------------------------------------------------------
      // Preference Summary
      // -----------------------------------------------------------------------

      areAllEnabled: preference.areAllEnabled(),

      areAllDisabled: preference.areAllDisabled(),

      hasEnabledPreferences: preference.hasEnabledPreferences(),

      enabledPreferenceCount: preference.enabledPreferenceCount(),

      disabledPreferenceCount: preference.disabledPreferenceCount(),

      // -----------------------------------------------------------------------
      // Audit / Lifecycle
      // -----------------------------------------------------------------------

      createdAt: NotificationPreferenceResponseMapper.cloneDate(
        preference.createdAt,
      ),

      updatedAt: NotificationPreferenceResponseMapper.cloneDate(
        preference.updatedAt,
      ),
    };
  }

  // ===========================================================================

  // Date Projection

  // ===========================================================================

  /**
   * Creates a defensive copy of a domain Date value.
   *
   * The domain entity already protects its own Date values, but the response
   * mapper maintains the same boundary explicitly by ensuring that the
   * response owns its Date instances.
   */
  private static cloneDate(value: Date): Date {
    return new Date(value.getTime());
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default NotificationPreferenceResponseMapper;
