// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Participant Summary Mapper
// -----------------------------------------------------------------------------
//
// Responsibilities:
// - Map the participant-summary API response into the frontend model.
// - Explicitly map nested participant, contact, verification, and trust data.
// - Preserve nullable values and opaque public identifiers.
// - Keep transport contracts separate from presentation models.
//
// Architectural rules:
// - No HTTP requests.
// - No domain/business rules.
// - No authorization or permission decisions.
// - No asset URL construction or resolution.
// - No mutation of the API response.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// API Transport Contracts
// -----------------------------------------------------------------------------

import type {
  GetJourneyBoardingParticipantSummaryResponse,
  GetJourneyBoardingParticipantBadgeResponse,
} from "@/features/journey-boarding/api/discovery";

// -----------------------------------------------------------------------------
// Frontend Models
// -----------------------------------------------------------------------------

import type {
  JourneyBoardingParticipantSummary,
  JourneyBoardingParticipantBadge,
} from "@/features/journey-boarding/models";

// -----------------------------------------------------------------------------
// Badge Mapper
// -----------------------------------------------------------------------------

function mapParticipantBadge(
  badge: GetJourneyBoardingParticipantBadgeResponse,
): JourneyBoardingParticipantBadge {
  return {
    publicId: badge.publicId,
    type: badge.type,
    name: badge.name,
    description: badge.description,
    asset: badge.asset
      ? {
          publicId: badge.asset.publicId,
          url: badge.asset.url,
          alt: badge.asset.alt,
        }
      : null,
  };
}

// -----------------------------------------------------------------------------
// Model Mapper
// -----------------------------------------------------------------------------

function toModel(
  response: GetJourneyBoardingParticipantSummaryResponse,
): JourneyBoardingParticipantSummary {
  return {
    participant: {
      publicId: response.participant.publicId,
      handle: response.participant.handle,
      bio: response.participant.bio,
      countryCode: response.participant.countryCode,
      avatarUrl: response.participant.avatarUrl,
      accountStatus: response.participant.accountStatus,
    },

    contact: response.contact
      ? {
          email: response.contact.email,
          phoneNumber: response.contact.phoneNumber,
        }
      : null,

    verification: {
      status: response.verification.status,
      level: response.verification.level,
      active: response.verification.active,
      verified: response.verification.verified,
      expiresAt: response.verification.expiresAt,
    },

    trust: {
      verificationLevel: response.trust.verificationLevel,
      ratingAverage: response.trust.ratingAverage,
      ratingCount: response.trust.ratingCount,
      completedJourneys: response.trust.completedJourneys,
      badges: response.trust.badges.map(mapParticipantBadge),
    },

    verificationDisclaimer: response.verificationDisclaimer,
  };
}

// -----------------------------------------------------------------------------
// Public Mapper
// -----------------------------------------------------------------------------

export const journeyBoardingParticipantSummaryMapper = {
  toModel,
};