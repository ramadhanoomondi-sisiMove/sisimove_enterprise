// -----------------------------------------------------------------------------
// sisiMove — Traveller Profile Content
// -----------------------------------------------------------------------------
//
// Presentation composition for a public Traveller Profile.
//
// Responsibilities:
// - Compose Traveller Profile presentation sections.
// - Present profile identity.
// - Present primary corridor.
// - Present public travel preferences.
//
// Non-responsibilities:
// - No API calls.
// - No loading state.
// - No error handling.
// - No authentication logic.
// - No authorization logic.
// - No Trust logic.
// - No booking logic.
// - No financial or commercial information.
//
// Trust is intentionally composed separately from this component.
//
// -----------------------------------------------------------------------------

import type {
  TravellerProfile,
} from '@/features/traveller-profile';

import {
  TravellerProfileCorridor,
  TravellerProfileHeader,
  TravellerProfilePreferences,
} from '.';

// -----------------------------------------------------------------------------
// Props
// -----------------------------------------------------------------------------

export interface TravellerProfileContentProps {
  profile: TravellerProfile;
}

// -----------------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------------

export function TravellerProfileContent({
  profile,
}: TravellerProfileContentProps) {
  return (
    <div className="space-y-6">
      {/* ------------------------------------------------------------------- */}
      {/* Profile Header                                                      */}
      {/* ------------------------------------------------------------------- */}

      <TravellerProfileHeader
        profile={profile}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Primary Corridor                                                    */}
      {/* ------------------------------------------------------------------- */}

      <TravellerProfileCorridor
        corridor={profile.primaryCorridor}
      />

      {/* ------------------------------------------------------------------- */}
      {/* Travel Preferences                                                  */}
      {/* ------------------------------------------------------------------- */}

      <TravellerProfilePreferences
        preferences={profile.preferences}
      />
    </div>
  );
}