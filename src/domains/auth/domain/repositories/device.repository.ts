// -----------------------------------------------------------------------------
// Device — Repository
// -----------------------------------------------------------------------------
//
// Repository port for the Device aggregate.
//
// Aggregate:
//
// DeviceAggregate
// └── DeviceEntity
//
// Responsibilities:
//
// - Persist Device aggregates.
// - Retrieve Device aggregates by public identifier.
// - Retrieve Device aggregates by internal identifier.
// - Retrieve Devices belonging to an Identity.
// - Retrieve active Devices belonging to an Identity.
// - Find a Device by Identity + fingerprint.
// - Determine whether a Device exists.
// - Preserve aggregate boundaries.
//
// This repository is a domain/application port.
//
// The implementation belongs to infrastructure:
//
// infrastructure/
// └── persistence/
//     └── prisma/
//         ├── mappers/
//         │   └── device-prisma.mapper.ts
//         └── repositories/
//             └── device-prisma.repository.ts
//
// IMPORTANT:
//
// - This interface does NOT access Prisma.
// - This interface does NOT contain SQL.
// - This interface does NOT contain ORM models.
// - This interface does NOT contain authentication logic.
// - This interface does NOT validate Identity state.
// - This interface does NOT generate fingerprints.
// - This interface does NOT perform device recognition.
//
// Cross-domain Identity references remain opaque and are represented by
// DeviceIdentityPublicId.
//
// -----------------------------------------------------------------------------
//
// Persistence uniqueness:
//
// Device
// └── @@unique([identityPublicId, fingerprint])
//
// Therefore:
//
//     fingerprint
//          │
//          └── is NOT globally unique
//
//     identityPublicId + fingerprint
//          │
//          └── is the unique Device identity
//
// This repository therefore requires both Identity public ID and fingerprint
// when performing fingerprint-based retrieval.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundary:
//
// DeviceAggregate
// └── DeviceEntity
//
// The repository persists and rehydrates the aggregate as a whole.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { DeviceAggregate } from '../aggregates/device.aggregate';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { DevicePublicId } from '../value-objects/device-public-id.vo';

import type { DeviceIdentityPublicId } from '../value-objects/device-identity-public-id.vo';

import type { DeviceFingerprint } from '../value-objects/device-fingerprint.vo';

// =============================================================================
// Repository
// =============================================================================

/**
 * Persistence port for the Device aggregate.
 *
 * Implementations belong to the infrastructure layer.
 *
 * The repository operates exclusively at the Device aggregate boundary.
 */
export interface DeviceRepository {
  // ===========================================================================

  // Persistence

  // ===========================================================================

  /**
   * Persists a Device aggregate.
   *
   * Implementations must perform an insert or update according to their
   * persistence strategy.
   */
  save(device: DeviceAggregate): Promise<void>;

  /**
   * Deletes a Device aggregate.
   *
   * Deletion policy belongs to the application/domain workflow.
   */
  delete(device: DeviceAggregate): Promise<void>;

  // ===========================================================================

  // Retrieval — Public Identifier

  // ===========================================================================

  /**
   * Retrieves a Device aggregate by its public identifier.
   *
   * Returns undefined when no Device exists with the supplied public ID.
   */
  findByPublicId(
    publicId: DevicePublicId,
  ): Promise<DeviceAggregate | undefined>;

  /**
   * Retrieves a Device aggregate by its public identifier.
   *
   * Throws when the Device does not exist.
   *
   * This method is useful when absence represents an application-level
   * not-found condition.
   */
  getByPublicId(publicId: DevicePublicId): Promise<DeviceAggregate>;

  // ===========================================================================

  // Retrieval — Internal Identifier

  // ===========================================================================

  /**
   * Retrieves a Device aggregate by its internal persistence identifier.
   *
   * The internal identifier is a persistence concern.
   */
  findById(id: string): Promise<DeviceAggregate | undefined>;

  // ===========================================================================

  // Retrieval — Identity Ownership

  // ===========================================================================

  /**
   * Retrieves all Devices belonging to an Identity.
   *
   * The Identity reference remains opaque.
   *
   * Returns an empty array when the Identity has no Devices.
   */
  findByIdentityPublicId(
    identityPublicId: DeviceIdentityPublicId,
  ): Promise<DeviceAggregate[]>;

  /**
   * Retrieves all active Devices belonging to an Identity.
   *
   * Active-state filtering is performed at the persistence/query boundary.
   *
   * Returns an empty array when the Identity has no active Devices.
   */
  findActiveByIdentityPublicId(
    identityPublicId: DeviceIdentityPublicId,
  ): Promise<DeviceAggregate[]>;

  /**
   * Determines whether at least one Device belongs to an Identity.
   */
  existsByIdentityPublicId(
    identityPublicId: DeviceIdentityPublicId,
  ): Promise<boolean>;

  // ===========================================================================

  // Retrieval — Device Recognition

  // ===========================================================================

  /**
   * Retrieves a Device by Identity and stable fingerprint.
   *
   * Fingerprint is unique within an Identity.
   *
   * The repository does not generate, normalize, or interpret fingerprints.
   */
  findByIdentityPublicIdAndFingerprint(
    identityPublicId: DeviceIdentityPublicId,
    fingerprint: DeviceFingerprint,
  ): Promise<DeviceAggregate | undefined>;

  /**
   * Determines whether a Device exists for an Identity with the supplied
   * fingerprint.
   */
  existsByIdentityPublicIdAndFingerprint(
    identityPublicId: DeviceIdentityPublicId,
    fingerprint: DeviceFingerprint,
  ): Promise<boolean>;

  // ===========================================================================

  // Existence — Public Identifier

  // ===========================================================================

  /**
   * Determines whether a Device exists with the supplied public identifier.
   */
  existsByPublicId(publicId: DevicePublicId): Promise<boolean>;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default DeviceRepository;
