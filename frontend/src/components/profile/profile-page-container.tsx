
'use client';

// -----------------------------------------------------------------------------
// sisiMove — Profile Page Container
// -----------------------------------------------------------------------------
// Authenticated traveller profile data composition boundary.
//
// Responsibilities:
// - Resolve authenticated TravellerProfile, Verification and Identity data.
// - Resolve verification requests and project their presentation state.
// - Resolve the public avatar Asset.
// - Compose presentation-level navigation callbacks.
// - Orchestrate profile-photo upload and avatar association.
// - Pass the composed data into ProfilePage.
//
// ProfilePage remains presentation-only.
// -----------------------------------------------------------------------------

import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { useRouter } from 'next/navigation';

import { Container } from '@/components/ui/container';
import { AssetUploadDialog } from '@/components/assets/asset-upload-dialog';

import { ProfilePage } from './profile-page';

import {
  useCurrentTravellerProfile,
  useTravellerProfileAvatar,
} from '@/features/traveller-profile/hooks';

import {
  useVerification,
  useVerificationRequests,
} from '@/features/verification/hooks';

import type {
  Verification,
  VerificationRequirement,
  VerificationRequirementStatus,
  VerificationRequest,
  VerificationRequestType,
} from '@/features/verification/models';

import {
  usePublicAsset,
  type Asset,
} from '@/features/assets';

import { useCurrentIdentity } from '@/features/identity/hooks';
import { AUTHENTICATED_ROUTES } from '@/foundation/routing';

// =============================================================================
// Helpers
// =============================================================================

function resolvePhoneNumber(
  phoneNumber: string | null | undefined,
): string {
  if (
    phoneNumber === null ||
    phoneNumber === undefined ||
    phoneNumber.trim().length === 0
  ) {
    return 'Not provided';
  }

  return phoneNumber;
}

function resolveRequirementStatus(
  verification: Verification,
  type: VerificationRequestType,
  request: VerificationRequest | undefined,
): VerificationRequirementStatus {
  switch (type) {
    case 'PROFILE_PHOTO':
      if (verification.profilePhotoVerified) {
        return 'APPROVED';
      }
      break;

    case 'GOVERNMENT_ID':
      if (verification.governmentIdVerified) {
        return 'APPROVED';
      }
      break;

    case 'DRIVER_LICENSE':
      if (verification.driverLicenseVerified) {
        return 'APPROVED';
      }
      break;

    default:
      break;
  }

  if (request !== undefined) {
    switch (request.status) {
      case 'PENDING':
        return 'PENDING';

      case 'APPROVED':
        return 'APPROVED';

      case 'REJECTED':
        return 'REJECTED';

      case 'CANCELLED':
        return 'CANCELLED';

      default:
        break;
    }
  }

  return 'NOT_STARTED';
}

function getLatestRequestsByType(
  requests: readonly VerificationRequest[],
): ReadonlyMap<VerificationRequestType, VerificationRequest> {
  const latest = new Map<
    VerificationRequestType,
    VerificationRequest
  >();

  for (const request of requests) {
    const current = latest.get(request.type);

    if (
      current === undefined ||
      new Date(request.createdAt).getTime() >
        new Date(current.createdAt).getTime()
    ) {
      latest.set(request.type, request);
    }
  }

  return latest;
}

function buildVerificationRequirements(
  verification: Verification,
  requests: readonly VerificationRequest[],
): readonly VerificationRequirement[] {
  const latestRequests = getLatestRequestsByType(requests);

  const types: readonly VerificationRequestType[] = [
    'PROFILE_PHOTO',
    'GOVERNMENT_ID',
    'DRIVER_LICENSE',
  ];

  return types.map((type) => {
    const request = latestRequests.get(type);

    return {
      type,
      required: false,
      status: resolveRequirementStatus(
        verification,
        type,
        request,
      ),
      requestPublicId: request?.publicId ?? null,
      assetPublicId: request?.assetPublicId ?? null,
      submittedAt: request?.submittedAt ?? null,
      reviewedAt: request?.reviewedAt ?? null,
      rejectionReason: request?.rejectionReason ?? null,
    };
  });
}

// =============================================================================
// Loading State
// =============================================================================

