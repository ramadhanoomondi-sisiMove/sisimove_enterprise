// src/domains/identity/domain/repositories/verification.repository.ts

import type { VerificationAggregate } from '../aggregates/verification.aggregate';
import type { VerificationRequestEntity } from '../entities/verification-request.entity';

import type { IdentityId } from '../value-objects/identity-id.vo';
import type { VerificationId } from '../value-objects/verification-id.vo';
import type { VerificationRequestId } from '../value-objects/verification-request-id.vo';

export abstract class VerificationRepository {
  abstract save(verification: VerificationAggregate): Promise<void>;

  abstract update(verification: VerificationAggregate): Promise<void>;

  /**
   * Database UUID
   */
  abstract findById(id: string): Promise<VerificationAggregate | null>;

  /**
   * Public VerificationId
   */
  abstract findByPublicId(
    publicId: VerificationId,
  ): Promise<VerificationAggregate | null>;

  abstract findByIdentityId(
    identityId: IdentityId,
  ): Promise<VerificationAggregate | null>;

  /**
   * Database UUID
   */
  abstract findRequestById(
    id: string,
  ): Promise<VerificationRequestEntity | null>;

  /**
   * Public VerificationRequestId
   */
  abstract findRequestByPublicId(
    publicId: VerificationRequestId,
  ): Promise<VerificationRequestEntity | null>;
}
