// -----------------------------------------------------------------------------
// sisiMove — About Section
// -----------------------------------------------------------------------------
//
// Authenticated profile section for basic Traveller Profile information.
//
// Responsibilities:
// - Receive the already-resolved authenticated Traveller Profile.
// - Present the current handle, biography, and country.
// - Own the profile-details update workflow.
// - Expose mutation feedback at the section boundary.
// - Delegate field rendering to ProfileDetailsForm.
//
// Non-responsibilities:
// - Fetching the current Traveller Profile.
// - Direct HTTP requests.
// - Authentication/token handling.
// - Profile/domain validation.
// - Profile visibility.
// - Travel preferences.
// - Verification.
// - Travel corridors.
// - Navigation.
//
// Data ownership:
//
//     ProfilePageContainer
//         │
//         └── useCurrentTravellerProfile()
//                 └── TravellerProfile
//                         │
//                         ▼
//                    AboutSection
//                         │
//                         └── useUpdateTravellerProfile()
//                                 └── update(profile.publicId, input)
//
// Architectural reason:
//
// The authenticated profile page has one authoritative TravellerProfile read.
// AboutSection must not independently call useCurrentTravellerProfile(), because
// ProfilePageContainer already owns that read for the profile composition.
//
// This prevents:
// - duplicate profile requests;
// - multiple profile read states;
// - competing sources of truth;
// - unnecessary network traffic;
// - stale values between ProfileHeader and AboutSection.
//
// The section still owns its mutation workflow because updating profile details
// is an interaction specific to this section.
//
// -----------------------------------------------------------------------------
//
// Field mapping:
//
//     TravellerProfile.handle
//         → ProfileDetailsForm.handle
//
//     TravellerProfile.bio
//         → ProfileDetailsForm.bio
//
//     TravellerProfile.countryCode
//         → ProfileDetailsForm.country
//
//     ProfileDetailsForm.country
//         → UpdateTravellerProfileInput.countryCode
//
// The form intentionally uses `country` as a human-facing field name while
// the API write contract uses the domain-specific `countryCode` name.
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import {
  useCallback,
  type ReactNode,
} from 'react';

// -----------------------------------------------------------------------------
// Traveller Profile feature
// -----------------------------------------------------------------------------

import {
  useUpdateTravellerProfile,
} from '@/features/traveller-profile';

import type {
  TravellerProfile,
} from '@/features/traveller-profile/models';

// -----------------------------------------------------------------------------
// Presentation
// -----------------------------------------------------------------------------

import {
  ProfileDetailsForm,
  type ProfileDetailsFormValues,
} from './profile-details-form';

// =============================================================================
// Props
// =============================================================================

export interface AboutSectionProps {
  /**
   * Authenticated Traveller Profile resolved by the profile composition
   * boundary.
   *
   * The section does not fetch this model itself.
   */
  readonly profile: TravellerProfile;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Authenticated "About You" profile section.
 *
 * The section receives the current Traveller Profile from its parent and owns
 * only the mutation workflow for editable profile details.
 */
export function AboutSection({
  profile,
}: AboutSectionProps): ReactNode {
  const {
    update,
    isUpdating,
    error: updateError,
  } = useUpdateTravellerProfile();

  // ---------------------------------------------------------------------------
  // Save
  // ---------------------------------------------------------------------------
  //
  // The form emits presentation-oriented values.
  //
  // The feature mutation expects the domain/API field `countryCode`.
  //
  // That translation belongs here at the feature/presentation boundary.
  //

  const handleSave = useCallback(
    async (values: ProfileDetailsFormValues): Promise<void> => {
      await update(profile.publicId, {
        handle: values.handle,
        bio: values.bio,
        countryCode: values.country,
      });
    },
    [profile.publicId, update],
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide">
          About You
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Keep your traveller profile information up to date.
        </p>
      </div>

      <ProfileDetailsForm
        initialValues={{
          handle: profile.handle,
          bio: profile.bio ?? '',
          country: profile.countryCode,
        }}
        onSave={handleSave}
      />

      {isUpdating ? (
        <p
          className="text-sm text-muted-foreground"
          aria-live="polite"
        >
          Saving your profile…
        </p>
      ) : null}

      {updateError !== null ? (
        <p
          className="text-sm text-muted-foreground"
          role="alert"
        >
          {updateError.message}
        </p>
      ) : null}
    </section>
  );
}