function ProfileLoadingState(): ReactNode {
  return (
    <main className="min-h-screen bg-[var(--background-brand)]">
      <Container size="lg" padded>
        <div className="py-6 sm:py-8 lg:py-10">
          <div className="mb-7 space-y-2">
            <div className="h-7 w-28 animate-pulse rounded-lg bg-[var(--border-subtle)] sm:h-8" />
            <div className="h-4 w-64 animate-pulse rounded-md bg-[var(--border-subtle)]" />
          </div>

          <div className="space-y-4">
            <div className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
              <div className="h-32 animate-pulse bg-[var(--background-subtle)] sm:h-40" />

              <div className="space-y-4 p-5 sm:p-6">
                <div className="h-7 w-40 animate-pulse rounded-lg bg-[var(--border-subtle)]" />
                <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-[var(--border-subtle)]" />
                <div className="h-10 w-32 animate-pulse rounded-lg bg-[var(--border-subtle)]" />
              </div>
            </div>

            <div className="h-44 animate-pulse rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]" />

            <div className="h-44 animate-pulse rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]" />
          </div>
        </div>
      </Container>
    </main>
  );
}

// =============================================================================
// Error State
// =============================================================================

interface ProfileStateProps {
  readonly message: string;
  readonly onRetry: () => void;
}

