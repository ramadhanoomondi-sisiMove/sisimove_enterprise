// -----------------------------------------------------------------------------
// Notification Preference — Prisma Repository
// -----------------------------------------------------------------------------
//
// Prisma implementation of the NotificationPreferenceRepository.
//
// Aggregate:
//
// NotificationPreferenceAggregate
// └── NotificationPreferenceEntity
//
// Persistence:
//
// NotificationPreference
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Persist Notification Preference aggregates.
// - Delete Notification Preference aggregates.
// - Retrieve Notification Preference aggregates.
// - Retrieve Notification Preference entities.
// - Query preferences by public identity.
// - Query preferences by internal identity.
// - Query preferences by member public identity.
// - Query all notification preferences.
// - Execute existence checks.
//
// -----------------------------------------------------------------------------
//
// This repository contains persistence concerns only.
//
// It does NOT:
//
// - Load Identity aggregates.
// - Validate Identity aggregate state.
// - Perform authorization.
// - Decide whether notifications should be delivered.
// - Send notifications.
// - Deliver push notifications.
// - Send email.
// - Send SMS.
// - Communicate with external notification providers.
// - Publish domain events.
// - Perform application orchestration.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundary:
//
// NotificationPreferenceAggregate
// └── NotificationPreferenceEntity
//
// The repository persists and reconstructs this consistency boundary.
//
// -----------------------------------------------------------------------------
//
// Cross-domain reference:
//
// NotificationPreferenceEntity:
//
//     memberPublicId
//          ↓
//     Identity.publicId
//
// memberPublicId is an opaque public reference.
//
// The repository uses the value only for persistence queries.
// It never dereferences or loads the Identity aggregate.
//
// -----------------------------------------------------------------------------
//
// Persistence strategy:
//
// save() delegates domain-to-persistence mapping to
// NotificationPreferencePrismaMapper.
//
// The mapper is the single source of truth for:
//
// - internal identity;
// - public identity;
// - member public identity;
// - all nine preference flags;
// - creation timestamp;
// - update timestamp.
//
// -----------------------------------------------------------------------------
//
// Important:
//
// NotificationPreference.memberPublicId is UNIQUE in Prisma.
//
// Therefore:
//
//     one member
//        ↓
//     one NotificationPreference aggregate
//
// findByMemberPublicId() uses Prisma findUnique().
//
// -----------------------------------------------------------------------------
//
// Rehydration:
//
// Prisma record
//      ↓
// NotificationPreferencePrismaMapper.preferenceToDomain()
//      ↓
// NotificationPreferenceEntity
//      ↓
// NotificationPreferenceAggregate.rehydrate()
//      ↓
// NotificationPreferenceAggregate
//
// Rehydration never emits domain events.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Prisma
// -----------------------------------------------------------------------------

import { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

// -----------------------------------------------------------------------------
// Repository Contract
// -----------------------------------------------------------------------------

import type { NotificationPreferenceRepository } from '../../../../domain/repositories/notification-preference.repository';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import { NotificationPreferenceAggregate } from '../../../../domain/aggregates/notification-preference.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { NotificationPreferenceEntity } from '../../../../domain/entities/notification-preference.entity';

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

import { NotificationPreferencePrismaMapper } from '../mappers/notification-preference-prisma.mapper';

// -----------------------------------------------------------------------------
// Value Objects — Member
// -----------------------------------------------------------------------------

import type { NotificationMemberPublicId } from '../../../../domain/value-objects/notification-member-public-id.vo';

// -----------------------------------------------------------------------------
// Value Objects — Preference
// -----------------------------------------------------------------------------

import type { NotificationPreferencePublicId } from '../../../../domain/value-objects/notification-preference-public-id.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Repository
// =============================================================================

@Injectable()
export class PrismaNotificationPreferenceRepository implements NotificationPreferenceRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  /**
   * Prisma access is provided through the application's NestJS-managed
   * PrismaService.
   */
  public constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a Notification Preference aggregate.
   *
   * Persistence mapping is delegated entirely to
   * NotificationPreferencePrismaMapper.
   *
   * The aggregate's public identity is used as the stable Prisma upsert
   * identity.
   */
  public async save(aggregate: NotificationPreferenceAggregate): Promise<void> {
    this.ensureAggregate(
      aggregate,
      'Notification Preference aggregate is required.',
    );

    const persistence =
      NotificationPreferencePrismaMapper.toPersistence(aggregate);

    const preference = persistence.preference;

    await this.prisma.notificationPreference.upsert({
      where: {
        publicId: preference.publicId,
      },

      create: {
        id: preference.id,
        publicId: preference.publicId,

        memberPublicId: preference.memberPublicId,

        journeyEnabled: preference.journeyEnabled,
        bookingEnabled: preference.bookingEnabled,
        paymentEnabled: preference.paymentEnabled,
        walletEnabled: preference.walletEnabled,
        trustEnabled: preference.trustEnabled,
        verificationEnabled: preference.verificationEnabled,
        messageEnabled: preference.messageEnabled,
        supportEnabled: preference.supportEnabled,
        systemEnabled: preference.systemEnabled,

        createdAt: preference.createdAt,
        updatedAt: preference.updatedAt,
      },

      update: {
        publicId: preference.publicId,

        memberPublicId: preference.memberPublicId,

        journeyEnabled: preference.journeyEnabled,
        bookingEnabled: preference.bookingEnabled,
        paymentEnabled: preference.paymentEnabled,
        walletEnabled: preference.walletEnabled,
        trustEnabled: preference.trustEnabled,
        verificationEnabled: preference.verificationEnabled,
        messageEnabled: preference.messageEnabled,
        supportEnabled: preference.supportEnabled,
        systemEnabled: preference.systemEnabled,

        updatedAt: preference.updatedAt,
      },
    });
  }

  /**
   * Deletes a Notification Preference aggregate.
   *
   * Deletion is a persistence concern.
   *
   * No domain lifecycle transition is executed.
   */
  public async delete(
    aggregate: NotificationPreferenceAggregate,
  ): Promise<void> {
    this.ensureAggregate(
      aggregate,
      'Notification Preference aggregate is required.',
    );

    await this.prisma.notificationPreference.delete({
      where: {
        id: aggregate.id.toString(),
      },
    });
  }

  // ===========================================================================
  // Aggregate Queries — Identity
  // ===========================================================================

  /**
   * Finds a Notification Preference aggregate by public identifier.
   */
  public async findByPublicId(
    publicId: NotificationPreferencePublicId,
  ): Promise<NotificationPreferenceAggregate | null> {
    this.ensureValueObject(
      publicId,
      'Notification Preference public identifier is required.',
    );

    const record = await this.prisma.notificationPreference.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return record === null ? null : this.toAggregate(record);
  }

  /**
   * Finds a Notification Preference aggregate by internal identifier.
   */
  public async findById(
    id: UniqueEntityId,
  ): Promise<NotificationPreferenceAggregate | null> {
    this.ensureId(
      id,
      'Notification Preference internal identifier is required.',
    );

    const record = await this.prisma.notificationPreference.findUnique({
      where: {
        id: id.toString(),
      },
    });

    return record === null ? null : this.toAggregate(record);
  }

  // ===========================================================================
  // Aggregate Queries — Member
  // ===========================================================================

  /**
   * Finds the Notification Preference aggregate belonging to a member.
   *
   * NotificationPreference.memberPublicId is unique in persistence.
   *
   * Therefore a member can have only one Notification Preference aggregate.
   */
  public async findByMemberPublicId(
    memberPublicId: NotificationMemberPublicId,
  ): Promise<NotificationPreferenceAggregate | null> {
    this.ensureMemberPublicId(memberPublicId);

    const record = await this.prisma.notificationPreference.findUnique({
      where: {
        memberPublicId: memberPublicId.value,
      },
    });

    return record === null ? null : this.toAggregate(record);
  }

  // ===========================================================================
  // Aggregate Queries — All
  // ===========================================================================

  /**
   * Finds all Notification Preference aggregates.
   *
   * Results are ordered by creation timestamp followed by internal identity
   * to provide deterministic ordering.
   */
  public async findAll(): Promise<NotificationPreferenceAggregate[]> {
    const records = await this.prisma.notificationPreference.findMany({
      orderBy: [
        {
          createdAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],
    });

    return records.map((record) => this.toAggregate(record));
  }

  // ===========================================================================
  // Entity Queries — Identity
  // ===========================================================================

  /**
   * Finds a Notification Preference entity by public identifier.
   */
  public async findEntityByPublicId(
    publicId: NotificationPreferencePublicId,
  ): Promise<NotificationPreferenceEntity | null> {
    this.ensureValueObject(
      publicId,
      'Notification Preference public identifier is required.',
    );

    const record = await this.prisma.notificationPreference.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return record === null ? null : this.toEntity(record);
  }

  /**
   * Finds a Notification Preference entity by internal identifier.
   */
  public async findEntityById(
    id: UniqueEntityId,
  ): Promise<NotificationPreferenceEntity | null> {
    this.ensureId(
      id,
      'Notification Preference internal identifier is required.',
    );

    const record = await this.prisma.notificationPreference.findUnique({
      where: {
        id: id.toString(),
      },
    });

    return record === null ? null : this.toEntity(record);
  }

  // ===========================================================================
  // Entity Queries — Member
  // ===========================================================================

  /**
   * Finds the Notification Preference entity belonging to a member.
   */
  public async findEntityByMemberPublicId(
    memberPublicId: NotificationMemberPublicId,
  ): Promise<NotificationPreferenceEntity | null> {
    this.ensureMemberPublicId(memberPublicId);

    const record = await this.prisma.notificationPreference.findUnique({
      where: {
        memberPublicId: memberPublicId.value,
      },
    });

    return record === null ? null : this.toEntity(record);
  }

  // ===========================================================================
  // Entity Queries — All
  // ===========================================================================

  /**
   * Finds all Notification Preference entities.
   */
  public async findAllEntities(): Promise<NotificationPreferenceEntity[]> {
    const records = await this.prisma.notificationPreference.findMany({
      orderBy: [
        {
          createdAt: 'asc',
        },
        {
          id: 'asc',
        },
      ],
    });

    return records.map((record) => this.toEntity(record));
  }

  // ===========================================================================
  // Existence — Identity
  // ===========================================================================

  /**
   * Checks existence by Notification Preference public identifier.
   */
  public async existsByPublicId(
    publicId: NotificationPreferencePublicId,
  ): Promise<boolean> {
    this.ensureValueObject(
      publicId,
      'Notification Preference public identifier is required.',
    );

    const record = await this.prisma.notificationPreference.findUnique({
      where: {
        publicId: publicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  /**
   * Checks existence by Notification Preference internal identifier.
   */
  public async existsById(id: UniqueEntityId): Promise<boolean> {
    this.ensureId(
      id,
      'Notification Preference internal identifier is required.',
    );

    const record = await this.prisma.notificationPreference.findUnique({
      where: {
        id: id.toString(),
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Existence — Member
  // ===========================================================================

  /**
   * Checks whether a member has Notification Preferences.
   */
  public async existsByMemberPublicId(
    memberPublicId: NotificationMemberPublicId,
  ): Promise<boolean> {
    this.ensureMemberPublicId(memberPublicId);

    const record = await this.prisma.notificationPreference.findUnique({
      where: {
        memberPublicId: memberPublicId.value,
      },

      select: {
        id: true,
      },
    });

    return record !== null;
  }

  // ===========================================================================
  // Private — Mapping
  // ===========================================================================

  /**
   * Converts a Prisma Notification Preference record into a domain
   * aggregate.
   *
   * The mapper performs the actual domain reconstruction.
   */
  private toAggregate(
    record: Parameters<
      typeof NotificationPreferencePrismaMapper.preferenceToDomain
    >[0],
  ): NotificationPreferenceAggregate {
    const entity = this.toEntity(record);

    return NotificationPreferenceAggregate.rehydrate(entity);
  }

  /**
   * Converts a Prisma Notification Preference record into a domain entity.
   */
  private toEntity(
    record: Parameters<
      typeof NotificationPreferencePrismaMapper.preferenceToDomain
    >[0],
  ): NotificationPreferenceEntity {
    return NotificationPreferencePrismaMapper.preferenceToDomain(record);
  }

  // ===========================================================================
  // Private — Validation
  // ===========================================================================

  /**
   * Ensures an aggregate is present.
   */
  private ensureAggregate(
    value: NotificationPreferenceAggregate,
    message: string,
  ): void {
    if (value === undefined || value === null) {
      throw new Error(message);
    }
  }

  /**
   * Ensures an internal identifier is present.
   */
  private ensureId(value: UniqueEntityId, message: string): void {
    if (value === undefined || value === null) {
      throw new Error(message);
    }
  }

  /**
   * Ensures a member public identifier is present.
   */
  private ensureMemberPublicId(value: NotificationMemberPublicId): void {
    if (value === undefined || value === null) {
      throw new Error('Notification Member public identifier is required.');
    }
  }

  /**
   * Ensures a generic Value Object is present.
   */
  private ensureValueObject<T>(value: T, message: string): void {
    if (value === undefined || value === null) {
      throw new Error(message);
    }
  }
}

// =============================================================================
// Default Export
// =============================================================================

export default PrismaNotificationPreferenceRepository;
