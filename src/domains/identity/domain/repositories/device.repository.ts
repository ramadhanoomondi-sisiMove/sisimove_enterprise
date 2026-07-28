// src/domains/identity/domain/repositories/device.repository.ts

import type { DeviceAggregate } from '../aggregates/device.aggregate';
import type { DeviceEntity } from '../entities/device.entity';
import type { DeviceFingerprint } from '../value-objects/device-fingerprint.vo';
import type { DeviceId } from '../value-objects/device-id.vo';

export interface DeviceRepository {
  /**
   * Persists a new or existing device aggregate.
   */
  save(device: DeviceAggregate): Promise<void>;

  /**
   * Deletes a device aggregate.
   */
  delete(device: DeviceAggregate): Promise<void>;

  /**
   * Finds a device aggregate by its internal database UUID.
   */
  findById(id: string): Promise<DeviceAggregate | null>;

  /**
   * Finds a device aggregate by its public identifier.
   */
  findByPublicId(publicId: DeviceId): Promise<DeviceAggregate | null>;

  /**
   * Finds a device aggregate by its fingerprint.
   */
  findByFingerprint(
    fingerprint: DeviceFingerprint,
  ): Promise<DeviceAggregate | null>;

  /**
   * Returns a read-model entity by its public identifier.
   */
  findEntityByPublicId(publicId: DeviceId): Promise<DeviceEntity | null>;

  /**
   * Returns all devices belonging to an identity.
   *
   * Expects the internal Identity UUID (Identity.id),
   * not the public identity ID (IDT-XXXXXXX).
   */
  findByIdentityId(identityId: string): Promise<DeviceEntity[]>;

  /**
   * Returns all trusted devices belonging to an identity.
   *
   * Expects the internal Identity UUID.
   */
  findTrustedByIdentityId(identityId: string): Promise<DeviceEntity[]>;

  /**
   * Returns all pending devices belonging to an identity.
   *
   * Expects the internal Identity UUID.
   */
  findPendingByIdentityId(identityId: string): Promise<DeviceEntity[]>;

  /**
   * Returns true if a fingerprint already exists.
   */
  existsByFingerprint(fingerprint: DeviceFingerprint): Promise<boolean>;
}
