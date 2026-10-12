// -----------------------------------------------------------------------------
// sisiMove — Journey Boarding Participant Summary
// -----------------------------------------------------------------------------
//
// Shared frontend read model for a journey boarding participant's public
// profile, verification, trust information, and authorized contact details.
//
// This model is separate from the JourneyBoarding lifecycle model.
// -----------------------------------------------------------------------------

export interface JourneyBoardingParticipantSummary {
  participant: {
    publicId: string;
    handle: string;
    bio: string | null;
    countryCode: string;
    avatarUrl: string | null;
    accountStatus: string;
  };

  contact: {
    email: string;
    phoneNumber: string;
  } | null;

  verification: {
    status: string;
    level: string;
    active: boolean;
    verified: boolean;
    expiresAt: string | null;
  };

  trust: {
    verificationLevel: string;
    ratingAverage: number;
    ratingCount: number;
    completedJourneys: number;
    badges: JourneyBoardingParticipantBadge[];
  };

  verificationDisclaimer: string;
}

export interface JourneyBoardingParticipantBadge {
  publicId: string;
  type: string;
  name: string;
  description: string | null;
  asset: {
    publicId: string;
    url: string;
    alt: string;
  } | null;
}