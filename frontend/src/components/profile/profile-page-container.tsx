// -----------------------------------------------------------------------------
// sisiMove — Profile Page Container
// -----------------------------------------------------------------------------
//
// Authenticated traveller profile data composition boundary.
//
// Responsibilities:
// - Resolve the authenticated TravellerProfile.
// - Resolve the authenticated Verification aggregate.
// - Resolve verification request state.
// - Project verification request state into VerificationRequirement[].
// - Resolve the public avatar asset referenced by TravellerProfile.
// - Resolve authenticated Identity/account data required by AccountSection.
// - Compose presentation-level navigation callbacks.
// - Orchestrate the profile-photo upload workflow.
// - Associate an uploaded Asset with the TravellerProfile as its avatar.
// - Refresh TravellerProfile state after a successful avatar change.
// - Pass the complete composition into ProfilePage.
//
// Non-responsibilities:
// - Rendering profile sections.
// - Owning profile presentation.
// - Implementing profile business rules.
// - Implementing verification policy.
// - Performing Trust queries.
// - Performing Trust persistence.
// - Calculating Traveller Profile statistics.
// - Implementing account persistence.
// - Performing HTTP requests directly.
// - Uploading physical files directly.
// - Resolving public Asset URLs directly.
// - Owning Asset lifecycle rules.
//
// Architecture:
//
//     Authenticated Route
//            │
//            ▼
//     ProfilePageContainer
//            │
//       ┌────┼──────────────────────────────┐
//       │    │            │                 │
//       ▼    ▼            ▼                 ▼
//    Profile Verification Identity       Avatar
//       │    │            │                 │
//       │    └─ Requests   │                 │
//       │                 │                 │
//       └─────────────────┴─────────────────┘
//                         │
//                         ▼
//                    ProfilePage
//
// Profile photo workflow:
//
//     ProfileHeader
//          │
//          │ onChangePhoto
//          ▼
//     ProfilePageContainer
//          │
//          ▼
//     AssetUploadDialog
//          │
//          │ Asset
//          ▼
//     useTravellerProfileAvatar
//          │
//          ▼
//     TravellerProfile avatar association
//          │
//          ▼
//     refetch TravellerProfile
//          │
//          ▼
//     usePublicAsset
//
// Important:
//
// ProfilePage remains a presentation composition boundary.
//
// Trust is deliberately NOT loaded here. TrustSection owns its own Trust
// feature read because Trust is an independent bounded context.
//
// Traveller Profile remains authoritative for:
// - handle;
// - bio;
// - country;
// - status;
// - visibility;
// - memberPublicId;
// - avatarAssetPublicId;
// - journey statistics;
// - corridors;
// - preferences.
//
// Verification remains authoritative for verification state.
//
// Identity remains authoritative for account contact information and
// account lifecycle status.
//
// Asset remains authoritative for physical file storage and Asset lifecycle.
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

// -----------------------------------------------------------------------------
// Next.js
// -----------------------------------------------------------------------------

import { useRouter } from 'next/navigation';

// -----------------------------------------------------------------------------
// UI
// -----------------------------------------------------------------------------

import { Container } from '@/components/ui/container';

// -----------------------------------------------------------------------------
// Profile Presentation
// -----------------------------------------------------------------------------

import { ProfilePage } from './profile-page';

// -----------------------------------------------------------------------------
// Traveller Profile
// -----------------------------------------------------------------------------

import {
  useCurrentTravellerProfile,
  useTravellerProfileAvatar,
} from '@/features/traveller-profile/hooks';

// -----------------------------------------------------------------------------
// Verification
// -----------------------------------------------------------------------------

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

// -----------------------------------------------------------------------------
// Assets
// -----------------------------------------------------------------------------

import {
  usePublicAsset,
  type Asset,
} from '@/features/assets';

import {
  AssetUploadDialog,
} from '@/components/assets/asset-upload-dialog';

