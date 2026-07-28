// src/domains/identity/application/services/verification-query.service.ts

import type { VerificationLevel } from '../../domain/enums/verification-level.enum';
import type { VerificationStatus } from '../../domain/enums/verification-status.enum';

import type { VerificationListItem } from '../contracts/verification-list-item';
import type { VerificationRequestResult } from '../contracts/verification-request-result';
import type { VerificationResult } from '../contracts/verification-result';
import type { VerificationReviewResult } from '../contracts/verification-review-result';
import type { VerificationSummary } from '../contracts/verification-summary';

export abstract class VerificationQueryService {
  /**
   * Returns the complete verification projection.
   */
  abstract findByPublicId(
    verificationPublicId: string,
  ): Promise<VerificationResult | null>;

  /**
   * Returns the verification associated with an identity.
   */
  abstract findByIdentityPublicId(
    identityPublicId: string,
  ): Promise<VerificationResult | null>;

  /**
   * Returns a lightweight verification summary.
   */
  abstract findSummary(
    verificationPublicId: string,
  ): Promise<VerificationSummary | null>;

  /**
   * Returns a verification request.
   */
  abstract findRequest(
    requestPublicId: string,
  ): Promise<VerificationRequestResult | null>;

  /**
   * Returns the review outcome for a verification request.
   */
  abstract findReview(
    requestPublicId: string,
  ): Promise<VerificationReviewResult | null>;

  /**
   * Lists all verifications.
   */
  abstract findAll(): Promise<VerificationListItem[]>;

  /**
   * Lists verifications with the specified status.
   */
  abstract findByStatus(
    status: VerificationStatus,
  ): Promise<VerificationListItem[]>;

  /**
   * Lists verifications with the specified verification level.
   */
  abstract findByLevel(
    level: VerificationLevel,
  ): Promise<VerificationListItem[]>;

  /**
   * Lists verifications awaiting review.
   */
  abstract findPending(): Promise<VerificationListItem[]>;

  /**
   * Lists expired verifications.
   */
  abstract findExpired(): Promise<VerificationListItem[]>;

  /**
   * Lists verifications expiring before the specified date.
   */
  abstract findExpiringSoon(before: Date): Promise<VerificationListItem[]>;

  /**
   * Lists requests belonging to a verification.
   */
  abstract listVerificationRequests(
    verificationPublicId: string,
  ): Promise<VerificationRequestResult[]>;

  /**
   * Lists pending verification requests.
   */
  abstract listPendingRequests(): Promise<VerificationRequestResult[]>;
}
