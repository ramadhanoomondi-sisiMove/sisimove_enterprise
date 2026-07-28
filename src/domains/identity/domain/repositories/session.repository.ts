// src/domains/identity/domain/repositories/session.repository.ts

import type { SessionEntity } from '../entities/session.entity';

export abstract class SessionRepository {
  abstract save(session: SessionEntity): Promise<void>;

  abstract update(session: SessionEntity): Promise<void>;

  abstract findById(id: string): Promise<SessionEntity | null>;

  abstract findByPublicId(publicId: string): Promise<SessionEntity | null>;

  abstract findByRefreshTokenHash(
    refreshTokenHash: string,
  ): Promise<SessionEntity | null>;

  abstract findActiveSessionsByIdentityId(
    identityId: string,
  ): Promise<SessionEntity[]>;

  abstract revokeAllByIdentityId(identityId: string): Promise<void>;
}
