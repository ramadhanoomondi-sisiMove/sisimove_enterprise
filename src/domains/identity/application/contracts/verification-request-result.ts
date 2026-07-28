// src/domains/identity/application/contracts/verification-request-result.ts

import type { VerificationRequestStatus } from '../../domain/enums/verification-request-status.enum';
import type { VerificationRequestType } from '../../domain/enums/verification-request-type.enum';

export interface VerificationRequestResult {
  /**
   * Internal verification request identifier.
   */
  requestId: string;

  /**
   * Public verification request identifier.
   */
  requestPublicId: string;

  /**
   * Parent verification identifiers.
   */
  verificationId: string;
  verificationPublicId: string;

  /**
   * Public identifier of the owning identity.
   */
  identityPublicId: string;

  /**
   * Request details.
   */
  type: VerificationRequestType;
  status: VerificationRequestStatus;

  /**
   * Uploaded asset associated with this request.
   */
  assetPublicId: string;

  /**
   * Request lifecycle.
   */
  submittedAt: Date;
  expiresAt?: Date;

  /**
   * Review information.
   */
  reviewedAt?: Date;
  reviewedByPublicId?: string;
  rejectionReason?: string;

  /**
   * Optional metadata supplied with the request.
   */
  metadata?: Readonly<Record<string, unknown>>;

  /**
   * Audit timestamps.
   */
  createdAt: Date;
  updatedAt: Date;
}
