// -----------------------------------------------------------------------------
// Path: src/features/verification/mappers/map-verification-requirements.ts
// -----------------------------------------------------------------------------
//
// sisiMove — Verification Requirements Mapper
//
// Projects the already-mapped Verification aggregate and its Verification
// Requests into the frontend VerificationRequirement presentation model.
//
// Boundary:
//
//     Verification
//          +
//     VerificationRequest[]
//              │
//              ▼
//     mapVerificationRequirements()
//              │
//              ▼
//     VerificationRequirement[]
//
// This is a frontend projection only.
//
// It does NOT:
// - call the API;
// - create verification requests;
// - upload assets;
// - mutate verification state;
// - recreate backend domain objects;
// - determine reviewer decisions;
// - invent additional verification states.
//
// The backend remains authoritative for actual verification state.
//
// Requirement status is derived from the latest request for each evidence type.
// Where the Verification aggregate explicitly reports that an evidence type
// has been verified, APPROVED is authoritative.
//
// Exact requirement statuses:
//
//     NOT_STARTED
//     PENDING
//     APPROVED
//     REJECTED
//     CANCELLED
//
// -----------------------------------------------------------------------------


import type {
  Verification,
  VerificationRequest,
  VerificationRequirement,
  VerificationRequirementType,
  VerificationRequirementStatus,
} from '../models';


// =============================================================================
// Requirement Definition
// =============================================================================
//
// The verification UI currently exposes these three evidence requirements.
//
// The `required` flag belongs to the frontend requirement presentation model.
// It does not establish a backend authorization rule.
//
// -----------------------------------------------------------------------------


const REQUIREMENT_TYPES: readonly VerificationRequirementType[] = [
  'PROFILE_PHOTO',
  'GOVERNMENT_ID',
  'DRIVER_LICENSE',
];


// =============================================================================
// Requirement Verification State
// =============================================================================

function isRequirementVerified(
  verification: Verification,
  type: VerificationRequirementType,
): boolean {
  switch (type) {
    case 'PROFILE_PHOTO':
      return verification.profilePhotoVerified;

    case 'GOVERNMENT_ID':
      return verification.governmentIdVerified;

    case 'DRIVER_LICENSE':
      return verification.driverLicenseVerified;
  }
}


// =============================================================================
// Latest Request
// =============================================================================
//
// A verification type can have more than one historical request.
//
// The latest request is the one with the newest `submittedAt` value.
//
// We deliberately do not mutate or sort the supplied array. A copy is not
// required because Array.prototype.reduce() only reads from it.
//
// -----------------------------------------------------------------------------


function findLatestRequest(
  requests: readonly VerificationRequest[],
  type: VerificationRequirementType,
): VerificationRequest | null {
  let latest: VerificationRequest | null = null;

  for (const request of requests) {
    if (request.type !== type) {
      continue;
    }

    if (latest === null) {
      latest = request;
      continue;
    }

    const latestSubmittedAt = Date.parse(latest.submittedAt);
    const requestSubmittedAt = Date.parse(request.submittedAt);

    if (
      Number.isNaN(latestSubmittedAt) ||
      Number.isNaN(requestSubmittedAt)
    ) {
      // The API contract supplies ISO timestamps. If an invalid timestamp
      // reaches this projection, preserve deterministic input order rather
      // than inventing a timestamp or throwing from a presentation mapper.
      continue;
    }

    if (requestSubmittedAt > latestSubmittedAt) {
      latest = request;
    }
  }

  return latest;
}


// =============================================================================
// Requirement Status
// =============================================================================

function mapRequirementStatus(
  verification: Verification,
  request: VerificationRequest | null,
  type: VerificationRequirementType,
): VerificationRequirementStatus {
  // ---------------------------------------------------------------------------
  // Verified evidence is authoritative from the Verification aggregate.
  // ---------------------------------------------------------------------------

  if (isRequirementVerified(verification, type)) {
    return 'APPROVED';
  }

  // ---------------------------------------------------------------------------
  // No request has ever been submitted for this evidence type.
  // ---------------------------------------------------------------------------

  if (request === null) {
    return 'NOT_STARTED';
  }

  // ---------------------------------------------------------------------------
  // Preserve the exact lifecycle state of the latest request.
  //
  // VerificationRequestStatus and VerificationRequirementStatus intentionally
  // share these lifecycle values except that the requirement model also has
  // NOT_STARTED.
  // ---------------------------------------------------------------------------

  switch (request.status) {
    case 'PENDING':
      return 'PENDING';

    case 'APPROVED':
      return 'APPROVED';

    case 'REJECTED':
      return 'REJECTED';

    case 'CANCELLED':
      return 'CANCELLED';
  }
}


// =============================================================================
// Requirement Projection
// =============================================================================

function mapRequirement(
  verification: Verification,
  requests: readonly VerificationRequest[],
  type: VerificationRequirementType,
): VerificationRequirement {
  const request = findLatestRequest(requests, type);

  const status = mapRequirementStatus(
    verification,
    request,
    type,
  );

  return {
    type,
    required: true,
    status,
    requestPublicId: request?.publicId ?? null,
    assetPublicId: request?.assetPublicId ?? null,
    submittedAt: request?.submittedAt ?? null,
    reviewedAt: request?.reviewedAt ?? null,
    rejectionReason: request?.rejectionReason ?? null,
  };
}


// =============================================================================
// Public Mapper
// =============================================================================
//
// Converts the existing frontend Verification + VerificationRequest models
// into the exact model consumed by the verification onboarding components.
//
// -----------------------------------------------------------------------------


export function mapVerificationRequirements(
  verification: Verification,
  requests: readonly VerificationRequest[],
): readonly VerificationRequirement[] {
  return REQUIREMENT_TYPES.map((type) =>
    mapRequirement(
      verification,
      requests,
      type,
    ),
  );
}

