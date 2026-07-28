// src/domains/identity/application/contracts/verification-summary.ts

import type { VerificationDecisionReason } from '../../domain/enums/verification-decision-reason.enum';
import type { VerificationLevel } from '../../domain/enums/verification-level.enum';
import type { VerificationStatus } from '../../domain/enums/verification-status.enum';

export interface VerificationSummary {
  /**
   * Internal verification identifier.
   */
  verificationId: string;

  /**
   * Public verification identifier.
   */
  verificationPublicId: string;

  /**
   * Public identifier of the verified identity.
   */
  identityPublicId: string;

  /**
   * Current verification status.
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
   * Individual verification timestamps.
   */
  profilePhotoVerifiedAt?: Date;
  governmentIdVerifiedAt?: Date;
  driverLicenseVerifiedAt?: Date;

  /**
   * Business verification milestones.
   */
  memberVerifiedAt?: Date;
  driverVerifiedAt?: Date;

  /**
   * Verification lifecycle.
   */
  verifiedAt?: Date;
  expiresAt?: Date;

  /**
   * Most recent review information.
   */
  reviewedByPublicId?: string;
  decisionReason?: VerificationDecisionReason;
  rejectionReason?: string;
  lastReviewedAt?: Date;

  /**
   * Request statistics.
   */
  pendingRequestCount: number;
  approvedRequestCount: number;
  rejectedRequestCount: number;

  /**
   * Audit timestamps.
   */
  createdAt: Date;
  updatedAt: Date;
}
