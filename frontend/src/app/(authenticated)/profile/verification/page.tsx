// -----------------------------------------------------------------------------
// sisiMove — Verification Page
// -----------------------------------------------------------------------------
//
// Authenticated Verification management page.
//
// Route:
//
//     /profile/verification
//
// Responsibilities:
//
// - load the authenticated identity's Verification aggregate;
// - load the verification requests belonging to that Verification;
// - present overall verification status;
// - present the member/driver verification level;
// - present verification requirements;
// - present the current state of each requirement;
// - guide the traveller toward submitting required evidence;
// - expose reload capability.
//
// Non-responsibilities:
//
// - authentication/session management;
// - authorization decisions;
// - verification business rules;
// - Verification aggregate mutation;
// - file upload implementation;
// - VerificationRequest lifecycle implementation;
// - construction of Asset URLs.
//
// Those responsibilities remain inside their respective feature boundaries.
//
// Data boundary:
//
//     useVerification()
//          ↓
//     GET /verifications/me
//          ↓
//     Verification
//
//     useVerificationRequests(verification.publicId)
//          ↓
//     GET /verifications/:verificationPublicId/requests
//          ↓
//     VerificationRequest[]
//
// Requirement state:
//
//     Verification + VerificationRequest[]
//          ↓
//     local read-model projection
//          ↓
//     VerificationRequirement[]
//
// The requirement projection is intentionally isolated from the page.
// If/when the backend exposes an authoritative VerificationRequirement
// read model, this projection can be replaced without changing the page UI.
//
// -----------------------------------------------------------------------------

'use client';

// -----------------------------------------------------------------------------
// React
// -----------------------------------------------------------------------------

import {
  useMemo,
} from 'react';

// -----------------------------------------------------------------------------
// Next.js
// -----------------------------------------------------------------------------

import Link from 'next/link';

// -----------------------------------------------------------------------------
// Verification — Feature
// -----------------------------------------------------------------------------

import {
  useVerification,
  useVerificationRequests,
} from '@/features/verification/hooks';

import type {
  Verification,
  VerificationRequest,
  VerificationRequestType,
  VerificationRequirement,
  VerificationRequirementStatus,
  VerificationRequirementType,
} from '@/features/verification/models';

// =============================================================================
// Helpers
// =============================================================================

function formatDate(value: string | null): string {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('en-KE', {
    dateStyle: 'medium',
  }).format(date);
}

// =============================================================================
// Verification Status
// =============================================================================

function getStatusLabel(
  status: Verification['status'],
): string {
  switch (status) {
    case 'VERIFIED':
      return 'Verified';

    case 'PENDING':
      return 'Under review';

    case 'REJECTED':
      return 'Action required';

    case 'EXPIRED':
      return 'Expired';

    case 'REVOKED':
      return 'Revoked';

    default:
      return status;
  }
}

function getStatusDescription(
  status: Verification['status'],
): string {
  switch (status) {
    case 'VERIFIED':
      return 'Your verification has been approved.';

    case 'PENDING':
      return 'Your submitted verification evidence is being reviewed.';

    case 'REJECTED':
      return 'Your verification needs attention. Review the requirements below.';

    case 'EXPIRED':
      return 'Your verification has expired and may need to be renewed.';

    case 'REVOKED':
      return 'Your verification is no longer active.';

    default:
      return 'Review your verification requirements below.';
  }
}

// =============================================================================
// Verification Level
// =============================================================================

function getLevelLabel(
  level: Verification['level'],
): string {
  switch (level) {
    case 'DRIVER':
      return 'Driver verified';

    case 'MEMBER':
      return 'Member verified';

    case 'NONE':
      return 'Not yet verified';

    default:
      return level;
  }
}

// =============================================================================
// Requirement Labels
// =============================================================================

function getRequirementLabel(
  type: VerificationRequirementType,
): string {
  switch (type) {
    case 'PROFILE_PHOTO':
      return 'Profile photo';

    case 'GOVERNMENT_ID':
      return 'Government ID';

    case 'DRIVER_LICENSE':
      return 'Driver licence';

    default:
      return type;
  }
}

function getRequirementDescription(
  type: VerificationRequirementType,
): string {
  switch (type) {
    case 'PROFILE_PHOTO':
      return 'A clear profile photo helps other travellers recognise you.';

    case 'GOVERNMENT_ID':
      return 'A valid government-issued ID confirms your identity.';

    case 'DRIVER_LICENSE':
      return 'A valid driver licence is required for driver verification.';

    default:
      return 'Submit the requested verification evidence.';
  }
}

