'use client';

// -----------------------------------------------------------------------------
// sisiMove — Profile Page
// -----------------------------------------------------------------------------
//
// Authenticated traveller profile composition.
//
// Responsibilities:
// - Compose the profile sections in the intended presentation order.
// - Receive the authoritative authenticated TravellerProfile.
// - Pass profile-owned data to presentational sections.
// - Pass verification data to VerificationSection.
// - Pass presentation-level actions to the relevant sections.
//
// Non-responsibilities:
// - Fetching Traveller Profile data.
// - Performing API requests.
// - Domain/business calculations.
// - Owning verification, trust, journey, corridor, preference, or account
//   persistence workflows.
//
// Architecture:
//
//     ProfilePageContainer
//             │
//             ├── TravellerProfile
//             ├── Verification
//             ├── VerificationRequirement[]
//             └── account data
//                     │
//                     ▼
//                ProfilePage
//                     │
//          ┌──────────┼──────────┐
//          ▼          ▼          ▼
//       Header      About     Visibility
//          │          │          │
//          └──────────┼──────────┘
//                     │
//             TravellerProfile
//
// Traveller Profile is the single source of truth for:
//
// - handle;
// - biography;
// - country;
// - status;
// - visibility;
// - memberPublicId;
// - journey statistics;
// - frequent corridors;
// - travel preferences.
//
// AboutSection receives the same TravellerProfile instance and owns only its
// mutation workflow.
//
// Trust remains independently resolved by TrustSection because Trust is a
// separate feature/domain boundary.
//
// Verification remains independently resolved by the verification feature.
//
// Account information remains separate because it belongs to the authenticated
// Identity/account boundary rather than Traveller Profile.
//
// -----------------------------------------------------------------------------
//
// Presentation boundary:
//
// ProfilePage owns:
//
// - page background;
// - page introduction;
// - overall content width;
// - section ordering;
// - section spacing.
//
// Individual sections own:
//
// - their internal spacing;
// - their headings;
// - their actions;
// - their content surfaces;
// - their loading/error/empty states where applicable.
//
// This prevents duplicated card shells and keeps each profile section
// independently reusable.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------

import { Container } from '@/components/ui/container';

// -----------------------------------------------------------------------------
// Traveller Profile
// -----------------------------------------------------------------------------

import type {
  TravellerProfile,
} from '@/features/traveller-profile/models';

// -----------------------------------------------------------------------------
// Verification
// -----------------------------------------------------------------------------

import type {
  Verification,
  VerificationRequirement,
} from '@/features/verification/models';

// -----------------------------------------------------------------------------
// Profile Sections
// -----------------------------------------------------------------------------

import { AboutSection } from './about';

import { ProfileHeader } from './header';

import {
  ProfileVisibilitySection,
  type ProfileVisibility,
} from './visibility';

import { VerificationSection } from './verification';

import { TrustSection } from './trust';

import { TravelActivitySection } from './activity';

import { CorridorsSection } from './corridors';

import { TravelPreferencesSection } from './preferences';

import { AccountSection } from './account';

// =============================================================================
// Props
// =============================================================================

export interface ProfilePageProps {
  /**
   * Authoritative authenticated Traveller Profile.
   *
   * This is the single profile read used by the profile composition.
   */
  readonly profile: TravellerProfile;

  /**
   * Authenticated Verification aggregate.
   */
  readonly verification: Verification;

  /**
   * Current verification requirement projection.
   *
   * The backend remains authoritative for verification policy.
   */
  readonly verificationRequirements: readonly VerificationRequirement[];

  /**
   * Resolved public avatar URL, when available.
   *
   * TravellerProfile intentionally stores only the opaque Asset public ID.
   * Asset URL resolution therefore remains outside the Traveller Profile model.
   */
  readonly avatarUrl?: string | null;

  /**
   * Accessible avatar alternative text.
   */
  readonly avatarAlt?: string;

  /**
   * Avatar fallback content.
   */
  readonly avatarFallback?: string;

  /**
   * Optional explanatory text displayed by ProfileHeader.
   */
  readonly visibilityDescription?: string;

  /**
   * Account email.
   *
   * Account/Identity data remains outside TravellerProfile.
   */
  readonly email: string;

  /**
   * Account phone number.
   *
   * Account/Identity data remains outside TravellerProfile.
   */
  readonly phoneNumber: string;

  /**
   * Account lifecycle status.
   *
   * This is intentionally separate from TravellerProfile.status.
   */
  readonly accountStatus: string;

  // ---------------------------------------------------------------------------
  // Presentation Actions
  // ---------------------------------------------------------------------------

  /**
   * Called when the traveller requests an avatar/photo change.
   */
  readonly onChangePhoto?: () => void;

  /**
   * Called when the traveller saves profile visibility.
   */
  readonly onSaveVisibility?: (
    visibility: ProfileVisibility,
  ) => void;

  /**
   * Navigate to the general verification management surface.
   */
  readonly onManageVerification?: () => void;

  /**
   * Navigate to member verification management.
   */
  readonly onManageMemberVerification?: () => void;

