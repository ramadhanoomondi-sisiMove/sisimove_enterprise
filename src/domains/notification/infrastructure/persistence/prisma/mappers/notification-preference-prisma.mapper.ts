// -----------------------------------------------------------------------------
// Notification Preference — Prisma Mapper
// -----------------------------------------------------------------------------
//
// Maps the Notification Preference aggregate:
//
// NotificationPreferenceAggregate
// └── NotificationPreferenceEntity
//
// Persistence:
//
// NotificationPreference
//
// Notification Preference is an independent aggregate root.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - map Prisma NotificationPreference records into the domain;
// - rehydrate NotificationPreferenceEntity without emitting domain events;
// - map NotificationPreferenceEntity into Prisma persistence values;
// - map NotificationPreferenceAggregate into persistence;
// - preserve internal entity identity;
// - preserve public identity;
// - preserve member public identity;
// - translate Prisma primitive values into domain value objects;
// - preserve all nine notification preference flags;
// - preserve creation and update timestamps;
// - preserve persisted preference state exactly.
//
// -----------------------------------------------------------------------------
//
// Cross-domain reference:
//
// memberPublicId
//     → Identity.publicId
//
// The member identity remains an opaque NotificationMemberPublicId value
// object.
//
// No Identity aggregate is loaded here.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundary:
//
// NotificationPreferenceAggregate
// └── NotificationPreferenceEntity
//
// Notification Preference contains no aggregate-owned child entities.
//
// NotificationDelivery and Notification are separate persistence models and
// are NOT mapped by this mapper.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import type { NotificationPreference as PrismaNotificationPreference } from '@prisma/client';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { NotificationPreferenceAggregate } from '../../../../domain/aggregates/notification-preference.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import { NotificationPreferenceEntity } from '../../../../domain/entities/notification-preference.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import { NotificationMemberPublicId } from '../../../../domain/value-objects/notification-member-public-id.vo';

import { NotificationPreferencePublicId } from '../../../../domain/value-objects/notification-preference-public-id.vo';

// =============================================================================
// Persistence Types
// =============================================================================

/**
 * Persistence representation of the Notification Preference aggregate.
 *
 * Notification Preference is a single-entity aggregate.
 *
 * No aggregate-owned child collection is persisted through this mapper.
 */
export interface NotificationPreferencePersistence {
  preference: ReturnType<
    typeof NotificationPreferencePrismaMapper.preferenceToPersistence
  >;
}

// =============================================================================
// Mapper
// =============================================================================

export class NotificationPreferencePrismaMapper {
  // ===========================================================================

  // Prisma → Domain Aggregate

  // ===========================================================================

  /**
   * Rehydrates a complete Notification Preference aggregate from a Prisma
   * NotificationPreference record.
   *
   * Rehydration never records domain events.
   */
  public static toDomain(
    record: PrismaNotificationPreference,
  ): NotificationPreferenceAggregate {
    if (record === undefined || record === null) {
      throw new Error('Notification Preference Prisma record is required.');
    }

    return NotificationPreferenceAggregate.rehydrate(
      this.preferenceToDomain(record),
    );
  }

  // ===========================================================================

  // Prisma → Domain Entity

  // ===========================================================================

  /**
   * Rehydrates a NotificationPreferenceEntity from a persisted Prisma record.
   *
   * Mapping:
   *
   * Prisma id
   *     ↓
   * UniqueEntityId
   *
   * Prisma publicId
   *     ↓
   * NotificationPreferencePublicId
   *
   * Prisma memberPublicId
   *     ↓
   * NotificationMemberPublicId
   *
   * Prisma journeyEnabled
   *     ↓
   * journeyEnabled
   *
   * Prisma bookingEnabled
   *     ↓
   * bookingEnabled
   *
   * Prisma paymentEnabled
   *     ↓
   * paymentEnabled
   *
   * Prisma walletEnabled
   *     ↓
   * walletEnabled
   *
   * Prisma trustEnabled
   *     ↓
   * trustEnabled
   *
   * Prisma verificationEnabled
   *     ↓
   * verificationEnabled
   *
   * Prisma messageEnabled
   *     ↓
   * messageEnabled
   *
   * Prisma supportEnabled
   *     ↓
   * supportEnabled
   *
   * Prisma systemEnabled
   *     ↓
   * systemEnabled
   *
   * Prisma createdAt
   *     ↓
   * defensive Date
   *
   * Prisma updatedAt
   *     ↓
   * defensive Date
   *
   * Rehydration does not emit domain events.
   */
  public static preferenceToDomain(
    record: PrismaNotificationPreference,
  ): NotificationPreferenceEntity {
    if (record === undefined || record === null) {
      throw new Error('Notification Preference Prisma record is required.');
    }

    // -------------------------------------------------------------------------
    // Public Identity
    // -------------------------------------------------------------------------
    //
    // NotificationPreferencePublicId exposes a public constructor.
    //

    const publicId = new NotificationPreferencePublicId(record.publicId);

    // -------------------------------------------------------------------------
    // Member Public Identity
    // -------------------------------------------------------------------------
    //
    // This is an opaque reference to Identity.publicId.
    //
    // No Identity aggregate is loaded or validated here.
    //

    const memberPublicId = NotificationMemberPublicId.create(
      record.memberPublicId,
    );

    // -------------------------------------------------------------------------
    // Domain Rehydration
    // -------------------------------------------------------------------------

    return NotificationPreferenceEntity.rehydrate(
      {
        // ---------------------------------------------------------------------
        // Member Reference
        // ---------------------------------------------------------------------

        memberPublicId,

        // ---------------------------------------------------------------------
        // Preference State
        // ---------------------------------------------------------------------

        journeyEnabled: record.journeyEnabled,

        bookingEnabled: record.bookingEnabled,

        paymentEnabled: record.paymentEnabled,

        walletEnabled: record.walletEnabled,

        trustEnabled: record.trustEnabled,

        verificationEnabled: record.verificationEnabled,

        messageEnabled: record.messageEnabled,

        supportEnabled: record.supportEnabled,

        systemEnabled: record.systemEnabled,

        // ---------------------------------------------------------------------
        // Audit
        // ---------------------------------------------------------------------

        createdAt: new Date(record.createdAt.getTime()),

        updatedAt: new Date(record.updatedAt.getTime()),
      },

      // -----------------------------------------------------------------------
      // Internal Entity Identity
      // -----------------------------------------------------------------------

      new UniqueEntityId(record.id),

      // -----------------------------------------------------------------------
      // Public Entity Identity
      // -----------------------------------------------------------------------

      publicId,
    );
  }

