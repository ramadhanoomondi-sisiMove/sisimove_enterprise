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
// - Managing server state with useState/useEffect.
//
// Architecture:
//
//     Authenticated Route
//            │
//            ▼
//     ProfilePageContainer
//            │
//       ┌────┼─────────────────────────┐
//       │    │            │            │
//       ▼    ▼            ▼            ▼
//    Profile Verification Identity   Avatar
//       │    │            │            │
//       │    └─ Requests   │            │
//       │                 │            │
//       └─────────────────┴────────────┘
//                         │
//                         ▼
//                    ProfilePage
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
// - journey statistics;
// - corridors;
// - preferences.
//
// Verification remains authoritative for verification state.
//
// Identity remains authoritative for account contact information and
// account lifecycle status.
//
// -----------------------------------------------------------------------------
//
// Authenticated Traveller Profile:
//
//     GET /traveller-profiles/me
//
// Authenticated Identity:
//
//     GET /identities/me
//
// Both endpoints derive the authenticated Identity from the access token.
// The client therefore does not supply an Identity public ID.
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import {
  useCallback,
  useMemo,
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
} from '@/features/assets';

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
//
// IMPORTANT:
//
// Do not move this hook into:
//
//     @/features/authentication
//
// merely to make the import convenient.
//
// Authentication and Identity are separate bounded contexts.
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
// Component
// =============================================================================

/**
 * Authenticated traveller profile composition container.
 *
 * This component composes independently owned server-state boundaries and
 * passes the resulting presentation model into ProfilePage.
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
  //
  // Identity owns the authenticated self-read.
  //
  // Backend endpoint:
  //
  //     GET /identities/me
  //
  // Authentication is supplied by the Identity feature's query/API boundary.
  //
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
  // Presentation Actions
  // ---------------------------------------------------------------------------

  const handleChangePhoto = useCallback((): void => {
    // Avatar upload workflow is intentionally not invented here.
  }, []);

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
    return (
      <main>
        <Container size="lg" padded>
          <div className="space-y-8 py-8">
            <div className="space-y-3">
              <div className="h-8 w-32 animate-pulse rounded bg-muted" />

              <div className="h-4 w-72 animate-pulse rounded bg-muted" />
            </div>

            <div className="space-y-4">
              <div className="h-40 animate-pulse rounded-lg bg-muted" />

              <div className="h-48 animate-pulse rounded-lg bg-muted" />

              <div className="h-48 animate-pulse rounded-lg bg-muted" />
            </div>
          </div>
        </Container>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Error State
  // ---------------------------------------------------------------------------

  if (error !== null && error !== undefined) {
    return (
      <main>
        <Container size="lg" padded>
          <div className="py-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Profile
            </h1>

            <div className="mt-6 rounded-lg border border-destructive/20 bg-destructive/5 p-5">
              <p className="text-sm font-medium text-foreground">
                We couldn&apos;t load your profile.
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {error.message}
              </p>

              <button
                type="button"
                onClick={handleRetry}
                className="mt-4 rounded-md border px-4 py-2 text-sm font-medium"
              >
                Try again
              </button>
            </div>
          </div>
        </Container>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Missing Profile
  // ---------------------------------------------------------------------------

  if (profile === null || profile === undefined) {
    return (
      <main>
        <Container size="lg" padded>
          <div className="py-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Profile
            </h1>

            <p className="mt-4 text-sm text-muted-foreground">
              Your traveller profile could not be found.
            </p>
          </div>
        </Container>
      </main>
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
      <main>
        <Container size="lg" padded>
          <div className="py-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Profile
            </h1>

            <p className="mt-4 text-sm text-muted-foreground">
              Your verification profile could not be loaded.
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="mt-4 rounded-md border px-4 py-2 text-sm font-medium"
            >
              Try again
            </button>
          </div>
        </Container>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Missing Identity
  // ---------------------------------------------------------------------------

  if (identity === null || identity === undefined) {
    return (
      <main>
        <Container size="lg" padded>
          <div className="py-8">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Profile
            </h1>

            <p className="mt-4 text-sm text-muted-foreground">
              Your account information could not be loaded.
            </p>

            <button
              type="button"
              onClick={handleRetry}
              className="mt-4 rounded-md border px-4 py-2 text-sm font-medium"
            >
              Try again
            </button>
          </div>
        </Container>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Presentation Composition
  // ---------------------------------------------------------------------------

  return (
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
  );
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ProfilePageContainer;