function ProfileState({
  message,
  onRetry,
}: ProfileStateProps): ReactNode {
  return (
    <main className="min-h-screen bg-[var(--background-brand)]">
      <Container size="lg" padded>
        <div className="py-6 sm:py-8 lg:py-10">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              sisiMove
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[var(--foreground)] sm:text-3xl">
              Profile
            </h1>
          </div>

          <section className="overflow-hidden rounded-[var(--radius-2xl)] border border-[var(--border)] bg-[var(--surface)] shadow-[var(--shadow-sm)]">
            <div className="border-b border-[var(--border-subtle)] bg-[var(--background-subtle)] px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--danger-soft)] text-sm font-semibold text-[var(--danger)]"
                  aria-hidden="true"
                >
                  !
                </span>

                <div>
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    We couldn&apos;t load your profile
                  </p>

                  <p className="mt-0.5 text-xs text-[var(--foreground-muted)]">
                    Something prevented the profile data from loading.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <p className="max-w-2xl text-sm leading-6 text-[var(--foreground-secondary)]">
                {message}
              </p>

              <button
                type="button"
                onClick={onRetry}
                className="mt-5 inline-flex min-h-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--brand)] px-4 text-sm font-semibold text-[var(--brand-foreground)] shadow-[var(--shadow-sm)] transition hover:bg-[var(--brand-hover)] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand)] focus-visible:ring-offset-2"
              >
                Try again
              </button>
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}

// =============================================================================
// Profile Page Container
// =============================================================================

export function ProfilePageContainer(): ReactNode {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // Traveller Profile
  // ---------------------------------------------------------------------------

  const {
    data: profile,
    isLoading: profileLoading,
    isError: profileIsError,
    error: profileError,
    refetch: refetchProfile,
  } = useCurrentTravellerProfile();

  // ---------------------------------------------------------------------------
  // Verification
  // ---------------------------------------------------------------------------

  const {
    verification,
    isLoading: verificationLoading,
    error: verificationError,
    reload: reloadVerification,
  } = useVerification();

  const {
    requests,
    isLoading: requestsLoading,
    error: requestsError,
    reload: reloadVerificationRequests,
  } = useVerificationRequests(verification?.publicId ?? null);

  // ---------------------------------------------------------------------------
  // Identity / Account
  // ---------------------------------------------------------------------------

  const {
    data: identity,
    isLoading: identityLoading,
    isError: identityIsError,
    error: identityError,
    refetch: refetchIdentity,
  } = useCurrentIdentity();

  // ---------------------------------------------------------------------------
  // Avatar Asset
  // ---------------------------------------------------------------------------

  const avatarAssetPublicId = profile?.avatarAssetPublicId ?? null;

  const { asset: avatarAsset } = usePublicAsset(
    avatarAssetPublicId,
  );

  // ---------------------------------------------------------------------------
  // Profile Photo Upload
  // ---------------------------------------------------------------------------

  const [isPhotoUploadOpen, setIsPhotoUploadOpen] = useState(false);

  const {
    changeAvatar,
    clearError: clearAvatarChangeError,
  } = useTravellerProfileAvatar();

  // ---------------------------------------------------------------------------
  // Verification Requirement Projection
  // ---------------------------------------------------------------------------

  const verificationRequirements =
    useMemo<readonly VerificationRequirement[]>(() => {
      if (verification === null || verification === undefined) {
        return [];
      }

      return buildVerificationRequirements(
        verification,
        requests ?? [],
      );
    }, [verification, requests]);

  // ---------------------------------------------------------------------------
  // Loading / Error
  // ---------------------------------------------------------------------------

  const isLoading =
    profileLoading ||
    verificationLoading ||
    requestsLoading ||
    identityLoading;

  const error = profileIsError
    ? profileError
    : identityIsError
      ? identityError
      : verificationError ?? requestsError;

  const handleRetry = useCallback((): void => {
    void refetchProfile();
    void refetchIdentity();

    reloadVerification();

    if (verification?.publicId != null) {
      reloadVerificationRequests();
    }
  }, [
    refetchProfile,
    refetchIdentity,
    reloadVerification,
    reloadVerificationRequests,
    verification?.publicId,
  ]);

  // ---------------------------------------------------------------------------
  // Profile Photo
  // ---------------------------------------------------------------------------

  const handleChangePhoto = useCallback((): void => {
    clearAvatarChangeError();
    setIsPhotoUploadOpen(true);
  }, [clearAvatarChangeError]);

  const handleProfilePhotoUploaded = useCallback(
    async (asset: Asset): Promise<void> => {
      if (profile === null || profile === undefined) {
        throw new Error(
          'Your traveller profile could not be loaded. Please try again.',
        );
      }

      await changeAvatar(profile.publicId, {
        avatarAssetPublicId: asset.publicId,
      });

      await refetchProfile();
    },
    [profile, changeAvatar, refetchProfile],
  );

  // ---------------------------------------------------------------------------
  // Presentation Actions
  // ---------------------------------------------------------------------------

  const handleManageVerification = useCallback((): void => {
    router.push('/profile/verification');
  }, [router]);

  const handleManageMemberVerification = useCallback((): void => {
    router.push('/profile/verification');
  }, [router]);

  const handleManageDriverVerification = useCallback((): void => {
    router.push('/profile/verification');
  }, [router]);

  const handleViewReputation = useCallback((): void => {
    // Trust/reputation owns its own feature route and query boundary.
  }, []);

  const handleManageCorridors = useCallback((): void => {
    // No dedicated corridor-management route is established here.
  }, []);

  const handleEditPreferences = useCallback((): void => {
    // No dedicated preferences route is established here.
  }, []);

  // Settings is a dedicated route. Keep routing in the container rather
  // than placing Next.js navigation logic inside AccountSection.

const handleAccountSettings = useCallback((): void => {
  router.push(AUTHENTICATED_ROUTES.SETTINGS);
}, [router]);


  // ---------------------------------------------------------------------------
  // Loading State
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return <ProfileLoadingState />;
  }

  // ---------------------------------------------------------------------------
  // Error State
  // ---------------------------------------------------------------------------

  if (error !== null && error !== undefined) {
    return (
      <ProfileState
        message={error.message}
        onRetry={handleRetry}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Missing Data
  // ---------------------------------------------------------------------------

  if (profile === null || profile === undefined) {
    return (
      <ProfileState
        message="Your traveller profile could not be found. Please try again."
        onRetry={handleRetry}
      />
    );
  }

  if (verification === null || verification === undefined) {
    return (
      <ProfileState
        message="Your verification profile could not be loaded."
        onRetry={handleRetry}
      />
    );
  }

  if (identity === null || identity === undefined) {
    return (
      <ProfileState
        message="Your account information could not be loaded."
        onRetry={handleRetry}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Presentation Composition
  // ---------------------------------------------------------------------------

  return (
    <>
      <ProfilePage
        profile={profile}
        verification={verification}
        verificationRequirements={verificationRequirements}
        avatarUrl={avatarAsset?.url ?? null}
        avatarAlt={
          avatarAsset?.alt ?? `@${profile.handle} profile photo`
        }
        avatarFallback={profile.handle.charAt(0).toUpperCase()}
        visibilityDescription={
          profile.visibility === 'PUBLIC'
            ? 'Your public traveller profile is visible according to your visibility settings.'
            : profile.visibility === 'LIMITED'
              ? 'Your profile is visible in a limited way according to your visibility settings.'
              : 'Your profile is currently private.'
        }
        email={identity.email}
        phoneNumber={resolvePhoneNumber(identity.phoneNumber)}
        accountStatus={identity.status}
        onChangePhoto={handleChangePhoto}
        onManageVerification={handleManageVerification}
        onManageMemberVerification={handleManageMemberVerification}
        onManageDriverVerification={handleManageDriverVerification}
        onViewReputation={handleViewReputation}
        onManageCorridors={handleManageCorridors}
        onEditPreferences={handleEditPreferences}
        onAccountSettings={handleAccountSettings}
      />

      <AssetUploadDialog
        open={isPhotoUploadOpen}
        onOpenChange={setIsPhotoUploadOpen}
        category="PROFILE_PHOTO"
        type="IMAGE"
        title="Change profile photo"
        description="Choose a clear photo that represents you on your traveller profile."
        accept="image/*"
        onUploaded={handleProfilePhotoUploaded}
      />
    </>
  );
}

export default ProfilePageContainer;
