
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
// - Submit only fields that have changed.
// - Translate presentation field names into API input names.
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
//                                 └── update(profile.publicId, changedFields)
//
// Architectural decisions:
// - The profile composition boundary owns the authoritative profile read.
// - This component does not fetch the profile independently.
// - Unchanged fields are omitted from mutation input.
// - An unchanged form submits no API request.
//
// Field mapping:
//
//     TravellerProfile.handle      → ProfileDetailsForm.handle
//     TravellerProfile.bio         → ProfileDetailsForm.bio
//     TravellerProfile.countryCode → ProfileDetailsForm.country
//     ProfileDetailsForm.country   → UpdateTravellerProfileInput.countryCode
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
   */
  readonly profile: TravellerProfile;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Authenticated "About You" profile section.
 *
 * Compares the submitted draft against the authoritative profile props and
 * sends only changed fields to the feature mutation.
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
  // Save changed profile fields
  // ---------------------------------------------------------------------------

  const handleSave = useCallback(
    async (values: ProfileDetailsFormValues): Promise<void> => {
      const nextHandle = values.handle.trim();
      const nextBio = values.bio.trim();
      const nextCountryCode = values.country.trim();

      const input: {
        handle?: string;
        bio?: string;
        countryCode?: string;
      } = {};

      if (nextHandle !== profile.handle) {
        input.handle = nextHandle;
      }

      if (nextBio !== (profile.bio ?? '')) {
        input.bio = nextBio;
      }

      if (nextCountryCode !== profile.countryCode) {
        input.countryCode = nextCountryCode;
      }

      // Avoid unnecessary requests when the form has no changes.
      if (Object.keys(input).length === 0) {
        return;
      }

      await update(profile.publicId, input);
    },
    [
      profile.publicId,
      profile.handle,
      profile.bio,
      profile.countryCode,
      update,
    ],
  );

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <section className="space-y-5">
      {/* Section header */}
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

      {/* Profile details form */}
      <ProfileDetailsForm
        initialValues={{
          handle: profile.handle,
          bio: profile.bio ?? '',
          country: profile.countryCode,
        }}
        onSave={handleSave}
      />

      {/* Saving feedback */}
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

      {/* Mutation error feedback */}
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
