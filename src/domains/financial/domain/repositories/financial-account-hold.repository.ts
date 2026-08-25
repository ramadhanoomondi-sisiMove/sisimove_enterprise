// src/domains/financial/domain/repositories/financial-account-hold.repository.ts

// -----------------------------------------------------------------------------
// Financial Account Hold Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Financial Account Hold aggregate.
//
// Aggregate ownership:
//
// FinancialAccountHoldAggregate
// └── FinancialAccountHoldEntity
//
// Responsibilities:
// - Persist Financial Account Hold aggregates.
// - Retrieve Financial Account Hold aggregates.
// - Support hold identity lookup.
// - Support Financial Account ownership lookup.
// - Support business-reference lookup.
// - Support lifecycle-status lookup.
// - Support expiry/active-hold lookup.
// - Support hold transaction lookup.
// - Support release transaction lookup.
// - Support capture transaction lookup.
// - Support existence checks.
//
// This interface belongs entirely to the Financial domain.
//
// It does NOT:
// - Depend on Prisma.
// - Depend on ORM models.
// - Depend on database implementations.
// - Execute Financial Transactions.
// - Modify Financial Account balances.
// - Create or execute RELEASE transactions.
// - Create or execute CAPTURE transactions.
// - Move money.
// - Communicate with external providers.
//
// Cross-aggregate references are represented through opaque public IDs where
// possible. Internal UniqueEntityId queries are retained for persistence-
// oriented infrastructure workflows.
//
// Lifecycle:
//
//     ACTIVE
//        │
//        ├── RELEASED
//        ├── CAPTURED
//        └── CANCELLED
//
// RELEASED, CAPTURED and CANCELLED are terminal states.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { FinancialAccountHoldAggregate } from '../aggregates/financial-account-hold.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { FinancialAccountHoldEntity } from '../entities/financial-account-hold.entity';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { FinancialAccountPublicId } from '../value-objects/financial-account-public-id.vo';

import type { FinancialAccountHoldPublicId } from '../value-objects/financial-account-hold-public-id.vo';

import type { FinancialAccountHoldStatus } from '../value-objects/financial-account-hold-status.vo';

import type { FinancialHoldReference } from '../value-objects/financial-hold-reference.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

