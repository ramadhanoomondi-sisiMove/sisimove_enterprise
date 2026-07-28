// src/domains/identity/application/contracts/verification-review-result.ts

import type { VerificationLevel } from '../../domain/enums/verification-level.enum';
import type { VerificationRequestStatus } from '../../domain/enums/verification-request-status.enum';
import type { VerificationRequestType } from '../../domain/enums/verification-request-type.enum';
import type { VerificationStatus } from '../../domain/enums/verification-status.enum';

export interface VerificationReviewResult {
  /**
   * Internal verification identifier.
   */
  verificationId: string;

  /**
   * Public verification identifier.
   */
  verificationPublicId: string;

  /**
   * Public verification request identifier.
   */
  requestPublicId: string;

  /**
   * Reviewed request type.
   */
  requestType: VerificationRequestType;

  /**
   * Final request status.
   */
  status: VerificationRequestStatus;

  /**
   * Overall verification state after the review.
   */
  verificationStatus: VerificationStatus;

  /**
   * Verification level after the review.
   */
  verificationLevel: VerificationLevel;

  /**
   * Reviewer's public identity identifier.
   */
  reviewerPublicId: string;

  /**
   * When the review decision was made.
   */
  reviewedAt: Date;

  /**
   * Present only for rejected requests.
   */
  rejectionReason?: string;

  /**
   * Audit timestamps.
   */
  createdAt: Date;
  updatedAt: Date;
}
