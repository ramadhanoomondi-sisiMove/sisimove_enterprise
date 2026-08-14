// src/domains/social/infrastructure/persistence/prisma/repositories/prisma-traveller-profile.repository.ts

import type { Prisma } from '@prisma/client';

import type { PrismaService } from '../../../../../../infrastructure/database/prisma/prisma.service';

import type { TravellerProfileRepository } from '../../../../domain/repositories/traveller-profile.repository';

import { TravellerProfileAggregate } from '../../../../domain/aggregates/traveller-profile.aggregate';

import type { TravellerProfileEntity } from '../../../../domain/entities/traveller-profile.entity';
import type { TravellerProfilePreferencesEntity } from '../../../../domain/entities/traveller-profile-preferences.entity';
import type { TravellerProfileCorridorEntity } from '../../../../domain/entities/traveller-profile-corridor.entity';

import {
  TravellerProfilePrismaMapper,
  TravellerProfilePreferencesPrismaMapper,
  TravellerProfileCorridorPrismaMapper,
} from '../mappers';

import type { TravellerProfileId } from '../../../../domain/value-objects/traveller-profile-id.vo';
import type { TravellerProfilePublicId } from '../../../../domain/value-objects/traveller-profile-public-id.vo';
import type { MemberPublicId } from '../../../../domain/value-objects/member-public-id.vo';
import type { TravellerHandle } from '../../../../domain/value-objects/traveller-handle.vo';
import type { TravellerProfileCorridorId } from '../../../../domain/value-objects/traveller-profile-corridor-id.vo';
import type { CorridorKey } from '../../../../domain/value-objects/corridor-key.vo';

// -----------------------------------------------------------------------------
// Prisma Payload
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

