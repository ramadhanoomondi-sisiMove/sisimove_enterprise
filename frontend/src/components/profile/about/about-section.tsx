'use client';

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
//
// Visual language:
// - Compact mobile-first profile section.
// - sisiMove blue accent for section identity.
// - Mutation feedback remains close to the form.
// - Saving state is informational and non-alarming.
// - Errors use the profile's semantic danger treatment.
// -----------------------------------------------------------------------------

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
    <section className="space-y-5">
      {/* ---------------------------------------------------------------------
          Section header
          --------------------------------------------------------------------- */}
      <div>
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="h-2 w-2 shrink-0 rounded-full bg-[var(--brand)]"
          />

          <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--foreground-secondary)]">
            About You
          </h2>
        </div>

        <p className="mt-1.5 max-w-2xl text-sm leading-5 text-[var(--foreground-muted)]">
          Keep your traveller profile information up to date.
        </p>
      </div>

      {/* ---------------------------------------------------------------------
          Profile details form
          --------------------------------------------------------------------- */}
      <ProfileDetailsForm
        initialValues={{
          handle: profile.handle,
          bio: profile.bio ?? '',
          country: profile.countryCode,
        }}
        onSave={handleSave}
      />

      {/* ---------------------------------------------------------------------
          Mutation feedback
          --------------------------------------------------------------------- */}

      {isUpdating ? (
        <div
          className="flex items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--background-subtle)] px-3.5 py-3"
          role="status"
          aria-live="polite"
        >
          <span
            aria-hidden="true"
            className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-[var(--brand)]"
          />

          <p className="text-sm text-[var(--foreground-secondary)]">
            Saving your profile…
          </p>
        </div>
      ) : null}

      {updateError !== null ? (
        <div
          className="rounded-[var(--radius-lg)] border border-[var(--danger-border)] bg-[var(--danger-soft)] px-3.5 py-3"
          role="alert"
        >
          <p className="text-sm font-medium text-[var(--danger)]">
            We couldn’t save your profile.
          </p>

          <p className="mt-1 text-sm leading-5 text-[var(--danger)]">
            {updateError.message}
          </p>
        </div>
      ) : null}
    </section>
  );
}