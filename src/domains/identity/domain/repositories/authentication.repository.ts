// src/domains/identity/domain/repositories/authentication.repository.ts

import type { AuthenticationAggregate } from '../aggregates/authentication.aggregate';

import type { AuthenticationEntity } from '../entities/authentication.entity';
import type { PasswordHistoryEntity } from '../entities/password-history.entity';

import type { AuthenticationId } from '../value-objects/authentication-id.vo';
import type { IdentityId } from '../value-objects/identity-id.vo';

export interface AuthenticationRepository {
  // ------------------------------------------------------------------
  // Persistence
  // ------------------------------------------------------------------

  /**
   * Persists an Authentication aggregate.
   */
  save(aggregate: AuthenticationAggregate): Promise<void>;

  /**
   * Removes an Authentication aggregate.
   */
  delete(aggregate: AuthenticationAggregate): Promise<void>;

  // ------------------------------------------------------------------
  // Aggregate Queries
  // ------------------------------------------------------------------

  /**
   * Finds an Authentication aggregate by its public identifier.
   */
  findByPublicId(
    publicId: AuthenticationId,
  ): Promise<AuthenticationAggregate | null>;

  /**
   * Finds an Authentication aggregate by the owning Identity.
   */
  findByIdentityId(
    identityId: IdentityId,
  ): Promise<AuthenticationAggregate | null>;

  // ------------------------------------------------------------------
  // Entity Queries
  // ------------------------------------------------------------------

  /**
   * Finds an Authentication entity by its public identifier.
   */
  findEntityByPublicId(
    publicId: AuthenticationId,
  ): Promise<AuthenticationEntity | null>;

  /**
   * Finds an Authentication entity by the owning Identity.
   */
  findEntityByIdentityId(
    identityId: IdentityId,
  ): Promise<AuthenticationEntity | null>;

  // ------------------------------------------------------------------
  // Password History
  // ------------------------------------------------------------------

  /**
   * Returns the complete password history for an Authentication.
   *
   * Uses the aggregate's internal UUID.
   */
  findPasswordHistory(
    authenticationId: string,
  ): Promise<PasswordHistoryEntity[]>;

  /**
   * Returns the latest password history entry.
   *
   * Uses the aggregate's internal UUID.
   */
  findLatestPasswordHistory(
    authenticationId: string,
  ): Promise<PasswordHistoryEntity | null>;

  // ------------------------------------------------------------------
  // Existence
  // ------------------------------------------------------------------

  /**
   * Returns true if an Authentication exists for the supplied Identity.
   */
  existsByIdentityId(identityId: IdentityId): Promise<boolean>;

  /**
   * Returns true if an Authentication exists for the supplied public identifier.
   */
  existsByPublicId(publicId: AuthenticationId): Promise<boolean>;
}