function getRequirementStatusLabel(
  status: VerificationRequirementStatus,
): string {
  switch (status) {
    case 'NOT_STARTED':
      return 'Not submitted';

    case 'PENDING':
      return 'Under review';

    case 'APPROVED':
      return 'Approved';

    case 'REJECTED':
      return 'Action required';

    case 'CANCELLED':
      return 'Cancelled';

    default:
      return status;
  }
}

// =============================================================================
// Requirement State
// =============================================================================
//
// VerificationRequest and VerificationRequirement are intentionally separate.
//
// VerificationRequest:
//     Represents the submitted evidence and its review lifecycle.
//
// VerificationRequirement:
//     Represents what the traveller needs and the current state of that
//     requirement.
//
// Until the backend exposes an authoritative requirement read model, this
// page creates a small presentation/read-model projection from Verification
// and the latest request for each requirement type.
//
// This helper contains no mutation and no domain business rules.
//

function getLatestRequestByType(
  requests: readonly VerificationRequest[],
): Map<VerificationRequestType, VerificationRequest> {
  const latest = new Map<
    VerificationRequestType,
    VerificationRequest
  >();

  for (const request of requests) {
    const existing = latest.get(request.type);

    if (!existing) {
      latest.set(request.type, request);
      continue;
    }

    const existingTime = new Date(existing.submittedAt).getTime();
    const requestTime = new Date(request.submittedAt).getTime();

    if (requestTime > existingTime) {
      latest.set(request.type, request);
    }
  }

  return latest;
}

function getRequirementStatus(
  request: VerificationRequest | undefined,
  verified: boolean,
): VerificationRequirementStatus {
  if (verified) {
    return 'APPROVED';
  }

  if (!request) {
    return 'NOT_STARTED';
  }

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
      return 'NOT_STARTED';
  }
}

// =============================================================================
// Requirement Projection
// =============================================================================
//
// IMPORTANT:
//
// This is a frontend read-model projection only.
//
// It must not become the source of truth for verification policy. The backend
// remains authoritative for determining which requirements actually apply.
//
// The current projection exposes all supported evidence types so the traveller
// can see the available verification checks. Driver licence is specifically
// marked as applicable to DRIVER verification.
//
// -----------------------------------------------------------------------------

