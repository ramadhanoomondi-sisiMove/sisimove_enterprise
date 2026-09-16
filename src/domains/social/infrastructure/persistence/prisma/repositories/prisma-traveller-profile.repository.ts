// -----------------------------------------------------------------------------
// sisiMove — Prisma Traveller Profile Repository
// -----------------------------------------------------------------------------
//
// Infrastructure implementation of the TravellerProfileRepository contract.
//
// Aggregate boundary:
//
// TravellerProfileAggregate
// ├── TravellerProfileEntity
// ├── TravellerProfilePreferencesEntity?
// └── TravellerProfileCorridorEntity[]
//
// Ownership:
//
// - TravellerProfile is the aggregate root.
// - Preferences and corridors are aggregate-owned children.
// - Cross-domain references such as memberPublicId remain opaque identifiers.
//
// -----------------------------------------------------------------------------
//
// TRANSACTION PARTICIPATION:
//
// This repository does NOT create its own Prisma transactions.
//
// PrismaTransactionContext determines which Prisma client is currently
// available:
//
//     UnitOfWork
//         │
//         ▼
//     PrismaUnitOfWork
//         │
//         ▼
//     Prisma $transaction(tx)
//         │
//         ▼
//     PrismaTransactionContext
//         │
//         ▼
//     PrismaTravellerProfileRepository
//
// When called inside a UnitOfWork, all operations use the transaction-scoped
// Prisma client.
//
// When called outside a UnitOfWork, the context falls back to PrismaService.
//
// -----------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma/client';

import {
  PrismaTransactionContext,
  type PrismaClientLike,
} from '../../../../../../infrastructure/database/prisma/prisma-transaction.context';

import { TravellerProfileAggregate } from '../../../../domain/aggregates/traveller-profile.aggregate';

import type { TravellerProfileRepository } from '../../../../domain/repositories/traveller-profile.repository';

import type { TravellerProfileEntity } from '../../../../domain/entities/traveller-profile.entity';
import type { TravellerProfilePreferencesEntity } from '../../../../domain/entities/traveller-profile-preferences.entity';
import type { TravellerProfileCorridorEntity } from '../../../../domain/entities/traveller-profile-corridor.entity';

import type { TravellerProfileId } from '../../../../domain/value-objects/traveller-profile-id.vo';
import type { TravellerProfilePublicId } from '../../../../domain/value-objects/traveller-profile-public-id.vo';
import type { MemberPublicId } from '../../../../domain/value-objects/member-public-id.vo';
import type { TravellerHandle } from '../../../../domain/value-objects/traveller-handle.vo';
import type { TravellerProfileCorridorId } from '../../../../domain/value-objects/traveller-profile-corridor-id.vo';
import type { CorridorKey } from '../../../../domain/value-objects/corridor-key.vo';

import {
  TravellerProfilePrismaMapper,
  TravellerProfilePreferencesPrismaMapper,
  TravellerProfileCorridorPrismaMapper,
} from '../mappers';

// =============================================================================
// Prisma Payload
// =============================================================================

type TravellerProfileWithComponents = Prisma.TravellerProfileGetPayload<{
  include: {
    preferences: true;
    corridors: {
      orderBy: {
        createdAt: 'asc';
      };
    };
  };
}>;

// =============================================================================
// Repository
// =============================================================================

@Injectable()
export class PrismaTravellerProfileRepository implements TravellerProfileRepository {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  /**
   * Resolves the Prisma client through the ambient transaction context.
   *
   * The repository therefore participates automatically in the transaction
   * created by PrismaUnitOfWork when one is active.
   */
  public constructor(
    private readonly transactionContext: PrismaTransactionContext,
  ) {}

  // ===========================================================================
  // Current Prisma Client
  // ===========================================================================

  /**
   * Returns the Prisma client appropriate for the current execution context.
   *
   * Inside UnitOfWork:
   *
   *     Prisma.TransactionClient
   *
   * Outside UnitOfWork:
   *
   *     PrismaService
   */
  private get prisma(): PrismaClientLike {
    return this.transactionContext.getClient();
  }

  // ===========================================================================
  // Aggregate Persistence
  // ===========================================================================

