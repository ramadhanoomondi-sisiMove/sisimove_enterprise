// -----------------------------------------------------------------------------
// Commercial Commission Rule Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Commercial Commission Rule aggregate.
//
// Aggregate boundary:
//
//   CommercialCommissionRuleAggregate
//              │
//              └── CommercialCommissionRuleEntity
//
// This repository is responsible for:
//
// - persisting the Commercial Commission Rule aggregate;
// - removing the aggregate where permitted;
// - rehydrating the aggregate;
// - resolving rules by public identity;
// - resolving rules by commission type and version;
// - resolving rules by commission type;
// - resolving all rules;
// - resolving effective/active rules;
// - supporting effective-period integrity checks;
// - supporting existence checks.
//
// The repository belongs to the Commercial domain layer.
//
// It intentionally contains NO infrastructure concerns:
//
// - no Prisma;
// - no database client;
// - no SQL;
// - no persistence DTOs;
// - no ORM models.
//
// Infrastructure implementations are responsible for translating between
// persistence models and this domain aggregate.
//
// There is intentionally no parent CommercialAggregate.
//
// Commercial Commission Rule is an independent aggregate root.
// Booking Commission and Earning Commission are separate aggregate roots.
//
// Cross-rule concerns such as effective-period overlap require repository
// queries because they cannot be enforced by a single rule entity in
// isolation.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { CommercialCommissionRuleAggregate } from '../aggregates/commercial-commission-rule.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { CommercialCommissionRuleEntity } from '../entities/commercial-commission-rule.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { CommercialCommissionRulePublicId } from '../value-objects/commercial-commission-rule-public-id.vo';

import type { CommercialCommissionType } from '../value-objects/commercial-commission-type.vo';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

export interface CommercialCommissionRuleRepository {
  // ---------------------------------------------------------------------------
  // Persistence
  // ---------------------------------------------------------------------------

  /**
   * Persists a Commercial Commission Rule aggregate.
   *
   * The implementation must persist the complete aggregate state represented
   * by the owned CommercialCommissionRuleEntity.
   */
  save(aggregate: CommercialCommissionRuleAggregate): Promise<void>;

  /**
   * Removes a Commercial Commission Rule aggregate.
   *
   * Deletion policy is determined by the application and infrastructure
   * layers. The domain repository only defines the persistence contract.
   */
  delete(aggregate: CommercialCommissionRuleAggregate): Promise<void>;

  // ---------------------------------------------------------------------------
  // Aggregate Queries
  // ---------------------------------------------------------------------------

  /**
   * Finds all Commercial Commission Rule aggregates.
   *
   * Implementations should return rules in a deterministic order. The
   * recommended default ordering is commission type followed by version
   * descending.
   */
  findAll(): Promise<CommercialCommissionRuleAggregate[]>;

  /**
   * Finds a Commercial Commission Rule aggregate by its public identifier.
   *
   * Returns null when no rule exists for the supplied public identifier.
   */
  findByPublicId(
    publicId: CommercialCommissionRulePublicId,
  ): Promise<CommercialCommissionRuleAggregate | null>;

  /**
   * Finds a Commercial Commission Rule aggregate by commission type and
   * version.
   *
   * The combination of commission type and version uniquely identifies a
   * commercial commission policy version.
   */
  findByTypeAndVersion(
    type: CommercialCommissionType,
    version: number,
  ): Promise<CommercialCommissionRuleAggregate | null>;

  /**
   * Finds all Commercial Commission Rule aggregates belonging to a specific
   * commission type.
   *
   * Implementations should return rules ordered by version descending unless
   * the infrastructure contract specifies another deterministic ordering.
   */
  findByType(
    type: CommercialCommissionType,
  ): Promise<CommercialCommissionRuleAggregate[]>;

  /**
   * Finds the single Commercial Commission Rule that is active and effective
   * at the supplied timestamp.
   *
   * This method is intended for commission assessment and rule selection.
   *
   * The implementation must consider:
   *
   * - commission type;
   * - ACTIVE lifecycle status;
   * - effectiveFrom;
   * - effectiveTo.
   *
   * The effective-period integrity policy guarantees that conflicting rules
   * of the same commission type do not overlap, so a valid query should
   * resolve to at most one applicable rule.
   */
  findEffectiveRule(
    type: CommercialCommissionType,
    at: Date,
  ): Promise<CommercialCommissionRuleAggregate | null>;

  /**
   * Finds the currently active Commercial Commission Rule for a commission
   * type.
   *
   * This query is useful for retrieving the presently configured commercial
   * policy independently of a historical assessment timestamp.
   *
   * At most one active rule should exist for a commission type under the
   * Commercial Commission Rule lifecycle and effective-period policies.
   */
  findActiveRule(
    type: CommercialCommissionType,
  ): Promise<CommercialCommissionRuleAggregate | null>;

  // ---------------------------------------------------------------------------
  // Entity Queries
  // ---------------------------------------------------------------------------

  /**
   * Finds a Commercial Commission Rule entity by its public identifier.
   *
   * This method is provided for application workflows that require the domain
   * entity without wrapping it in an aggregate.
   *
   * The aggregate-oriented methods above should be preferred when aggregate
   * behavior or lifecycle operations are required.
   */
  findEntityByPublicId(
    publicId: CommercialCommissionRulePublicId,
  ): Promise<CommercialCommissionRuleEntity | null>;

  /**
   * Finds a Commercial Commission Rule entity by commission type and version.
   *
   * This is useful for persistence and application workflows that require the
   * entity representation directly.
   */
  findEntityByTypeAndVersion(
    type: CommercialCommissionType,
    version: number,
  ): Promise<CommercialCommissionRuleEntity | null>;

  /**
   * Finds the active and effective Commercial Commission Rule entity at the
   * supplied timestamp.
   */
  findEffectiveRuleEntity(
    type: CommercialCommissionType,
    at: Date,
  ): Promise<CommercialCommissionRuleEntity | null>;

  // ---------------------------------------------------------------------------
  // Existence
  // ---------------------------------------------------------------------------

  /**
   * Determines whether a Commercial Commission Rule exists for the supplied
   * public identifier.
   */
  existsByPublicId(
    publicId: CommercialCommissionRulePublicId,
  ): Promise<boolean>;

  /**
   * Determines whether a Commercial Commission Rule exists for the supplied
   * commission type and version.
   *
   * This supports the unique policy-version invariant represented by:
   *
   *   @@unique([type, version])
   */
  existsByTypeAndVersion(
    type: CommercialCommissionType,
    version: number,
  ): Promise<boolean>;

  // ---------------------------------------------------------------------------
  // Effective-Period Integrity
  // ---------------------------------------------------------------------------

  /**
   * Determines whether another Commercial Commission Rule overlaps the
   * supplied effective period for the same commission type.
   *
   * This query supports the domain invariant that conflicting commission
   * policies for the same commission type must not have overlapping effective
   * periods.
   *
   * Both effective-period boundaries are inclusive, matching the domain
   * entity's isEffectiveAt() behavior.
   *
   * An undefined effectiveTo represents an open-ended period.
   *
   * When updating an existing rule, excludePublicId should be supplied so that
   * the rule does not detect its own effective period as an overlap.
   */
  hasOverlappingEffectivePeriod(
    type: CommercialCommissionType,
    effectiveFrom: Date,
    effectiveTo: Date | undefined,
    excludePublicId?: CommercialCommissionRulePublicId,
  ): Promise<boolean>;
}
