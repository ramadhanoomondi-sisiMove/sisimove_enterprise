
'use client';

// -----------------------------------------------------------------------------
// sisiMove — Authenticated Route Layout
// -----------------------------------------------------------------------------
//
// Application route boundary for authenticated SisiMove surfaces.
//
// Responsibilities:
// - resolve the current Traveller Profile;
// - resolve the Traveller Profile's public avatar Asset reference;
// - resolve the current Identity Verification aggregate;
// - resolve the authenticated member's Financial Account;
// - resolve the Financial Account's available balance;
// - supply presentation-ready data to AuthenticatedShell.
//
// Non-responsibilities:
// - authentication state management;
// - session management;
// - route authorization;
// - verification business logic;
// - financial calculations;
// - balance mutation;
// - rendering application pages.
//
// -----------------------------------------------------------------------------

import type { ReactNode } from 'react';

import { AuthenticatedShell } from '@/components/authenticated';

import { useCurrentTravellerProfile } from '@/features/traveller-profile';

import { useVerification } from '@/features/verification/hooks';

import { usePublicAsset } from '@/features/assets';

import {
  useMyFinancialAccount,
  useMyFinancialBalance,
} from '@/features/financial-account';

// =============================================================================
// Props
// =============================================================================

export interface AuthenticatedLayoutProps {
  /**
   * Authenticated route content.
   */
  readonly children: ReactNode;
}

// =============================================================================
// Component
// =============================================================================

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  // ---------------------------------------------------------------------------
  // Current Traveller Profile
  // ---------------------------------------------------------------------------

  const {
    data: travellerProfile,
    isLoading: profileLoading,
    isError: profileIsError,
  } = useCurrentTravellerProfile();

  // ---------------------------------------------------------------------------
  // Current Verification
  // ---------------------------------------------------------------------------

  const {
    verification,
    isLoading: verificationLoading,
    error: verificationError,
  } = useVerification();

  // ---------------------------------------------------------------------------
  // Avatar Asset Reference
  // ---------------------------------------------------------------------------

  const avatarAssetPublicId =
    travellerProfile?.avatarAssetPublicId ?? null;

  const {
    asset: avatarAsset,
  } = usePublicAsset(avatarAssetPublicId);

  // ---------------------------------------------------------------------------
  // Current Financial Account
  // ---------------------------------------------------------------------------

  const {
    data: financialAccount,
    isLoading: accountLoading,
    isError: accountIsError,
  } = useMyFinancialAccount();

  // ---------------------------------------------------------------------------
  // Current Financial Account Balance
  // ---------------------------------------------------------------------------

  const {
    data: financialBalance,
    isLoading: balanceLoading,
    isError: balanceIsError,
  } = useMyFinancialBalance(
    financialAccount?.publicId,
  );

  // ---------------------------------------------------------------------------
  // Current Traveller Profile Loading
  // ---------------------------------------------------------------------------

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <div
          className="flex min-h-screen items-center justify-center px-4"
          aria-busy="true"
          aria-live="polite"
        >
          <p className="text-sm text-[var(--foreground-muted)]">
            Loading your profile…
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Current Verification Loading
  // ---------------------------------------------------------------------------

  if (verificationLoading) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <div
          className="flex min-h-screen items-center justify-center px-4"
          aria-busy="true"
          aria-live="polite"
        >
          <p className="text-sm text-[var(--foreground-muted)]">
            Loading your verification status…
          </p>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Current Traveller Profile Failure
  // ---------------------------------------------------------------------------

  if (profileIsError || travellerProfile == null) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-md text-center" role="alert">
            <h1 className="text-lg font-semibold text-[var(--foreground)]">
              We could not load your profile
            </h1>

            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              Your Traveller Profile is required to continue.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Current Verification Failure
  // ---------------------------------------------------------------------------

  if (verificationError || verification == null) {
    return (
      <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="max-w-md text-center" role="alert">
            <h1 className="text-lg font-semibold text-[var(--foreground)]">
              We could not load your verification status
            </h1>

            <p className="mt-2 text-sm text-[var(--foreground-muted)]">
              Your verification status is required to determine the
              appropriate SisiMove access level.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Financial Account and Balance State
  // ---------------------------------------------------------------------------

  // Do not interpret a missing or failed balance as zero.
  //
  // The header receives null until the actual available balance is resolved.
  // Its presentation component must support null as a loading/unavailable
  // state rather than displaying a misleading zero balance.

  const availableAmount =
    !accountLoading &&
    !accountIsError &&
    !balanceLoading &&
    !balanceIsError &&
    financialBalance != null
      ? financialBalance.availableAmount
      : null;

  // ---------------------------------------------------------------------------
  // Authenticated Application Shell
  // ---------------------------------------------------------------------------

  return (
    <AuthenticatedShell
      travellerHandle={travellerProfile.handle}
      travellerAvatarUrl={avatarAsset?.url ?? null}
      verificationLevel={verification.level}
      availableAmount={availableAmount}
    >
      {children}
    </AuthenticatedShell>
  );
}
