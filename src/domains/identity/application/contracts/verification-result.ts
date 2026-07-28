// src/domains/identity/application/contracts/verification-result.ts

import type { VerificationDecisionReason } from '../../domain/enums/verification-decision-reason.enum';
import type { VerificationLevel } from '../../domain/enums/verification-level.enum';
import type { VerificationStatus } from '../../domain/enums/verification-status.enum';

export interface VerificationResult {
  /**
   * Internal aggregate identifier.
   */
  verificationId: string;

  /**
   * Public identifier exposed through the API.
   */
  publicId: string;

  /**
   * Public identifier of the owning identity.
   */
  identityPublicId: string;

  /**
   * Current verification state.
   */
  status: VerificationStatus;

  /**
   * Highest verification level achieved.
   */
  level: VerificationLevel;

  /**
   * Individual verification flags.
   */
  profilePhotoVerified: boolean;
  governmentIdVerified: boolean;
  driverLicenseVerified: boolean;

  /**
   * Timestamp for each successful verification.
   */
  profilePhotoVerifiedAt?: Date;
  governmentIdVerifiedAt?: Date;
  driverLicenseVerifiedAt?: Date;

  /**
   * Business-level verification milestones.
   */
  memberVerifiedAt?: Date;
  driverVerifiedAt?: Date;

  /**
   * Overall verification lifecycle.
   */
  verifiedAt?: Date;
  expiresAt?: Date;

  /**
   * Latest review information.
   */
  reviewedByPublicId?: string;
  rejectionReason?: string;
  decisionReason?: VerificationDecisionReason;
  lastReviewedAt?: Date;

  /**
   * Request statistics.
   */
  pendingRequestCount: number;
  approvedRequestCount: number;
  rejectedRequestCount: number;

  /**
   * Audit information.
   */
  createdAt: Date;
  updatedAt: Date;
}
