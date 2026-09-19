// -----------------------------------------------------------------------------
// sisiMove — Verification Mapper
// -----------------------------------------------------------------------------
//
// Maps the backend verification response into the frontend Verification model.
//
// Boundary:
//
//     Backend API DTO
//             │
//             ▼
//     mapVerification()
//             │
//             ▼
//     Frontend Verification model
//
// The mapper deliberately:
// - exposes publicId only;
// - preserves nullable timestamps;
// - preserves verification state exactly as supplied by the backend;
// - excludes internal database/reviewer identifiers.
//
// The API response type is intentionally kept local to this mapper because
// the mapper is the contract boundary between the HTTP representation and the
// feature model.
//
// -----------------------------------------------------------------------------

import type {
  Verification,
  VerificationLevel,
  VerificationStatus,
} from '../models';

interface VerificationApiResponse {
  publicId: string;
  status: VerificationStatus;
  level: VerificationLevel;
  profilePhotoVerified: boolean;
  governmentIdVerified: boolean;
  driverLicenseVerified: boolean;
  verifiedAt: string | null;
  expiresAt: string | null;
  memberVerifiedAt: string | null;
  driverVerifiedAt: string | null;
  profilePhotoVerifiedAt: string | null;
  governmentIdVerifiedAt: string | null;
  driverLicenseVerifiedAt: string | null;
  rejectionReason: string | null;
  lastReviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export function mapVerification(
  response: VerificationApiResponse,
): Verification {
  return {
    publicId: response.publicId,
    status: response.status,
    level: response.level,
    profilePhotoVerified: response.profilePhotoVerified,
    governmentIdVerified: response.governmentIdVerified,
    driverLicenseVerified: response.driverLicenseVerified,
    verifiedAt: response.verifiedAt,
    expiresAt: response.expiresAt,
    memberVerifiedAt: response.memberVerifiedAt,
    driverVerifiedAt: response.driverVerifiedAt,
    profilePhotoVerifiedAt: response.profilePhotoVerifiedAt,
    governmentIdVerifiedAt: response.governmentIdVerifiedAt,
    driverLicenseVerifiedAt: response.driverLicenseVerifiedAt,
    rejectionReason: response.rejectionReason,
    lastReviewedAt: response.lastReviewedAt,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}