function buildVerificationRequirements(
  verification: Verification,
  requests: readonly VerificationRequest[],
): VerificationRequirement[] {
  const latestRequests = getLatestRequestByType(requests);

  const definitions: Array<{
    type: VerificationRequirementType;
    required: boolean;
    verified: boolean;
  }> = [
    {
      type: 'PROFILE_PHOTO',
      required: true,
      verified: verification.profilePhotoVerified,
    },
    {
      type: 'GOVERNMENT_ID',
      required: true,
      verified: verification.governmentIdVerified,
    },
    {
      type: 'DRIVER_LICENSE',
      required: verification.level === 'DRIVER',
      verified: verification.driverLicenseVerified,
    },
  ];

  return definitions.map((definition) => {
    const request = latestRequests.get(definition.type);

    return {
      type: definition.type,
      required: definition.required,
      status: getRequirementStatus(
        request,
        definition.verified,
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
// Status Badge
// =============================================================================

function VerificationStatusBadge({
  status,
}: {
  status: Verification['status'];
}) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full border px-3 py-1',
        'text-xs font-medium',
        status === 'VERIFIED'
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
          : status === 'PENDING'
            ? 'border-amber-200 bg-amber-50 text-amber-700'
            : status === 'REJECTED'
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-slate-200 bg-slate-50 text-slate-700',
      ].join(' ')}
    >
      {getStatusLabel(status)}
    </span>
  );
}

// =============================================================================
// Requirement Status
// =============================================================================

function RequirementStatus({
  status,
}: {
  status: VerificationRequirementStatus;
}) {
  const className =
    status === 'APPROVED'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : status === 'PENDING'
        ? 'border-amber-200 bg-amber-50 text-amber-700'
        : status === 'REJECTED'
          ? 'border-red-200 bg-red-50 text-red-700'
          : status === 'CANCELLED'
            ? 'border-slate-200 bg-slate-100 text-slate-600'
            : 'border-slate-200 bg-white text-slate-600';

  return (
    <span
      className={[
        'inline-flex shrink-0 items-center rounded-full border px-2.5 py-1',
        'text-xs font-medium',
        className,
      ].join(' ')}
    >
      {getRequirementStatusLabel(status)}
    </span>
  );
}

// =============================================================================
// Verification Level Card
// =============================================================================

function VerificationLevelCard({
  verification,
}: {
  verification: Verification;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">
            Verification level
          </p>

          <h2 className="mt-1 text-lg font-semibold text-slate-900">
            {getLevelLabel(verification.level)}
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            Your verification level determines which verified traveller
            capabilities are available to your account.
          </p>
        </div>

        <VerificationStatusBadge
          status={verification.status}
        />
      </div>
    </section>
  );
}

// =============================================================================
// Verification Requirements
// =============================================================================

function VerificationRequirements({
  requirements,
}: {
  requirements: readonly VerificationRequirement[];
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">
          Verification requirements
        </h2>

        <p className="mt-1 text-sm leading-6 text-slate-600">
          Review the verification evidence available for your account and
          complete any required checks.
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {requirements.map((requirement) => (
          <div
            key={requirement.type}
            className="px-5 py-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {getRequirementLabel(requirement.type)}
                  </h3>

                  {requirement.required ? (
                    <span className="text-xs font-medium text-slate-500">
                      Required
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-slate-400">
                      Driver only
                    </span>
                  )}
                </div>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                  {getRequirementDescription(requirement.type)}
                </p>

                {requirement.submittedAt && (
                  <p className="mt-2 text-xs text-slate-500">
                    Submitted {formatDate(requirement.submittedAt)}
                  </p>
                )}

                {requirement.reviewedAt && (
                  <p className="mt-1 text-xs text-slate-500">
                    Reviewed {formatDate(requirement.reviewedAt)}
                  </p>
                )}

                {requirement.rejectionReason && (
                  <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5">
                    <p className="text-xs font-medium text-red-800">
                      Review feedback
                    </p>

                    <p className="mt-1 text-sm leading-5 text-red-700">
                      {requirement.rejectionReason}
                    </p>
                  </div>
                )}
              </div>

              <RequirementStatus
                status={requirement.status}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// =============================================================================
// Verification Checks
// =============================================================================

function VerificationChecks({
  verification,
}: {
  verification: Verification;
}) {
  const checks = [
    {
      label: 'Profile photo',
      verified: verification.profilePhotoVerified,
    },
    {
      label: 'Government ID',
      verified: verification.governmentIdVerified,
    },
    {
      label: 'Driver licence',
      verified: verification.driverLicenseVerified,
    },
  ];

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">
          Verification checks
        </h2>

        <p className="mt-1 text-sm text-slate-600">
          These checks show which submitted credentials have been approved.
        </p>
      </div>

      <div className="divide-y divide-slate-100">
        {checks.map((check) => (
          <div
            key={check.label}
            className="flex items-center justify-between gap-4 px-5 py-4"
          >
            <span className="text-sm font-medium text-slate-800">
              {check.label}
            </span>

            <span
              className={
                check.verified
                  ? 'text-sm font-medium text-emerald-700'
                  : 'text-sm text-slate-500'
              }
            >
              {check.verified
                ? 'Verified'
                : 'Not verified'}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// =============================================================================
// Verification Details
// =============================================================================

function VerificationDetails({
  verification,
}: {
  verification: Verification;
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-semibold text-slate-900">
          Verification details
        </h2>
      </div>

      <dl className="grid gap-4 px-5 py-5 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Status
          </dt>

          <dd className="mt-1 text-sm text-slate-900">
            {getStatusLabel(verification.status)}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Level
          </dt>

          <dd className="mt-1 text-sm text-slate-900">
            {getLevelLabel(verification.level)}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Verified on
          </dt>

          <dd className="mt-1 text-sm text-slate-900">
            {formatDate(verification.verifiedAt)}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Expires
          </dt>

          <dd className="mt-1 text-sm text-slate-900">
            {formatDate(verification.expiresAt)}
          </dd>
        </div>

        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Last reviewed
          </dt>

          <dd className="mt-1 text-sm text-slate-900">
            {formatDate(verification.lastReviewedAt)}
          </dd>
        </div>
      </dl>

      {verification.rejectionReason && (
        <div className="border-t border-slate-200 bg-red-50 px-5 py-4">
          <p className="text-sm font-medium text-red-800">
            Review feedback
          </p>

          <p className="mt-1 text-sm leading-6 text-red-700">
            {verification.rejectionReason}
          </p>
        </div>
      )}
    </section>
  );
}

// =============================================================================
// Page
// =============================================================================

export default function VerificationPage() {
  // ===========================================================================
  // Verification
  // ===========================================================================

  const {
    verification,
    isLoading: isVerificationLoading,
    error: verificationError,
    reload: reloadVerification,
  } = useVerification();

  // ===========================================================================
  // Verification Requests
  // ===========================================================================
  //
  // Requests are loaded only after the current Verification aggregate has
  // been resolved. This preserves the parent → child resource boundary.
  //

  const {
    requests,
    isLoading: areRequestsLoading,
    error: requestsError,
    reload: reloadRequests,
  } = useVerificationRequests(
    verification?.publicId ?? null,
  );

  // ===========================================================================
  // Requirement Projection
  // ===========================================================================

  const requirements = useMemo(() => {
    if (!verification) {
      return [];
    }

    return buildVerificationRequirements(
      verification,
      requests,
    );
  }, [
    verification,
    requests,
  ]);

  // ===========================================================================
  // Retry
  // ===========================================================================

  const handleRetryVerification = () => {
    void reloadVerification();
  };

  const handleRetryRequests = () => {
    void reloadRequests();
  };

  // ===========================================================================
  // Loading
  // ===========================================================================

  if (isVerificationLoading) {
    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        <div className="space-y-6">
          <div className="h-8 w-48 animate-pulse rounded bg-slate-100" />

          <div className="h-20 animate-pulse rounded-xl bg-slate-100" />

          <div className="h-32 animate-pulse rounded-xl bg-slate-100" />

          <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </main>
    );
  }

  // ===========================================================================
  // Verification Error
  // ===========================================================================

  if (verificationError) {
    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        <section className="rounded-xl border border-red-200 bg-red-50 p-6">
          <h1 className="text-lg font-semibold text-red-900">
            Unable to load verification
          </h1>

          <p className="mt-2 text-sm leading-6 text-red-700">
            {verificationError.message}
          </p>

          <button
            type="button"
            onClick={handleRetryVerification}
            className="mt-4 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-100"
          >
            Try again
          </button>
        </section>
      </main>
    );
  }

  // ===========================================================================
  // Missing Verification
  // ===========================================================================
  //
  // Registration creates the Verification aggregate, so absence is defensive
  // handling rather than a normal domain state.
  //

  if (!verification) {
    return (
      <main className="mx-auto w-full max-w-5xl px-6 py-8">
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h1 className="text-lg font-semibold text-slate-900">
            Verification unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            We could not find your verification information. Please try
            loading the page again.
          </p>

          <button
            type="button"
            onClick={handleRetryVerification}
            className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            Reload
          </button>
        </section>
      </main>
    );
  }

  // ===========================================================================
  // Page
  // ===========================================================================

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="space-y-6">

        {/* ----------------------------------------------------------------- */}
        {/* Header */}
        {/* ----------------------------------------------------------------- */}

        <header>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500">
                PROFILE
              </p>

              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                Verification
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Verify your identity so other travellers can have more
                confidence when travelling with you.
              </p>
            </div>

            <VerificationStatusBadge
              status={verification.status}
            />
          </div>
        </header>

        {/* ----------------------------------------------------------------- */}
        {/* Status */}
        {/* ----------------------------------------------------------------- */}

        <section className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-slate-900">
                {getStatusLabel(verification.status)}
              </h2>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                {getStatusDescription(verification.status)}
              </p>
            </div>

            <Link
              href="/profile"
              className="text-sm font-medium text-slate-700 hover:text-slate-900"
            >
              Back to profile
            </Link>
          </div>
        </section>

        {/* ----------------------------------------------------------------- */}
        {/* Verification Level */}
        {/* ----------------------------------------------------------------- */}

        <VerificationLevelCard
          verification={verification}
        />

        {/* ----------------------------------------------------------------- */}
        {/* Verification Requirements */}
        {/* ----------------------------------------------------------------- */}

        {areRequestsLoading ? (
          <section className="rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                Verification requirements
              </h2>
            </div>

            <div className="space-y-4 p-5">
              <div className="h-16 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-16 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-16 animate-pulse rounded-lg bg-slate-100" />
            </div>
          </section>
        ) : requestsError ? (
          <section className="rounded-xl border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-base font-semibold text-amber-900">
              Requirements could not be loaded
            </h2>

            <p className="mt-1 text-sm leading-6 text-amber-800">
              Your verification status is available, but we could not load
              your submitted verification requests.
            </p>

            <button
              type="button"
              onClick={handleRetryRequests}
              className="mt-4 rounded-lg border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-amber-900 hover:bg-amber-100"
            >
              Try again
            </button>
          </section>
        ) : (
          <VerificationRequirements
            requirements={requirements}
          />
        )}

        {/* ----------------------------------------------------------------- */}
        {/* Verification Checks */}
        {/* ----------------------------------------------------------------- */}

        <VerificationChecks
          verification={verification}
        />

        {/* ----------------------------------------------------------------- */}
        {/* Verification Details */}
        {/* ----------------------------------------------------------------- */}

        <VerificationDetails
          verification={verification}
        />

        {/* ----------------------------------------------------------------- */}
        {/* Verification Action */}
        {/* ----------------------------------------------------------------- */}

        {verification.status !== 'VERIFIED' && (
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Complete verification
                </h2>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
                  Submit the evidence required for your verification level.
                </p>
              </div>

              <Link
                href="/profile/verification/requests"
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                Manage verification
              </Link>
            </div>
          </section>
        )}

      </div>
    </main>
  );
}