import type { AssetId } from 'src/domains/assets/domain/value-objects';
import type { VerificationRequestStatus } from '../enums/verification-request-status.enum';
import type { VerificationRequestType } from '../enums/verification-request-type.enum';

import type { IdentityId } from '../value-objects/identity-id.vo';
import type { VerificationId } from '../value-objects/verification-id.vo';

export interface VerificationRequestProps {
  verificationId: VerificationId;

  type: VerificationRequestType;

  status: VerificationRequestStatus;

  assetId: AssetId;

  submittedAt: Date;

  reviewedAt?: Date;

  reviewedById?: IdentityId;

  rejectionReason?: string;

  metadata?: Readonly<Record<string, unknown>>;

  createdAt: Date;

  updatedAt: Date;
}