  // ===========================================================================

  // Domain Entity → Prisma Persistence

  // ===========================================================================

  /**
   * Maps NotificationPreferenceEntity into its Prisma persistence shape.
   *
   * Domain value objects are serialized into primitive persistence values.
   */
  public static preferenceToPersistence(entity: NotificationPreferenceEntity): {
    id: string;
    publicId: string;
    memberPublicId: string;

    journeyEnabled: boolean;
    bookingEnabled: boolean;
    paymentEnabled: boolean;
    walletEnabled: boolean;
    trustEnabled: boolean;
    verificationEnabled: boolean;
    messageEnabled: boolean;
    supportEnabled: boolean;
    systemEnabled: boolean;

    createdAt: Date;
    updatedAt: Date;
  } {
    if (entity === undefined || entity === null) {
      throw new Error('Notification Preference entity is required.');
    }

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      id: entity.id.toString(),

      publicId: entity.publicId.value,

      // -----------------------------------------------------------------------
      // Cross-domain Member Reference
      // -----------------------------------------------------------------------

      memberPublicId: entity.memberPublicId.value,

      // -----------------------------------------------------------------------
      // Preference State
      // -----------------------------------------------------------------------

      journeyEnabled: entity.isJourneyEnabled(),

      bookingEnabled: entity.isBookingEnabled(),

      paymentEnabled: entity.isPaymentEnabled(),

      walletEnabled: entity.isWalletEnabled(),

      trustEnabled: entity.isTrustEnabled(),

      verificationEnabled: entity.isVerificationEnabled(),

      messageEnabled: entity.isMessageEnabled(),

      supportEnabled: entity.isSupportEnabled(),

      systemEnabled: entity.isSystemEnabled(),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================

  // Aggregate → Persistence

  // ===========================================================================

  /**
   * Converts the complete Notification Preference aggregate into its
   * persistence structure.
   *
   * Notification Preference is a single-entity aggregate, so only the
   * aggregate root entity is persisted.
   */
  public static toPersistence(
    aggregate: NotificationPreferenceAggregate,
  ): NotificationPreferencePersistence {
    if (aggregate === undefined || aggregate === null) {
      throw new Error('Notification Preference aggregate is required.');
    }

    return {
      preference: this.preferenceToPersistence(aggregate.preference),
    };
  }

  // ===========================================================================

  // Component Mapping

  // ===========================================================================

  /**
   * Maps a Prisma NotificationPreference record directly into a
   * NotificationPreferenceEntity.
   */
  public static toPreferenceDomain(
    record: PrismaNotificationPreference,
  ): NotificationPreferenceEntity {
    return this.preferenceToDomain(record);
  }

  /**
   * Maps a Prisma NotificationPreference record into a
   * NotificationPreferenceAggregate.
   */
  public static toPreferenceAggregate(
    record: PrismaNotificationPreference,
  ): NotificationPreferenceAggregate {
    return this.toDomain(record);
  }

  // ===========================================================================

  // Generic Domain Component Mapping

  // ===========================================================================

  /**
   * Maps a Prisma Notification Preference record into its corresponding
   * domain component.
   *
   * Notification Preference has only one aggregate-owned entity, so this
   * resolves directly to NotificationPreferenceEntity.
   */
  public static toDomainComponent(
    record: PrismaNotificationPreference,
  ): NotificationPreferenceEntity {
    return this.preferenceToDomain(record);
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default NotificationPreferencePrismaMapper;
