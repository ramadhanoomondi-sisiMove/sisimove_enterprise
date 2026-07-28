// src/domains/identity/domain/repositories/identity.repository.ts

import type { IdentityAggregate } from '../aggregates/identity.aggregate';
import type { AuthenticationEntity } from '../entities/authentication.entity';
import type { Email } from '../value-objects/email.vo';
import type { IdentityId } from '../value-objects/identity-id.vo';

export abstract class IdentityRepository {
  abstract save(
    identity: IdentityAggregate,
    authentication: AuthenticationEntity,
  ): Promise<void>;

  abstract update(identity: IdentityAggregate): Promise<void>;

  abstract findById(id: IdentityId): Promise<IdentityAggregate | null>;

  abstract findByEmail(email: Email): Promise<IdentityAggregate | null>;

  abstract findByPublicId(
    publicId: IdentityId,
  ): Promise<IdentityAggregate | null>;

  abstract findAuthenticationByIdentityId(
    identityId: string,
  ): Promise<AuthenticationEntity | null>;
}