  /**
   * Navigate to driver verification management.
   */
  readonly onManageDriverVerification?: () => void;

  /**
   * Navigate to the traveller's reputation surface.
   */
  readonly onViewReputation?: () => void;

  /**
   * Navigate to corridor management.
   */
  readonly onManageCorridors?: () => void;

  /**
   * Navigate to travel preference editing.
   */
  readonly onEditPreferences?: () => void;

  /**
   * Navigate to account settings.
   */
  readonly onAccountSettings?: () => void;
}

// =============================================================================
// Component
// =============================================================================

/**
 * Authenticated traveller profile presentation boundary.
 *
 * ProfilePage intentionally contains no feature data fetching. The parent
 * composition/container resolves the required data and supplies it here.
 */
export function ProfilePage({
  profile,
  verification,
  verificationRequirements,
  avatarUrl,
  avatarAlt,
  avatarFallback,
  visibilityDescription,
  email,
  phoneNumber,
  accountStatus,
  onChangePhoto,
  onSaveVisibility,
  onManageVerification,
  onManageMemberVerification,
  onManageDriverVerification,
  onViewReputation,
  onManageCorridors,
  onEditPreferences,
  onAccountSettings,
}: ProfilePageProps): ReactNode {
  return (
    <main className="min-h-screen bg-[var(--background-brand)]">
      <Container size="lg" padded>
        <div className="py-6 sm:py-8 lg:py-10">

          {/* -----------------------------------------------------------------
              Page Introduction
             ----------------------------------------------------------------- */}

              <header className="mb-6 sm:mb-7">
                <div className="max-w-2xl">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em]">
                    <span className="text-[var(--foreground)]">sisi</span>
                    <span className="text-[var(--brand)]">Move</span>
                  </p>

                  <h1 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[var(--foreground)] sm:text-3xl">
                    Your profile
                  </h1>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-[var(--foreground-secondary)]">
                    Manage your traveller identity, verification, travel
                    preferences and account information.
                  </p>
                </div>
              </header>

          {/* -----------------------------------------------------------------
              Profile Identity

              ProfileHeader owns its own visual surface. The page only controls
              its placement and spacing.
             ----------------------------------------------------------------- */}

          <ProfileHeader
            handle={profile.handle}
            country={profile.countryCode}
            status={profile.status}
            avatarUrl={avatarUrl}
            avatarAlt={avatarAlt}
            avatarFallback={avatarFallback}
            visibilityDescription={visibilityDescription}
            onChangePhoto={onChangePhoto}
          />

          {/* -----------------------------------------------------------------
              Profile Information

              Each section owns its own presentation surface.
             ----------------------------------------------------------------- */}

          <div className="mt-4 space-y-4 sm:mt-5 sm:space-y-5">

            {/* ---------------------------------------------------------------
                About
               --------------------------------------------------------------- */}

            <AboutSection
              profile={profile}
            />

            {/* ---------------------------------------------------------------
                Visibility
               --------------------------------------------------------------- */}

            <ProfileVisibilitySection
              value={profile.visibility}
              onSave={onSaveVisibility}
            />

            {/* ---------------------------------------------------------------
                Verification
               --------------------------------------------------------------- */}

            <VerificationSection
              verification={verification}
              requirements={verificationRequirements}
              onManage={onManageVerification}
              onManageMember={onManageMemberVerification}
              onManageDriver={onManageDriverVerification}
            />

            {/* ---------------------------------------------------------------
                Trust & Reputation
               --------------------------------------------------------------- */}

            <TrustSection
              memberPublicId={profile.memberPublicId}
              onViewReputation={onViewReputation}
            />

            {/* ---------------------------------------------------------------
                Travel Activity
               --------------------------------------------------------------- */}

            <TravelActivitySection
              totalJourneys={profile.totalJourneys}
              completedJourneys={profile.completedJourneys}
              providerJourneys={profile.providerJourneys}
              passengerJourneys={profile.passengerJourneys}
              completedProviderJourneys={
                profile.completedProviderJourneys
              }
              completedPassengerJourneys={
                profile.completedPassengerJourneys
              }
            />

            {/* ---------------------------------------------------------------
                Frequent Corridors
               --------------------------------------------------------------- */}

            <CorridorsSection
              corridors={profile.corridors}
              onManage={onManageCorridors}
            />

            {/* ---------------------------------------------------------------
                Travel Preferences
               --------------------------------------------------------------- */}

            <TravelPreferencesSection
              preferences={profile.preferences}
              onEdit={onEditPreferences}
            />

            {/* ---------------------------------------------------------------
                Account
               --------------------------------------------------------------- */}

            <AccountSection
              email={email}
              phoneNumber={phoneNumber}
              status={accountStatus}
              onSettings={onAccountSettings}
            />
          </div>

          {/* -----------------------------------------------------------------
              Bottom Spacing
             ----------------------------------------------------------------- */}

          <div className="h-4 sm:h-6" />
        </div>
      </Container>
    </main>
  );
}