export class PrismaTravellerProfileRepository implements TravellerProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  // ===========================================================================
  // Aggregate Persistence
  // ===========================================================================

  async save(aggregate: TravellerProfileAggregate): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const profile = aggregate.profile;

      // -----------------------------------------------------------------------
      // Profile
      // -----------------------------------------------------------------------

      await tx.travellerProfile.upsert({
        where: {
          id: profile.id.toString(),
        },

        create: TravellerProfilePrismaMapper.toPersistence(profile),

        update: TravellerProfilePrismaMapper.toUpdate(profile),
      });

      const profileId = profile.id.toString();

      // -----------------------------------------------------------------------
      // Preferences
      // -----------------------------------------------------------------------

      const preferences = aggregate.preferences;

      if (preferences !== undefined) {
        await tx.travellerProfilePreferences.upsert({
          where: {
            profileId,
          },

          create:
            TravellerProfilePreferencesPrismaMapper.toPersistence(preferences),

          update: TravellerProfilePreferencesPrismaMapper.toUpdate(preferences),
        });
      } else {
        await tx.travellerProfilePreferences.deleteMany({
          where: {
            profileId,
          },
        });
      }

      // -----------------------------------------------------------------------
      // Corridors
      // -----------------------------------------------------------------------

      const corridors = aggregate.corridors;

      const corridorIds = corridors.map((corridor) => corridor.id.toString());

      await tx.travellerProfileCorridor.deleteMany({
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

      for (const corridor of corridors) {
        await tx.travellerProfileCorridor.upsert({
          where: {
            id: corridor.id.toString(),
          },

          create: TravellerProfileCorridorPrismaMapper.toPersistence(corridor),

          update: TravellerProfileCorridorPrismaMapper.toUpdate(corridor),
        });
      }
    });
  }

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  async findById(
    id: TravellerProfileId,
  ): Promise<TravellerProfileAggregate | null> {
    return this.findAggregateByPublicId(id.value);
  }

  async findByPublicId(
    publicId: TravellerProfilePublicId,
  ): Promise<TravellerProfileAggregate | null> {
    return this.findAggregateByPublicId(publicId.value);
  }

  async findByMemberPublicId(
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

    if (record === null) {
      return null;
    }

    return this.toAggregate(record);
  }

  async delete(id: TravellerProfileId): Promise<void> {
    const profile = await this.prisma.travellerProfile.findUnique({
      where: {
        publicId: id.value,
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

  async exists(id: TravellerProfileId): Promise<boolean> {
    const count = await this.prisma.travellerProfile.count({
      where: {
        publicId: id.value,
      },
    });

    return count > 0;
  }

  async existsByMemberPublicId(
    memberPublicId: MemberPublicId,
  ): Promise<boolean> {
    const count = await this.prisma.travellerProfile.count({
      where: {
        memberPublicId: memberPublicId.value,
      },
    });

    return count > 0;
  }

  async existsByHandle(handle: TravellerHandle): Promise<boolean> {
    const count = await this.prisma.travellerProfile.count({
      where: {
        handle: handle.value,
      },
    });

    return count > 0;
  }

  // ===========================================================================
  // Profile Queries
  // ===========================================================================

  async findProfileById(
    id: TravellerProfileId,
  ): Promise<TravellerProfileEntity | null> {
    const record = await this.prisma.travellerProfile.findUnique({
      where: {
        publicId: id.value,
      },
    });

    if (record === null) {
      return null;
    }

    return TravellerProfilePrismaMapper.toDomain(record);
  }

  async findProfileByPublicId(
    publicId: TravellerProfilePublicId,
  ): Promise<TravellerProfileEntity | null> {
    const record = await this.prisma.travellerProfile.findUnique({
      where: {
        publicId: publicId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return TravellerProfilePrismaMapper.toDomain(record);
  }

  async findProfileByMemberPublicId(
    memberPublicId: MemberPublicId,
  ): Promise<TravellerProfileEntity | null> {
    const record = await this.prisma.travellerProfile.findUnique({
      where: {
        memberPublicId: memberPublicId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return TravellerProfilePrismaMapper.toDomain(record);
  }

  async findProfileByHandle(
    handle: TravellerHandle,
  ): Promise<TravellerProfileEntity | null> {
    const record = await this.prisma.travellerProfile.findUnique({
      where: {
        handle: handle.value,
      },
    });

    if (record === null) {
      return null;
    }

    return TravellerProfilePrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Preferences
  // ===========================================================================

  async findPreferences(
    profileId: TravellerProfileId,
  ): Promise<TravellerProfilePreferencesEntity | null> {
    const profile = await this.prisma.travellerProfile.findUnique({
      where: {
        publicId: profileId.value,
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

    if (record === null) {
      return null;
    }

    return TravellerProfilePreferencesPrismaMapper.toDomain(record);
  }

  // ===========================================================================
  // Corridors
  // ===========================================================================

  async findCorridorById(
    corridorId: TravellerProfileCorridorId,
  ): Promise<TravellerProfileCorridorEntity | null> {
    const record = await this.prisma.travellerProfileCorridor.findUnique({
      where: {
        publicId: corridorId.value,
      },
    });

    if (record === null) {
      return null;
    }

    return TravellerProfileCorridorPrismaMapper.toDomain(record);
  }

  async findCorridors(
    profileId: TravellerProfileId,
  ): Promise<TravellerProfileCorridorEntity[]> {
    const profile = await this.prisma.travellerProfile.findUnique({
      where: {
        publicId: profileId.value,
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

  async findPrimaryCorridor(
    profileId: TravellerProfileId,
  ): Promise<TravellerProfileCorridorEntity | null> {
    const profile = await this.prisma.travellerProfile.findUnique({
      where: {
        publicId: profileId.value,
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

    if (record === null) {
      return null;
    }

    return TravellerProfileCorridorPrismaMapper.toDomain(record);
  }

  async existsCorridorByKey(
    profileId: TravellerProfileId,
    corridorKey: CorridorKey,
  ): Promise<boolean> {
    if (!corridorKey.hasValue) {
      return false;
    }

    const profile = await this.prisma.travellerProfile.findUnique({
      where: {
        publicId: profileId.value,
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
  // Internal Mapping
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

    if (record === null) {
      return null;
    }

    return this.toAggregate(record);
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
