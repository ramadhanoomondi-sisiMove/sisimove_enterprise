// src/domains/social/presentation/rest/mappers/public-traveller-profile-response.mapper.ts

import type { TravellerProfileEntity } from '../../../domain/entities/traveller-profile.entity';

// -----------------------------------------------------------------------------
// Public Response Types
// -----------------------------------------------------------------------------

/**
 * Public avatar information required by frontend consumers.
 *
 * The binary asset URL is resolved by the application layer before this mapper
 * is called. This mapper only shapes the already-resolved public data.
 */
export interface PublicTravellerAvatarResponse {
  publicId: string;
  url: string;
  alt: string | null;
}

/**
 * Deliberately reduced public Traveller Profile response.
 *
 * This contract is intended for unauthenticated marketplace discovery.
 *
 * It must not expose:
 * - internal database identifiers;
 * - member or identity references;
 * - profile status or visibility internals;
 * - journey statistics;
 * - private preferences;
 * - private corridors;
 * - raw avatar asset references;
 * - lifecycle timestamps.
 */
export interface PublicTravellerProfileResponse {
  publicId: string;
  handle: string;
  bio: string | null;
  avatar: PublicTravellerAvatarResponse | null;
  countryCode: string;
}

// -----------------------------------------------------------------------------
// Resolved Public Avatar
// -----------------------------------------------------------------------------

export interface ResolvedPublicTravellerAvatar {
  publicId: string;
  url: string;
  alt: string | null;
}

// -----------------------------------------------------------------------------
// Mapper
// -----------------------------------------------------------------------------

export class PublicTravellerProfileResponseMapper {
  /**
   * Maps a Traveller Profile entity into the reduced public profile shape.
   *
   * Avatar resolution is intentionally handled outside this mapper because
   * the Traveller Profile domain owns only the avatar asset reference, while
   * the Assets domain owns public asset metadata and URL resolution.
   */
  static fromEntity(
    entity: TravellerProfileEntity,
    avatar: ResolvedPublicTravellerAvatar | null,
  ): PublicTravellerProfileResponse {
    return {
      publicId: entity.publicId.value,

      handle: entity.handle.value,

      bio: entity.bio.value,

      avatar: avatar
        ? {
            publicId: avatar.publicId,
            url: avatar.url,
            alt: avatar.alt,
          }
        : null,

      countryCode: entity.countryCode.value,
    };
  }
}
