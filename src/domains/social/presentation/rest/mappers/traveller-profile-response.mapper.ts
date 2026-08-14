// src/domains/social/presentation/rest/mappers/traveller-profile-response.mapper.ts

import type { TravellerProfileAggregate } from '../../../domain/aggregates/traveller-profile.aggregate';
import type { TravellerProfileEntity } from '../../../domain/entities/traveller-profile.entity';
import type { TravellerProfilePreferencesEntity } from '../../../domain/entities/traveller-profile-preferences.entity';
import type { TravellerProfileCorridorEntity } from '../../../domain/entities/traveller-profile-corridor.entity';

// -----------------------------------------------------------------------------
// Response Types
// -----------------------------------------------------------------------------

export interface TravellerProfileResponse {
  id: string;
  publicId: string;

  memberPublicId: string;

  handle: string;
  bio: string | null;

  avatarAssetPublicId: string | null;

  countryCode: string;

  status: string;
  visibility: string;

  totalJourneys: number;
  completedJourneys: number;

  providerJourneys: number;
  passengerJourneys: number;

  completedProviderJourneys: number;
  completedPassengerJourneys: number;

  preferences: TravellerProfilePreferencesResponse | null;

  corridors: TravellerProfileCorridorResponse[];

  createdAt: Date;
  updatedAt: Date;
}

export interface TravellerProfilePreferencesResponse {
  id: string;
  publicId: string;

  profileId: string;

  showJourneyHistory: boolean;
  showJourneyStatistics: boolean;
  allowJourneyInvites: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export interface TravellerProfileCorridorResponse {
  id: string;
  publicId: string;

  profileId: string;

  originName: string;
  destinationName: string;

  originLatitude: number;
  originLongitude: number;

  destinationLatitude: number;
  destinationLongitude: number;

  corridorKey: string | null;

  isPrimary: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class TravellerProfileResponseMapper {
  // ===========================================================================
  // Aggregate
  // ===========================================================================

  static fromAggregate(
    aggregate: TravellerProfileAggregate,
  ): TravellerProfileResponse {
    return {
      ...this.fromEntity(aggregate.profile),

      preferences:
        aggregate.preferences !== undefined
          ? this.fromPreferencesEntity(aggregate.preferences)
          : null,

      corridors: aggregate.corridors.map((corridor) =>
        this.fromCorridorEntity(corridor),
      ),
    };
  }

  // ===========================================================================
  // Profile
  // ===========================================================================

  static fromEntity(
    entity: TravellerProfileEntity,
  ): Omit<TravellerProfileResponse, 'preferences' | 'corridors'> {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      memberPublicId: entity.memberPublicId.value,

      handle: entity.handle.value,

      bio: entity.bio.value,

      avatarAssetPublicId: entity.avatarAssetPublicId?.value ?? null,

      countryCode: entity.countryCode.value,

      status: entity.status.value,

      visibility: entity.visibility.value,

      totalJourneys: entity.totalJourneys,

      completedJourneys: entity.completedJourneys,

      providerJourneys: entity.providerJourneys,

      passengerJourneys: entity.passengerJourneys,

      completedProviderJourneys: entity.completedProviderJourneys,

      completedPassengerJourneys: entity.completedPassengerJourneys,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Preferences
  // ===========================================================================

  static fromPreferencesEntity(
    entity: TravellerProfilePreferencesEntity,
  ): TravellerProfilePreferencesResponse {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      profileId: entity.profileId.value,

      showJourneyHistory: entity.showJourneyHistory,

      showJourneyStatistics: entity.showJourneyStatistics,

      allowJourneyInvites: entity.allowJourneyInvites,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Corridor
  // ===========================================================================

  static fromCorridorEntity(
    entity: TravellerProfileCorridorEntity,
  ): TravellerProfileCorridorResponse {
    return {
      id: entity.id.toString(),

      publicId: entity.publicId.value,

      profileId: entity.profileId.value,

      originName: entity.originName,

      destinationName: entity.destinationName,

      originLatitude: entity.originLatitude,

      originLongitude: entity.originLongitude,

      destinationLatitude: entity.destinationLatitude,

      destinationLongitude: entity.destinationLongitude,

      corridorKey: entity.corridorKey.value,

      isPrimary: entity.isPrimary,

      createdAt: entity.createdAt,

      updatedAt: entity.updatedAt,
    };
  }

  // ===========================================================================
  // Individual Responses
  // ===========================================================================

  static fromPreferences(
    entity: TravellerProfilePreferencesEntity,
  ): TravellerProfilePreferencesResponse {
    return this.fromPreferencesEntity(entity);
  }

  static fromCorridor(
    entity: TravellerProfileCorridorEntity,
  ): TravellerProfileCorridorResponse {
    return this.fromCorridorEntity(entity);
  }

  static fromCorridors(
    entities: TravellerProfileCorridorEntity[],
  ): TravellerProfileCorridorResponse[] {
    return entities.map((entity) => this.fromCorridorEntity(entity));
  }
}
