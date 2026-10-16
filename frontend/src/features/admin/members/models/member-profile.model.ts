
/**
 * sisiMove — Admin Member Profile Model
 *
 * Frontend representation of the Traveller Profile domain for administration.
 *
 * Based on:
 * src/domains/social/presentation/rest/mappers/
 * traveller-profile-response.mapper.ts
 *
 * The public Traveller Profile response is intentionally reduced and must not
 * be used as the administrative profile contract.
 *
 * Dates are strings because JSON serializes backend Date values as strings.
 */

export interface MemberProfilePreferences {
  id: string;
  publicId: string;
  profileId: string;

  showJourneyHistory: boolean;
  showJourneyStatistics: boolean;
  allowJourneyInvites: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface MemberProfileCorridor {
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

  createdAt: string;
  updatedAt: string;
}

export interface MemberProfile {
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

  preferences: MemberProfilePreferences | null;
  corridors: MemberProfileCorridor[];

  createdAt: string;
  updatedAt: string;
}
