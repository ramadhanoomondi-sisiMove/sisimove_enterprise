// -----------------------------------------------------------------------------
// Accounting Period — Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Accounting Period aggregate.
//
// Aggregate ownership:
//
// AccountingPeriodAggregate
// └── AccountingPeriodEntity
//
// Responsibilities:
//
// - persist Accounting Period aggregates;
// - retrieve Accounting Period aggregates;
// - retrieve Accounting Period entities when explicitly required;
// - query periods by identity;
// - query periods by name;
// - query periods by lifecycle status;
// - query periods by usability and journal-acceptance capability;
// - query periods by date boundaries;
// - query periods by audit timestamps;
// - provide existence checks.
//
// The repository is persistence-technology agnostic.
//
// It MUST NOT:
//
// - depend on Prisma or any ORM;
// - expose persistence models;
// - create or modify AccountingPeriodEntity instances directly;
// - enforce application authorization;
// - validate other aggregates;
// - load AccountingJournal aggregates as part of period validation;
// - decide whether journals may be posted;
// - calculate accounting balances;
// - record domain events;
// - publish domain events;
// - communicate with external systems.
//
// Aggregate boundaries:
//
// AccountingPeriodAggregate owns exactly one AccountingPeriodEntity.
//
// Cross-aggregate references are represented by opaque identifiers.
// Validation involving AccountingJournal or other aggregates belongs to the
// application/domain workflow, not this repository contract.
//
// Persistence uniqueness is expected to be enforced by the persistence layer
// according to the accounting schema.
//
// -----------------------------------------------------------------------------
//
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Accounting — Aggregate
// -----------------------------------------------------------------------------

import type { AccountingPeriodAggregate } from '../aggregates/accounting-period.aggregate';

// -----------------------------------------------------------------------------
// Accounting — Entity
// -----------------------------------------------------------------------------

import type { AccountingPeriodEntity } from '../entities/accounting-period.entity';

// -----------------------------------------------------------------------------
// Accounting — Value Objects
// -----------------------------------------------------------------------------

import type { AccountingPeriodName } from '../value-objects/accounting-period-name.vo';
import type { AccountingPeriodPublicId } from '../value-objects/accounting-period-public-id.vo';
import type { AccountingPeriodStatus } from '../value-objects/accounting-period-status.vo';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

/**
 * Repository contract for the Accounting Period aggregate.
 *
 * Implementations belong to the infrastructure layer.
 *
 * The domain layer depends only on this contract and remains independent
 * from Prisma, SQL, persistence schemas, and other infrastructure concerns.
 */