  /**
   * Persists the complete current TravellerProfile aggregate.
   *
   * No repository-owned transaction is created.
   *
   * Profile, preferences, and corridors therefore participate in the caller's
   * transaction when this method executes inside PrismaUnitOfWork.
   */
  public async save(aggregate: TravellerProfileAggregate): Promise<void> {
    const profile = aggregate.profile;

    // -------------------------------------------------------------------------
    // Profile
    // -------------------------------------------------------------------------

    await this.prisma.travellerProfile.upsert({
      where: {
        id: profile.id.toString(),
      },

      create: TravellerProfilePrismaMapper.toPersistence(profile),

      update: TravellerProfilePrismaMapper.toUpdate(profile),
    });

    const profileId = profile.id.toString();

    // -------------------------------------------------------------------------
    // Preferences
    // -------------------------------------------------------------------------

    const preferences = aggregate.preferences;

    if (preferences !== undefined) {
      await this.prisma.travellerProfilePreferences.upsert({
        where: {
          profileId,
        },

        create:
          TravellerProfilePreferencesPrismaMapper.toPersistence(preferences),

        update: TravellerProfilePreferencesPrismaMapper.toUpdate(preferences),
      });
    } else {
      await this.prisma.travellerProfilePreferences.deleteMany({
        where: {
          profileId,
        },
      });
    }

    // -------------------------------------------------------------------------
    // Corridors
    // -------------------------------------------------------------------------

    const corridors = aggregate.corridors;

    const corridorIds = corridors.map((corridor) => corridor.id.toString());

    // Remove persisted corridors that no longer belong to the aggregate.
    await this.prisma.travellerProfileCorridor.deleteMany({
      where: {
        profileId,

        ...(corridorIds.length > 0
          ? {
              id: {
                notIn: corridorIds,
              },
            }
          : {}),
      },
    });

    // Persist the current aggregate corridor set.
    for (const corridor of corridors) {
      await this.prisma.travellerProfileCorridor.upsert({
        where: {
          id: corridor.id.toString(),
        },

        create: TravellerProfileCorridorPrismaMapper.toPersistence(corridor),

        update: TravellerProfileCorridorPrismaMapper.toUpdate(corridor),
      });
    }
  }

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  public async findById(
    id: TravellerProfileId,
  ): Promise<TravellerProfileAggregate | null> {
    const record = await this.prisma.travellerProfile.findUnique({
      where: {
        id: id.toString(),
      },

      include: {
        preferences: true,

        corridors: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    return record === null ? null : this.toAggregate(record);
  }

  public async findByPublicId(
    publicId: TravellerProfilePublicId,
  ): Promise<TravellerProfileAggregate | null> {
    return this.findAggregateByPublicId(publicId.value);
  }

  public async findByMemberPublicId(
    memberPublicId: MemberPublicId,
  ): Promise<TravellerProfileAggregate | null> {
    const record = await this.prisma.travellerProfile.findUnique({
      where: {
        memberPublicId: memberPublicId.value,
      },

      include: {
        preferences: true,

        corridors: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    return record === null ? null : this.toAggregate(record);
  }

  public async findByHandle(
    handle: TravellerHandle,
  ): Promise<TravellerProfileAggregate | null> {
    const record = await this.prisma.travellerProfile.findUnique({
      where: {
        handle: handle.value,
      },

      include: {
        preferences: true,

        corridors: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    return record === null ? null : this.toAggregate(record);
  }

  // ===========================================================================
  // Delete / Exists
  // ===========================================================================

  /**
   * Deletes the profile.
   *
   * No repository-owned transaction is created.
   */
  public async delete(id: TravellerProfileId): Promise<void> {
    const profile = await this.prisma.travellerProfile.findUnique({
      where: {
        id: id.toString(),
      },

      select: {
        id: true,
      },
    });

    if (profile === null) {
      return;
    }

    await this.prisma.travellerProfile.delete({
      where: {
        id: profile.id,
      },
    });
  }

  public async exists(id: TravellerProfileId): Promise<boolean> {
    const count = await this.prisma.travellerProfile.count({
      where: {
        id: id.toString(),
      },
    });

    return count > 0;
  }

  public async existsByMemberPublicId(
    memberPublicId: MemberPublicId,
  ): Promise<boolean> {
    const count = await this.prisma.travellerProfile.count({
      where: {
        memberPublicId: memberPublicId.value,
      },
    });

    return count > 0;
  }

  public async existsByHandle(handle: TravellerHandle): Promise<boolean> {
    const count = await this.prisma.travellerProfile.count({
      where: {
        handle: handle.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Profile Entity Queries
  // ===========================================================================

  public async findProfileById(
    id: TravellerProfileId,
  ): Promise<TravellerProfileEntity | null> {
    const record = await this.prisma.travellerProfile.findUnique({
      where: {
        id: id.toString(),
      },
    });

    return record === null
      ? null
      : TravellerProfilePrismaMapper.toDomain(record);
  }

  public async findProfileByPublicId(
    publicId: TravellerProfilePublicId,
  ): Promise<TravellerProfileEntity | null> {
    const record = await this.prisma.travellerProfile.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    return record === null
      ? null
      : TravellerProfilePrismaMapper.toDomain(record);
  }

  public async findProfileByMemberPublicId(
    memberPublicId: MemberPublicId,
  ): Promise<TravellerProfileEntity | null> {
    const record = await this.prisma.travellerProfile.findUnique({
      where: {
        memberPublicId: memberPublicId.value,
      },
    });

    return record === null
      ? null
      : TravellerProfilePrismaMapper.toDomain(record);
  }

  public async findProfileByHandle(
    handle: TravellerHandle,
  ): Promise<TravellerProfileEntity | null> {
    const record = await this.prisma.travellerProfile.findUnique({
      where: {
        handle: handle.value,
      },
    });

    return record === null
      ? null
      : TravellerProfilePrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Preferences
  // ===========================================================================

  public async findPreferences(
    profileId: TravellerProfileId,
  ): Promise<TravellerProfilePreferencesEntity | null> {
    const profile = await this.prisma.travellerProfile.findUnique({
      where: {
        id: profileId.toString(),
      },

      select: {
        id: true,
      },
    });

    if (profile === null) {
      return null;
    }

    const record = await this.prisma.travellerProfilePreferences.findUnique({
      where: {
        profileId: profile.id,
      },
    });

    return record === null
      ? null
      : TravellerProfilePreferencesPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Corridors
  // ===========================================================================

  public async findCorridorById(
    corridorId: TravellerProfileCorridorId,
  ): Promise<TravellerProfileCorridorEntity | null> {
    const record = await this.prisma.travellerProfileCorridor.findUnique({
      where: {
        publicId: corridorId.value,
      },
    });

    return record === null
      ? null
      : TravellerProfileCorridorPrismaMapper.toDomain(record);
  }

  public async findCorridors(
    profileId: TravellerProfileId,
  ): Promise<TravellerProfileCorridorEntity[]> {
    const profile = await this.prisma.travellerProfile.findUnique({
      where: {
        id: profileId.toString(),
      },

      select: {
        id: true,
      },
    });

    if (profile === null) {
      return [];
    }

    const records = await this.prisma.travellerProfileCorridor.findMany({
      where: {
        profileId: profile.id,
      },

      orderBy: [
        {
          isPrimary: 'desc',
        },

        {
          createdAt: 'asc',
        },
      ],
    });

    return records.map((record) =>
      TravellerProfileCorridorPrismaMapper.toDomain(record),
    );
  }

  public async findPrimaryCorridor(
    profileId: TravellerProfileId,
  ): Promise<TravellerProfileCorridorEntity | null> {
    const profile = await this.prisma.travellerProfile.findUnique({
      where: {
        id: profileId.toString(),
      },

      select: {
        id: true,
      },
    });

    if (profile === null) {
      return null;
    }

    const record = await this.prisma.travellerProfileCorridor.findFirst({
      where: {
        profileId: profile.id,
        isPrimary: true,
      },

      orderBy: {
        createdAt: 'asc',
      },
    });

    return record === null
      ? null
      : TravellerProfileCorridorPrismaMapper.toDomain(record);
  }

  public async existsCorridorByKey(
    profileId: TravellerProfileId,
    corridorKey: CorridorKey,
  ): Promise<boolean> {
    if (!corridorKey.hasValue) {
      return false;
    }

    const profile = await this.prisma.travellerProfile.findUnique({
      where: {
        id: profileId.toString(),
      },

      select: {
        id: true,
      },
    });

    if (profile === null) {
      return false;
    }

    const count = await this.prisma.travellerProfileCorridor.count({
      where: {
        profileId: profile.id,
        corridorKey: corridorKey.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Internal Aggregate Reconstruction
  // ===========================================================================

  private async findAggregateByPublicId(
    publicId: string,
  ): Promise<TravellerProfileAggregate | null> {
    const record = await this.prisma.travellerProfile.findUnique({
      where: {
        publicId,
      },

      include: {
        preferences: true,

        corridors: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    return record === null ? null : this.toAggregate(record);
  }

  private toAggregate(
    record: TravellerProfileWithComponents,
  ): TravellerProfileAggregate {
    const profile = TravellerProfilePrismaMapper.toDomain(record);

    const preferences =
      record.preferences !== null
        ? TravellerProfilePreferencesPrismaMapper.toDomain(record.preferences)
        : undefined;

    const corridors = record.corridors.map((corridor) =>
      TravellerProfileCorridorPrismaMapper.toDomain(corridor),
    );

    return TravellerProfileAggregate.rehydrate(profile, preferences, corridors);
  }
}

export default PrismaTravellerProfileRepository;
