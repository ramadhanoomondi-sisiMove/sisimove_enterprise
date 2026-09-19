// -----------------------------------------------------------------------------
// sisiMove — Verification Request Mapper
// -----------------------------------------------------------------------------
//
// Maps the backend VerificationRequest response into the frontend model.
//
// Boundary:
//
//     Backend API DTO
//             │
//             ▼
//     mapVerificationRequest()
//             │
//             ▼
//     Frontend VerificationRequest model
//
// Internal Prisma IDs and reviewer Identity records are intentionally excluded.
//
// -----------------------------------------------------------------------------

import type {
  VerificationRequest,
  VerificationRequestStatus,
  VerificationRequestType,
} from '../models';

interface VerificationRequestApiResponse {
  publicId: string;
  verificationPublicId: string;
  type: VerificationRequestType;
  status: VerificationRequestStatus;
  assetPublicId: string;
  submittedAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export function mapVerificationRequest(
  response: VerificationRequestApiResponse,
): VerificationRequest {
  return {
    publicId: response.publicId,
    verificationPublicId: response.verificationPublicId,
    type: response.type,
    status: response.status,
    assetPublicId: response.assetPublicId,
    submittedAt: response.submittedAt,
    reviewedAt: response.reviewedAt,
    rejectionReason: response.rejectionReason,
    metadata: response.metadata,
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}