export interface AccountingPeriodRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists an Accounting Period aggregate.
   *
   * The implementation determines whether the operation results in an
   * insert or update.
   */
  save(aggregate: AccountingPeriodAggregate): Promise<void>;

  /**
   * Deletes an Accounting Period aggregate.
   *
   * Business rules governing whether deletion is permitted belong to the
   * application/domain workflow.
   */
  delete(aggregate: AccountingPeriodAggregate): Promise<void>;

  // ===========================================================================
  // Aggregate Queries — Identity
  // ===========================================================================

  /**
   * Finds an Accounting Period aggregate by public identity.
   */
  findByPublicId(
    publicId: AccountingPeriodPublicId,
  ): Promise<AccountingPeriodAggregate | null>;

  /**
   * Finds an Accounting Period aggregate by internal identity.
   */
  findById(id: UniqueEntityId): Promise<AccountingPeriodAggregate | null>;

  // ===========================================================================
  // Aggregate Queries — Natural Attributes
  // ===========================================================================

  /**
   * Finds Accounting Period aggregates by name.
   *
   * Period names are not assumed to be unique.
   */
  findByName(name: AccountingPeriodName): Promise<AccountingPeriodAggregate[]>;

  // ===========================================================================
  // Entity Queries
  // ===========================================================================

  /**
   * Finds the Accounting Period entity by public identity.
   *
   * This should only be used where the entity itself is explicitly required.
   * Aggregate-level behavior should normally use aggregate queries.
   */
  findEntityByPublicId(
    publicId: AccountingPeriodPublicId,
  ): Promise<AccountingPeriodEntity | null>;

  /**
   * Finds the Accounting Period entity by internal identity.
   */
  findEntityById(id: UniqueEntityId): Promise<AccountingPeriodEntity | null>;

  /**
   * Finds Accounting Period entities by name.
   *
   * Period names are not assumed to be unique.
   */
  findEntitiesByName(
    name: AccountingPeriodName,
  ): Promise<AccountingPeriodEntity[]>;

  // ===========================================================================
  // Status Queries
  // ===========================================================================

  /**
   * Finds all OPEN Accounting Period aggregates.
   */
  findOpen(): Promise<AccountingPeriodAggregate[]>;

  /**
   * Finds all CLOSED Accounting Period aggregates.
   */
  findClosed(): Promise<AccountingPeriodAggregate[]>;

  /**
   * Finds Accounting Period aggregates by explicit status.
   */
  findByStatus(
    status: AccountingPeriodStatus,
  ): Promise<AccountingPeriodAggregate[]>;

  /**
   * Finds Accounting Period aggregates that are currently usable.
   *
   * This corresponds to the domain capability exposed by
   * AccountingPeriodAggregate.isUsable().
   */
  findUsable(): Promise<AccountingPeriodAggregate[]>;

  /**
   * Finds Accounting Period aggregates capable of accepting journals.
   *
   * This corresponds to AccountingPeriodAggregate.canAcceptJournals().
   */
  findJournalAccepting(): Promise<AccountingPeriodAggregate[]>;

  /**
   * Finds Accounting Period aggregates that cannot currently accept journals.
   */
  findJournalRejecting(): Promise<AccountingPeriodAggregate[]>;

  // ===========================================================================
  // Date Boundary Queries
  // ===========================================================================

  /**
   * Finds Accounting Period aggregates containing the supplied date.
   *
   * Boundary semantics must match AccountingPeriodEntity.contains().
   */
  findContainingDate(date: Date): Promise<AccountingPeriodAggregate[]>;

  /**
   * Finds the Accounting Period containing the supplied date.
   *
   * Returns null when no matching period exists.
   *
   * If overlapping periods are prohibited by domain/application rules,
   * that invariant should be enforced outside this repository contract.
   */
  findPeriodContainingDate(
    date: Date,
  ): Promise<AccountingPeriodAggregate | null>;

  /**
   * Finds periods beginning after the supplied date.
   */
  findStartingAfter(date: Date): Promise<AccountingPeriodAggregate[]>;

  /**
   * Finds periods beginning before the supplied date.
   */
  findStartingBefore(date: Date): Promise<AccountingPeriodAggregate[]>;

  /**
   * Finds periods ending after the supplied date.
   */
  findEndingAfter(date: Date): Promise<AccountingPeriodAggregate[]>;

  /**
   * Finds periods ending before the supplied date.
   */
  findEndingBefore(date: Date): Promise<AccountingPeriodAggregate[]>;

  /**
   * Finds periods whose boundaries overlap the supplied range.
   */
  findOverlapping(
    startsAt: Date,
    endsAt: Date,
  ): Promise<AccountingPeriodAggregate[]>;

  // ===========================================================================
  // Closure Queries
  // ===========================================================================

  /**
   * Finds periods closed after the supplied timestamp.
   */
  findClosedAfter(closedAfter: Date): Promise<AccountingPeriodAggregate[]>;

  /**
   * Finds periods closed before the supplied timestamp.
   */
  findClosedBefore(closedBefore: Date): Promise<AccountingPeriodAggregate[]>;

  /**
   * Finds periods that have not yet been closed.
   */
  findUnclosed(): Promise<AccountingPeriodAggregate[]>;

  // ===========================================================================
  // Audit Queries
  // ===========================================================================

  /**
   * Finds periods created after the supplied timestamp.
   */
  findCreatedAfter(createdAfter: Date): Promise<AccountingPeriodAggregate[]>;

  /**
   * Finds periods created before the supplied timestamp.
   */
  findCreatedBefore(createdBefore: Date): Promise<AccountingPeriodAggregate[]>;

  /**
   * Finds periods updated after the supplied timestamp.
   */
  findUpdatedAfter(updatedAfter: Date): Promise<AccountingPeriodAggregate[]>;

  /**
   * Finds periods updated before the supplied timestamp.
   */
  findUpdatedBefore(updatedBefore: Date): Promise<AccountingPeriodAggregate[]>;

  /**
   * Finds all periods ordered by start date.
   */
  findAllOrderedByStartsAt(): Promise<AccountingPeriodAggregate[]>;

  /**
   * Finds all periods ordered by end date.
   */
  findAllOrderedByEndsAt(): Promise<AccountingPeriodAggregate[]>;

  /**
   * Finds all periods ordered by creation timestamp.
   */
  findAllOrderedByCreatedAt(): Promise<AccountingPeriodAggregate[]>;

  // ===========================================================================
  // Existence Queries — Identity
  // ===========================================================================

  /**
   * Determines whether a period exists by public identity.
   */
  existsByPublicId(publicId: AccountingPeriodPublicId): Promise<boolean>;

  /**
   * Determines whether a period exists by internal identity.
   */
  existsById(id: UniqueEntityId): Promise<boolean>;

  // ===========================================================================
  // Existence Queries — Natural Attributes
  // ===========================================================================

  /**
   * Determines whether one or more periods exist with the supplied name.
   */
  existsByName(name: AccountingPeriodName): Promise<boolean>;

  // ===========================================================================
  // Existence Queries — Status
  // ===========================================================================

  /**
   * Determines whether any period exists with the supplied status.
   */
  existsByStatus(status: AccountingPeriodStatus): Promise<boolean>;

  /**
   * Determines whether at least one OPEN period exists.
   */
  existsOpen(): Promise<boolean>;

  /**
   * Determines whether at least one CLOSED period exists.
   */
  existsClosed(): Promise<boolean>;

  /**
   * Determines whether at least one usable period exists.
   */
  existsUsable(): Promise<boolean>;

  /**
   * Determines whether at least one period can accept journals.
   */
  existsJournalAccepting(): Promise<boolean>;

  // ===========================================================================
  // Existence Queries — Date Boundaries
  // ===========================================================================

  /**
   * Determines whether a period contains the supplied date.
   */
  existsContainingDate(date: Date): Promise<boolean>;

  /**
   * Determines whether any period overlaps the supplied date range.
   */
  existsOverlapping(startsAt: Date, endsAt: Date): Promise<boolean>;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AccountingPeriodRepository;