export interface FinancialAccountHoldRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a Financial Account Hold aggregate.
   *
   * The repository implementation is responsible for translating the
   * aggregate into its persistence representation.
   *
   * The repository does not execute financial movement.
   */
  save(aggregate: FinancialAccountHoldAggregate): Promise<void>;

  /**
   * Removes a Financial Account Hold aggregate.
   *
   * Physical deletion is an infrastructure concern and must not be used to
   * represent normal Financial Account Hold lifecycle transitions.
   */
  delete(aggregate: FinancialAccountHoldAggregate): Promise<void>;

  // ===========================================================================
  // Aggregate Queries
  // ===========================================================================

  /**
   * Finds a Financial Account Hold aggregate by its public identifier.
   */
  findByPublicId(
    publicId: FinancialAccountHoldPublicId,
  ): Promise<FinancialAccountHoldAggregate | null>;

  /**
   * Finds all Financial Account Hold aggregates belonging to a
   * Financial Account.
   *
   * Uses the Financial Account public identifier because the Financial
   * Account is a separate aggregate.
   */
  findByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialAccountHoldAggregate[]>;

  /**
   * Finds all ACTIVE Financial Account Hold aggregates belonging to a
   * Financial Account.
   *
   * Only currently ACTIVE lifecycle state is considered here.
   *
   * Expiry-sensitive workflows should additionally evaluate the hold's
   * expiry through aggregate/domain behavior.
   */
  findActiveByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialAccountHoldAggregate[]>;

  /**
   * Finds all terminal Financial Account Holds belonging to a
   * Financial Account.
   *
   * Terminal states are:
   *
   * - RELEASED
   * - CAPTURED
   * - CANCELLED
   */
  findTerminalByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialAccountHoldAggregate[]>;

  /**
   * Finds Financial Account Holds belonging to a Financial Account
   * with the supplied lifecycle status.
   */
  findByAccountPublicIdAndStatus(
    accountPublicId: FinancialAccountPublicId,
    status: FinancialAccountHoldStatus,
  ): Promise<FinancialAccountHoldAggregate[]>;

  /**
   * Finds all Financial Account Holds with the supplied lifecycle status.
   *
   * Useful for operational, reconciliation, and administrative workflows.
   */
  findByStatus(
    status: FinancialAccountHoldStatus,
  ): Promise<FinancialAccountHoldAggregate[]>;

  // ===========================================================================
  // Business Reference Queries
  // ===========================================================================

  /**
   * Finds all Financial Account Holds associated with a business reference.
   *
   * The reference is opaque to the Financial Account Hold repository.
   */
  findByReference(
    reference: FinancialHoldReference,
  ): Promise<FinancialAccountHoldAggregate[]>;

  /**
   * Finds all Financial Account Holds associated with a business reference
   * type and public identifier.
   *
   * This is useful when reconstructing holds belonging to another domain
   * aggregate without embedding that aggregate inside the Financial domain.
   */
  findByReferenceTypeAndPublicId(
    type: string,
    publicId: string,
  ): Promise<FinancialAccountHoldAggregate[]>;

  /**
   * Finds all ACTIVE Financial Account Holds associated with a business
   * reference.
   */
  findActiveByReference(
    reference: FinancialHoldReference,
  ): Promise<FinancialAccountHoldAggregate[]>;

  /**
   * Finds all ACTIVE Financial Account Holds associated with a business
   * reference type and public identifier.
   */
  findActiveByReferenceTypeAndPublicId(
    type: string,
    publicId: string,
  ): Promise<FinancialAccountHoldAggregate[]>;

  // ===========================================================================
  // Expiry Queries
  // ===========================================================================

  /**
   * Finds ACTIVE Financial Account Holds that have an expiry configured.
   *
   * This query is useful for expiry-processing workflows.
   */
  findActiveWithExpiry(): Promise<FinancialAccountHoldAggregate[]>;

  /**
   * Finds ACTIVE Financial Account Holds that have expired at or before
   * the supplied point in time.
   *
   * The persistence implementation should use the persisted expiry value
   * for efficient selection.
   *
   * Domain lifecycle validation remains owned by the entity/aggregate.
   */
  findExpiredActive(at: Date): Promise<FinancialAccountHoldAggregate[]>;

  /**
   * Finds ACTIVE Financial Account Holds that have not yet expired at the
   * supplied point in time.
   */
  findCurrentlyActive(at?: Date): Promise<FinancialAccountHoldAggregate[]>;

  // ===========================================================================
  // Transaction Reference Queries
  // ===========================================================================

  /**
   * Finds the Financial Account Hold established by the supplied
   * Financial Transaction public identifier.
   *
   * A hold-establishing transaction should normally correspond to at most
   * one Financial Account Hold.
   */
  findByHoldTransactionPublicId(
    transactionPublicId: string,
  ): Promise<FinancialAccountHoldAggregate | null>;

  /**
   * Finds the Financial Account Hold resolved by the supplied
   * Financial RELEASE transaction public identifier.
   *
   * This may resolve either:
   *
   * - a normally RELEASED hold; or
   * - a CANCELLED hold whose reserved funds were returned through RELEASE.
   */
  findByReleaseTransactionPublicId(
    transactionPublicId: string,
  ): Promise<FinancialAccountHoldAggregate | null>;

  /**
   * Finds the Financial Account Hold resolved by the supplied
   * Financial CAPTURE transaction public identifier.
   */
  findByCaptureTransactionPublicId(
    transactionPublicId: string,
  ): Promise<FinancialAccountHoldAggregate | null>;

  // ===========================================================================
  // Account + Transaction Queries
  // ===========================================================================

  /**
   * Finds a Financial Account Hold by account and hold-establishing
   * transaction.
   *
   * Provides an ownership-scoped lookup for reconciliation workflows.
   */
  findByAccountPublicIdAndHoldTransactionPublicId(
    accountPublicId: FinancialAccountPublicId,
    transactionPublicId: string,
  ): Promise<FinancialAccountHoldAggregate | null>;

  /**
   * Finds a Financial Account Hold by account and RELEASE transaction.
   */
  findByAccountPublicIdAndReleaseTransactionPublicId(
    accountPublicId: FinancialAccountPublicId,
    transactionPublicId: string,
  ): Promise<FinancialAccountHoldAggregate | null>;

  /**
   * Finds a Financial Account Hold by account and CAPTURE transaction.
   */
  findByAccountPublicIdAndCaptureTransactionPublicId(
    accountPublicId: FinancialAccountPublicId,
    transactionPublicId: string,
  ): Promise<FinancialAccountHoldAggregate | null>;

  // ===========================================================================
  // Entity Queries
  // ===========================================================================

  /**
   * Finds a Financial Account Hold entity by its public identifier.
   *
   * Returns the aggregate root entity without wrapping it in the aggregate.
   *
   * Primarily useful for persistence-oriented and infrastructure workflows.
   */
  findEntityByPublicId(
    publicId: FinancialAccountHoldPublicId,
  ): Promise<FinancialAccountHoldEntity | null>;

  /**
   * Finds a Financial Account Hold entity by its internal identifier.
   *
   * Primarily intended for persistence-oriented infrastructure workflows.
   */
  findEntityById(
    id: UniqueEntityId,
  ): Promise<FinancialAccountHoldEntity | null>;

  /**
   * Finds all Financial Account Hold entities belonging to a Financial
   * Account using its internal identifier.
   *
   * Primarily intended for persistence and infrastructure workflows.
   */
  findEntityByAccountId(
    accountId: UniqueEntityId,
  ): Promise<FinancialAccountHoldEntity[]>;

  // ===========================================================================
  // Entity Status Queries
  // ===========================================================================

  /**
   * Finds all Financial Account Hold entities with the supplied lifecycle
   * status.
   *
   * Primarily intended for persistence-oriented infrastructure workflows.
   */
  findEntitiesByStatus(
    status: FinancialAccountHoldStatus,
  ): Promise<FinancialAccountHoldEntity[]>;

  /**
   * Finds all ACTIVE Financial Account Hold entities belonging to a
   * Financial Account.
   *
   * Primarily intended for infrastructure workflows.
   */
  findEntitiesByAccountIdAndStatus(
    accountId: UniqueEntityId,
    status: FinancialAccountHoldStatus,
  ): Promise<FinancialAccountHoldEntity[]>;

  // ===========================================================================
  // Availability / Lifecycle Queries
  // ===========================================================================

  /**
   * Finds all ACTIVE Financial Account Hold aggregates.
   *
   * Useful for operational and reconciliation workflows.
   */
  findActive(): Promise<FinancialAccountHoldAggregate[]>;

  /**
   * Finds all RELEASED Financial Account Hold aggregates.
   */
  findReleased(): Promise<FinancialAccountHoldAggregate[]>;

  /**
   * Finds all CAPTURED Financial Account Hold aggregates.
   */
  findCaptured(): Promise<FinancialAccountHoldAggregate[]>;

  /**
   * Finds all CANCELLED Financial Account Hold aggregates.
   */
  findCancelled(): Promise<FinancialAccountHoldAggregate[]>;

  /**
   * Finds all terminal Financial Account Hold aggregates.
   *
   * Terminal states:
   *
   * - RELEASED
   * - CAPTURED
   * - CANCELLED
   */
  findTerminal(): Promise<FinancialAccountHoldAggregate[]>;

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Returns true if a Financial Account Hold exists for the supplied
   * public identifier.
   */
  existsByPublicId(publicId: FinancialAccountHoldPublicId): Promise<boolean>;

  /**
   * Returns true if a Financial Account Hold exists for the supplied
   * internal identifier.
   */
  existsById(id: UniqueEntityId): Promise<boolean>;

  /**
   * Returns true if any Financial Account Hold exists for the supplied
   * Financial Account.
   */
  existsByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if an ACTIVE Financial Account Hold exists for the
   * supplied Financial Account.
   */
  existsActiveByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if a Financial Account Hold exists for the supplied
   * hold-establishing transaction.
   */
  existsByHoldTransactionPublicId(
    transactionPublicId: string,
  ): Promise<boolean>;

  /**
   * Returns true if a Financial Account Hold exists for the supplied
   * RELEASE transaction.
   */
  existsByReleaseTransactionPublicId(
    transactionPublicId: string,
  ): Promise<boolean>;

  /**
   * Returns true if a Financial Account Hold exists for the supplied
   * CAPTURE transaction.
   */
  existsByCaptureTransactionPublicId(
    transactionPublicId: string,
  ): Promise<boolean>;

  /**
   * Returns true if an ACTIVE Financial Account Hold exists for the
   * supplied business reference.
   */
  existsActiveByReference(reference: FinancialHoldReference): Promise<boolean>;

  /**
   * Returns true if an ACTIVE Financial Account Hold exists for the
   * supplied business reference type and public identifier.
   */
  existsActiveByReferenceTypeAndPublicId(
    type: string,
    publicId: string,
  ): Promise<boolean>;
}