// -----------------------------------------------------------------------------
// Identity
// -----------------------------------------------------------------------------
//
// IMPORTANT:
//
// Identity is NOT owned by Authentication.
//
// Authentication owns:
// - authentication state;
// - login;
// - logout;
// - authenticated session;
// - authentication storage.
//
// Identity owns:
// - Identity profile;
// - account contact information;
// - account lifecycle state;
// - authenticated self Identity query.
//
// Therefore the authenticated Identity query belongs to:
//
//     @/features/identity
//
// and ultimately calls:
//
//     GET /identities/me
//
// -----------------------------------------------------------------------------

import {
  useCurrentIdentity,
} from '@/features/identity/hooks';

// =============================================================================
// Helpers
// =============================================================================

/**
 * Normalizes an absent account phone number for presentation.
 *
 * AccountSection expects a string, while the Identity boundary may legitimately
 * contain no phone number.
 */
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

/**
 * Resolves the current presentation status for one verification requirement.
 *
 * This function deliberately does not determine whether a requirement is
 * required.
 *
 * Verification policy remains a backend concern.
 */
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

/**
 * Finds the most recent request for each verification request type.
 *
 * VerificationRequest.createdAt is used only to select the latest request
 * for presentation. It is not used to derive verification policy.
 */
function getLatestRequestsByType(
  requests: readonly VerificationRequest[],
): ReadonlyMap<
  VerificationRequestType,
  VerificationRequest
> {
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

/**
 * Projects Verification + VerificationRequest state into the presentation
 * model consumed by VerificationSection.
 *
 * IMPORTANT:
 *
 * `required` is deliberately not inferred here.
 *
 * MEMBER verification uses an OR relationship between profile photo and
 * government ID. Marking both fields as required in the frontend would
 * incorrectly duplicate backend verification policy.
 *
 * Backend verification policy remains authoritative.
 */
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

      // -----------------------------------------------------------------------
      // Requirement policy
      // -----------------------------------------------------------------------
      //
      // The current verification read model does not expose an explicit
      // requirement projection.
      //
      // Therefore the frontend must not invent one.
      //
      // `required` remains false until the backend exposes an authoritative
      // requirement projection.
      //
      // -----------------------------------------------------------------------

      required: false,

      status: resolveRequirementStatus(
        verification,
        type,
        request,
      ),

      requestPublicId:
        request?.publicId ?? null,

      assetPublicId:
        request?.assetPublicId ?? null,

      submittedAt:
        request?.submittedAt ?? null,

      reviewedAt:
        request?.reviewedAt ?? null,

      rejectionReason:
        request?.rejectionReason ?? null,
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
          {/* -----------------------------------------------------------------
              Page heading skeleton
             ----------------------------------------------------------------- */}

          <div className="mb-7 space-y-2">
            <div className="h-7 w-28 animate-pulse rounded-lg bg-[var(--border-subtle)] sm:h-8" />

            <div className="h-4 w-64 animate-pulse rounded-md bg-[var(--border-subtle)]" />
          </div>

          {/* -----------------------------------------------------------------
              Profile content skeletons
             ----------------------------------------------------------------- */}

          <div className="space-y-4">
            <div
              className="
                overflow-hidden
                rounded-[var(--radius-2xl)]
                border
                border-[var(--border)]
                bg-[var(--surface)]
                shadow-[var(--shadow-sm)]
              "
            >
              <div className="h-32 animate-pulse bg-[var(--background-subtle)] sm:h-40" />

              <div className="space-y-4 p-5 sm:p-6">
                <div className="h-7 w-40 animate-pulse rounded-lg bg-[var(--border-subtle)]" />

                <div className="h-4 w-72 max-w-full animate-pulse rounded-md bg-[var(--border-subtle)]" />

                <div className="h-10 w-32 animate-pulse rounded-lg bg-[var(--border-subtle)]" />
              </div>
            </div>

            <div
              className="
                h-44
                animate-pulse
                rounded-[var(--radius-2xl)]
                border
                border-[var(--border)]
                bg-[var(--surface)]
                shadow-[var(--shadow-sm)]
              "
            />

            <div
              className="
                h-44
                animate-pulse
                rounded-[var(--radius-2xl)]
                border
                border-[var(--border)]
                bg-[var(--surface)]
                shadow-[var(--shadow-sm)]
              "
            />
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
          {/* -----------------------------------------------------------------
              Heading
             ----------------------------------------------------------------- */}

          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand)]">
              sisiMove
            </p>

            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.025em] text-[var(--foreground)] sm:text-3xl">
              Profile
            </h1>
          </div>

          {/* -----------------------------------------------------------------
              State card
             ----------------------------------------------------------------- */}

          <section
            className="
              overflow-hidden
              rounded-[var(--radius-2xl)]
              border
              border-[var(--border)]
              bg-[var(--surface)]
              shadow-[var(--shadow-sm)]
            "
          >
            <div className="border-b border-[var(--border-subtle)] bg-[var(--background-subtle)] px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <span
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[var(--danger-soft)]
                    text-sm
                    font-semibold
                    text-[var(--danger)]
                  "
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
                className="
                  mt-5
                  inline-flex
                  min-h-10
                  items-center
                  justify-center
                  rounded-[var(--radius-md)]
                  bg-[var(--brand)]
                  px-4
                  text-sm
                  font-semibold
                  text-[var(--brand-foreground)]
                  shadow-[var(--shadow-sm)]
                  transition
                  hover:bg-[var(--brand-hover)]
                  active:translate-y-px
                "
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
// Component
// =============================================================================

