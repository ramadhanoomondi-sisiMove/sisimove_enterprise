
/**
 * sisiMove — Admin Member Verification Model
 *
 * Frontend representation of the Verification response.
 *
 * Domain boundaries:
 * - Identity owns account identity and lifecycle.
 * - Verification owns verification status, level, evidence, and review state.
 * - A VerificationRequest represents submitted evidence and its review lifecycle.
 *
 * Important:
 * - An approved request does not automatically mean the member is verified.
 * - Verification status and level come from the Verification aggregate.
 * - No revokedAt or request-level expiresAt is introduced unless the backend
 *   contract explicitly exposes it.
 *
 * Dates are ISO-8601 strings after JSON transport.
 */

/**
 * A submitted evidence request owned by a Verification aggregate.
 */
export interface MemberVerificationRequest {
  /** Public identity of the request. */
  publicId: string;

  /** Public identity of the owning Verification aggregate. */
  verificationPublicId: string;

  /** Evidence request type supplied by the backend. */
  type: string;

  /** Request-level review status, not aggregate verification status. */
  status: string;

  /** Public identity of the submitted evidence asset. */
  assetPublicId: string;

  submittedAt: string;

  reviewedAt?: string;
  reviewedByPublicId?: string;
  rejectionReason?: string;

  metadata?: Readonly<Record<string, unknown>>;

  createdAt: string;
  updatedAt: string;
}

/**
 * Normalized frontend representation of a Verification aggregate.
 */
export interface MemberVerification {
  /** Public identity of the Verification aggregate. */
  publicId: string;

  /** Identity to which this verification belongs. */
  identityPublicId: string;

  /** Aggregate-level verification status. */
  status: string;

  /** Aggregate-level verification level. */
  level: string;

  /** Accepted evidence indicators from the backend. */
  profilePhotoVerified: boolean;
  governmentIdVerified: boolean;
  driverLicenseVerified: boolean;

  /** Aggregate and evidence verification timestamps. */
  verifiedAt?: string;
  memberVerifiedAt?: string;
  driverVerifiedAt?: string;
  expiresAt?: string;

  profilePhotoVerifiedAt?: string;
  governmentIdVerifiedAt?: string;
  driverLicenseVerifiedAt?: string;

  /** Aggregate-level review information. */
  reviewedByPublicId?: string;
  rejectionReason?: string;
  lastReviewedAt?: string;

  /** Requests owned by this Verification aggregate. */
  requests: MemberVerificationRequest[];

  createdAt: string;
  updatedAt: string;
}
