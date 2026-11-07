// -----------------------------------------------------------------------------
// Accounting Calendar — Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Accounting Calendar aggregate.
//
// Aggregate ownership:
//
// AccountingCalendarAggregate
// └── AccountingCalendarEntity
//
// Responsibilities:
//
// - persist Accounting Calendar aggregates;
// - retrieve calendars by identity;
// - retrieve calendars by unique code;
// - query calendars by lifecycle status;
// - provide existence checks.
//
// The repository is persistence-technology agnostic.
//
// It MUST NOT:
//
// - depend on Prisma or any ORM;
// - expose persistence models;
// - generate accounting periods;
// - modify calendar configuration;
// - enforce application authorization;
// - publish domain events;
// - communicate with external systems.
//
// Calendar configuration is immutable after creation.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { AccountingCalendarAggregate } from '../aggregates/accounting-calendar.aggregate';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { AccountingCalendarPublicId } from '../value-objects/accounting-calendar-public-id.vo';
import type { AccountingCalendarCode } from '../value-objects/accounting-calendar-code.vo';
import type { AccountingCalendarStatus } from '../value-objects/accounting-calendar-status.vo';

// =============================================================================
// Repository
// =============================================================================

/**
 * Repository contract for the Accounting Calendar aggregate.
 *
 * Implementations belong to the infrastructure layer.
 *
 * The domain layer remains independent of Prisma, SQL, and persistence schemas.
 */
export interface AccountingCalendarRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists an Accounting Calendar aggregate.
   *
   * The implementation determines whether the operation is an insert or
   * update.
   */
  save(aggregate: AccountingCalendarAggregate): Promise<void>;

  // ===========================================================================
  // Aggregate Queries — Identity
  // ===========================================================================

  /**
   * Finds a calendar by public identity.
   */
  findByPublicId(
    publicId: AccountingCalendarPublicId,
  ): Promise<AccountingCalendarAggregate | null>;

  /**
   * Finds a calendar by internal identity.
   */
  findById(id: UniqueEntityId): Promise<AccountingCalendarAggregate | null>;

  // ===========================================================================
  // Aggregate Queries — Natural Attributes
  // ===========================================================================

  /**
   * Finds a calendar by its unique code.
   */
  findByCode(
    code: AccountingCalendarCode,
  ): Promise<AccountingCalendarAggregate | null>;

  // ===========================================================================
  // Status Queries
  // ===========================================================================

  /**
   * Finds calendars by explicit lifecycle status.
   */
  findByStatus(
    status: AccountingCalendarStatus,
  ): Promise<AccountingCalendarAggregate[]>;

  /**
   * Finds all active calendars.
   */
  findActive(): Promise<AccountingCalendarAggregate[]>;

  /**
   * Finds all inactive calendars.
   */
  findInactive(): Promise<AccountingCalendarAggregate[]>;

  // ===========================================================================
  // Existence Queries
  // ===========================================================================

  /**
   * Determines whether a calendar exists by public identity.
   */
  existsByPublicId(publicId: AccountingCalendarPublicId): Promise<boolean>;

  /**
   * Determines whether a calendar exists by internal identity.
   */
  existsById(id: UniqueEntityId): Promise<boolean>;

  /**
   * Determines whether a calendar exists with the supplied unique code.
   */
  existsByCode(code: AccountingCalendarCode): Promise<boolean>;

  /**
   * Determines whether at least one active calendar exists.
   */
  existsActive(): Promise<boolean>;
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AccountingCalendarRepository;