/**
 * Authenticated traveller profile composition container.
 *
 * This component composes independently owned server-state boundaries and
 * passes the resulting presentation model into ProfilePage.
 *
 * It also owns the orchestration boundary for changing the TravellerProfile
 * avatar.
 *
 * It intentionally does not perform imperative data loading.
 */
export function ProfilePageContainer(): ReactNode {
  // ---------------------------------------------------------------------------
  // Routing
  // ---------------------------------------------------------------------------

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

  // ---------------------------------------------------------------------------
  // Verification Requests
  // ---------------------------------------------------------------------------

  const {
    requests,
    isLoading: requestsLoading,
    error: requestsError,
    reload: reloadVerificationRequests,
  } = useVerificationRequests(
    verification?.publicId ?? null,
  );

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

  const avatarAssetPublicId =
    profile?.avatarAssetPublicId ?? null;

  const {
    asset: avatarAsset,
    isLoading: avatarLoading,
  } = usePublicAsset(
    avatarAssetPublicId,
  );

  // ---------------------------------------------------------------------------
  // Profile Photo Dialog
  // ---------------------------------------------------------------------------

  const [
    isPhotoUploadOpen,
    setIsPhotoUploadOpen,
  ] = useState(false);

  // ---------------------------------------------------------------------------
  // Traveller Profile Avatar Mutation
  // ---------------------------------------------------------------------------

  const {
    changeAvatar,
    clearError: clearAvatarChangeError,
  } = useTravellerProfileAvatar();

  // ---------------------------------------------------------------------------
  // Verification Requirement Projection
  // ---------------------------------------------------------------------------

  const verificationRequirements =
    useMemo<readonly VerificationRequirement[]>(() => {
      if (
        verification === null ||
        verification === undefined
      ) {
        return [];
      }

      return buildVerificationRequirements(
        verification,
        requests ?? [],
      );
    }, [
      verification,
      requests,
    ]);

  // ---------------------------------------------------------------------------
  // Loading
  // ---------------------------------------------------------------------------

  const isLoading =
    profileLoading ||
    verificationLoading ||
    requestsLoading ||
    identityLoading ||
    avatarLoading;

  // ---------------------------------------------------------------------------
  // Error
  // ---------------------------------------------------------------------------

  const error =
    profileIsError
      ? profileError
      : identityIsError
        ? identityError
        : verificationError ?? requestsError;

  // ---------------------------------------------------------------------------
  // Retry
  // ---------------------------------------------------------------------------

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
  // Profile Photo — Open
  // ---------------------------------------------------------------------------

  const handleChangePhoto = useCallback((): void => {
    clearAvatarChangeError();
    setIsPhotoUploadOpen(true);
  }, [
    clearAvatarChangeError,
  ]);

  // ---------------------------------------------------------------------------
  // Profile Photo — Uploaded Asset
  // ---------------------------------------------------------------------------
  //
  // AssetUploadDialog owns the physical upload.
  //
  // Once the Asset exists, this container gives its public ID meaning in the
  // Traveller Profile bounded context by associating it as the avatar.
  //
  // The Asset itself remains generic and does not know that it is a profile
  // avatar.
  //
  // IMPORTANT:
  //
  // This callback deliberately does NOT close the upload dialog.
  //
  // AssetUploadDialog awaits this callback and closes itself only after this
  // complete workflow succeeds.
  //
  // If the TravellerProfile association fails, the callback throws and the
  // AssetUploadDialog remains open so the user can see the error.
  //
  // ---------------------------------------------------------------------------

  const handleProfilePhotoUploaded = useCallback(
    async (asset: Asset): Promise<void> => {
      if (
        profile === null ||
        profile === undefined
      ) {
        throw new Error(
          'Your traveller profile could not be loaded. Please try again.',
        );
      }

      await changeAvatar(
        profile.publicId,
        {
          avatarAssetPublicId: asset.publicId,
        },
      );

      await refetchProfile();
    },
    [
      profile,
      changeAvatar,
      refetchProfile,
    ],
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

  const handleAccountSettings = useCallback((): void => {
    // No account-settings route is invented here.
  }, []);

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
  // Missing Profile
  // ---------------------------------------------------------------------------

  if (profile === null || profile === undefined) {
    return (
      <ProfileState
        message="Your traveller profile could not be found. Please try again."
        onRetry={handleRetry}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Missing Verification
  // ---------------------------------------------------------------------------

  if (
    verification === null ||
    verification === undefined
  ) {
    return (
      <ProfileState
        message="Your verification profile could not be loaded."
        onRetry={handleRetry}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Missing Identity
  // ---------------------------------------------------------------------------

  if (identity === null || identity === undefined) {
    return (
      <ProfileState
        message="Your account information could not be loaded."
        onRetry={handleRetry}
      />
    );
  }

  // =============================================================================
  // Presentation Composition
  // =============================================================================

  return (
    <>
      <ProfilePage
        profile={profile}

        verification={verification}

        verificationRequirements={
          verificationRequirements
        }

        avatarUrl={
          avatarAsset?.url ?? null
        }

        avatarAlt={
          avatarAsset?.alt ??
          `@${profile.handle}`
        }

        avatarFallback={
          profile.handle
            .charAt(0)
            .toUpperCase()
        }

        visibilityDescription={
          profile.visibility === 'PUBLIC'
            ? 'Your public traveller profile is visible according to your visibility settings.'
            : profile.visibility === 'LIMITED'
              ? 'Your profile is visible in a limited way according to your visibility settings.'
              : 'Your profile is currently private.'
        }

        email={identity.email}

        phoneNumber={
          resolvePhoneNumber(
            identity.phoneNumber,
          )
        }

        accountStatus={identity.status}

        onChangePhoto={
          handleChangePhoto
        }

        onManageVerification={
          handleManageVerification
        }

        onManageMemberVerification={
          handleManageMemberVerification
        }

        onManageDriverVerification={
          handleManageDriverVerification
        }

        onViewReputation={
          handleViewReputation
        }

        onManageCorridors={
          handleManageCorridors
        }

        onEditPreferences={
          handleEditPreferences
        }

        onAccountSettings={
          handleAccountSettings
        }
      />

      {/* -----------------------------------------------------------------------
          Profile Photo Upload

          This is deliberately outside ProfilePage.

          ProfilePage remains presentation-only while this container owns the
          workflow that gives an uploaded Asset its TravellerProfile meaning.

          The dialog remains open until:
          1. the Asset upload succeeds;
          2. the TravellerProfile avatar association succeeds;
          3. the TravellerProfile is refreshed.
         ----------------------------------------------------------------------- */}

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

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ProfilePageContainer;