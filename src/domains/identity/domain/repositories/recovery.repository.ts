// src/domains/identity/domain/repositories/recovery.repository.ts

import type { RecoveryAggregate } from '../aggregates/recovery.aggregate';
import type { RecoveryEntity } from '../entities/recovery.entity';

import type { RecoveryId } from '../value-objects/recovery-id.vo';
import type { RecoveryStatus } from '../value-objects/recovery-status.enum';
import type { RecoveryType } from '../value-objects/recovery-type.enum';

export interface RecoveryRepository {
  /**
   * Persists a new or existing recovery aggregate.
   */
  save(recovery: RecoveryAggregate): Promise<void>;

  /**
   * Deletes a recovery aggregate.
   */
  delete(recovery: RecoveryAggregate): Promise<void>;

  /**
   * Finds a recovery aggregate by its internal database UUID.
   */
  findById(id: string): Promise<RecoveryAggregate | null>;

  /**
   * Finds a recovery aggregate by its public identifier.
   */
  findByPublicId(publicId: RecoveryId): Promise<RecoveryAggregate | null>;

  /**
   * Finds a recovery aggregate by its recovery token hash.
   */
  findByRecoveryTokenHash(
    recoveryTokenHash: string,
  ): Promise<RecoveryAggregate | null>;

  /**
   * Returns a read-model entity by its public identifier.
   */
  findEntityByPublicId(publicId: RecoveryId): Promise<RecoveryEntity | null>;

  /**
   * Returns all recoveries belonging to an identity.
   *
   * Expects the internal Identity UUID (Identity.id),
   * not the public identity ID (IDT-XXXXXXX).
   */
  findByIdentityId(identityId: string): Promise<RecoveryEntity[]>;

  /**
   * Returns all recoveries for an identity filtered by recovery type.
   */
  findByIdentityIdAndType(
    identityId: string,
    type: RecoveryType,
  ): Promise<RecoveryEntity[]>;

  /**
   * Returns all recoveries having the specified status.
   */
  findByStatus(status: RecoveryStatus): Promise<RecoveryEntity[]>;

  /**
   * Returns all recoveries that have expired before the supplied date.
   */
  findExpired(before: Date): Promise<RecoveryAggregate[]>;

  /**
   * Returns the currently active (pending) recovery for an identity and type,
   * if one exists.
   */
  findActiveByIdentityIdAndType(
    identityId: string,
    type: RecoveryType,
  ): Promise<RecoveryAggregate | null>;

  /**
   * Returns true when an active recovery already exists for the identity
   * and recovery type.
   */
  existsActiveRecovery(
    identityId: string,
    type: RecoveryType,
  ): Promise<boolean>;
}
