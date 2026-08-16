// -----------------------------------------------------------------------------
// Trust Badge Repository
// -----------------------------------------------------------------------------

import type { TrustBadgeAggregate } from '../aggregates/trust-badge.aggregate';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { TrustBadgeEntity } from '../entities/trust-badge.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { TrustBadgeId } from '../value-objects/trust-badge-id.vo';
import type { TrustBadgeName } from '../value-objects/trust-badge-name.vo';
import type { TrustBadgeTypeValueObject } from '../value-objects/trust-badge-type.vo';
import type { AssetPublicId } from '../value-objects/asset-public-id.vo';

/**
 * Repository abstraction for the Trust Badge aggregate.
 *
 * The domain layer depends only on this contract.
 * Infrastructure is responsible for implementing persistence.
 *
 * Aggregate boundary:
 *
 * TrustBadgeAggregate
 * └── TrustBadgeEntity
 *
 * TrustProfileBadgeEntity is intentionally NOT owned by this repository.
 * It belongs to the TrustProfileAggregate because the badge award lifecycle
 * is part of the Trust Profile aggregate boundary.
 */
export interface TrustBadgeRepository {
  // ===========================================================================
  // Aggregate Persistence
  // ===========================================================================

  /**
   * Persist a Trust Badge aggregate.
   */
  save(aggregate: TrustBadgeAggregate): Promise<void>;

  /**
   * Find a Trust Badge aggregate by its internal domain identifier.
   */
  findById(id: TrustBadgeId): Promise<TrustBadgeAggregate | null>;

  /**
   * Find a Trust Badge aggregate by its public identifier.
   */
  findByPublicId(publicId: TrustBadgeId): Promise<TrustBadgeAggregate | null>;

  /**
   * Delete a Trust Badge aggregate.
   *
   * Deletion semantics are determined by the application/domain lifecycle.
   */
  delete(id: TrustBadgeId): Promise<void>;

  /**
   * Determine whether a Trust Badge exists.
   */
  exists(id: TrustBadgeId): Promise<boolean>;

  /**
   * Determine whether a Trust Badge exists by public identifier.
   */
  existsByPublicId(publicId: TrustBadgeId): Promise<boolean>;

  // ===========================================================================
  // Badge Queries
  // ===========================================================================

  /**
   * Find only the Trust Badge entity by internal identifier.
   */
  findBadgeById(id: TrustBadgeId): Promise<TrustBadgeEntity | null>;

  /**
   * Find only the Trust Badge entity by public identifier.
   */
  findBadgeByPublicId(publicId: TrustBadgeId): Promise<TrustBadgeEntity | null>;

  /**
   * Find a badge by its unique type.
   *
   * TrustBadge.type is unique in the Prisma model.
   */
  findByType(
    type: TrustBadgeTypeValueObject,
  ): Promise<TrustBadgeAggregate | null>;

  /**
   * Find only the badge entity by type.
   */
  findBadgeByType(
    type: TrustBadgeTypeValueObject,
  ): Promise<TrustBadgeEntity | null>;

  /**
   * Find a badge by name.
   */
  findByName(name: TrustBadgeName): Promise<TrustBadgeAggregate | null>;

  /**
   * Find only the badge entity by name.
   */
  findBadgeByName(name: TrustBadgeName): Promise<TrustBadgeEntity | null>;

  /**
   * Find all Trust Badges.
   */
  findAll(): Promise<TrustBadgeEntity[]>;

  /**
   * Find all active Trust Badges.
   */
  findActive(): Promise<TrustBadgeEntity[]>;

  /**
   * Find all inactive Trust Badges.
   */
  findInactive(): Promise<TrustBadgeEntity[]>;

  /**
   * Find all badges using a particular Asset.
   */
  findByAssetPublicId(
    assetPublicId: AssetPublicId,
  ): Promise<TrustBadgeEntity[]>;

  // ===========================================================================
  // Existence Queries
  // ===========================================================================

  /**
   * Determine whether a badge type is already registered.
   */
  existsByType(type: TrustBadgeTypeValueObject): Promise<boolean>;

  /**
   * Determine whether a badge name is already registered.
   */
  existsByName(name: TrustBadgeName): Promise<boolean>;

  /**
   * Determine whether a badge references an Asset.
   */
  existsByAssetPublicId(assetPublicId: AssetPublicId): Promise<boolean>;
}
