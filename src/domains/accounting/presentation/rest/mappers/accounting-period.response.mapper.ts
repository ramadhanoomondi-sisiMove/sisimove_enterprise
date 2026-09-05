// -----------------------------------------------------------------------------
// Accounting — Period Response Mapper
// -----------------------------------------------------------------------------
//
// Maps the AccountingPeriodAggregate / AccountingPeriodEntity domain model
// into an application-facing AccountingPeriodResponse.
//
// Aggregate:
//
// AccountingPeriodAggregate
// └── AccountingPeriodEntity
//
// Mapping principles:
//
// - Expose Accounting Period-safe state.
// - Serialize value objects into primitives.
// - Expose the Accounting Period public identity.
// - Expose Accounting Period name.
// - Expose period boundaries.
// - Expose Accounting Period lifecycle status.
// - Expose lifecycle predicates.
// - Expose period usability.
// - Expose journal-acceptance capability.
// - Expose closing timestamp when available.
// - Expose audit timestamps.
// - Do not expose internal persistence identifiers.
// - Do not expose domain entities.
// - Do not expose value objects directly.
// - Do not access Prisma.
// - Do not access persistence models.
// - Do not resolve related aggregates.
// - Do not evaluate authorization.
// - Do not perform business validation.
// - Do not mutate the aggregate.
// - Do not emit domain events.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Map AccountingPeriodAggregate -> AccountingPeriodResponse.
// - Map AccountingPeriodEntity -> AccountingPeriodResponse.
// - Provide one canonical Accounting Period mapping implementation.
// - Convert Accounting Period value objects into primitive response values.
// - Expose lifecycle-safe predicates.
// - Return defensive Date instances.
//
// -----------------------------------------------------------------------------
//
// This mapper does NOT:
//
// - Mutate the Accounting Period aggregate.
// - Persist the Accounting Period.
// - Access Prisma.
// - Access repositories.
// - Resolve journals.
// - Resolve other aggregates.
// - Perform authorization.
// - Perform business validation.
// - Emit domain events.
// - Change Accounting Period lifecycle state.
//
// -----------------------------------------------------------------------------
//
// Identity:
//
// publicId is the externally safe Accounting Period identifier.
//
// The internal entity identity (`id`) is intentionally excluded.
//
// -----------------------------------------------------------------------------
//
// Period Boundaries:
//
// startsAt and endsAt are exposed as defensive Date instances.
//
// The mapper does not determine whether another Accounting Period overlaps
// this period. Overlap validation belongs to the appropriate domain/application
// workflow.
//
// -----------------------------------------------------------------------------
//
// Lifecycle:
//
// The mapper exposes:
//
// - status;
// - isOpen;
// - isClosed;
// - isUsable;
// - canBeModified;
// - canBeClosed;
// - canAcceptJournals.
//
// These values are read-only projections of the entity's existing domain
// predicates.
//
// -----------------------------------------------------------------------------
//
// Closing:
//
// closedAt is exposed only when the Accounting Period has been closed.
//
// A closed Accounting Period is terminal and cannot be reopened.
//
// -----------------------------------------------------------------------------
//
// Dates:
//
// Date values are returned as defensive copies so callers cannot mutate the
// domain entity's Date instances through the response object.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { AccountingPeriodAggregate } from '../../../domain/aggregates/accounting-period.aggregate';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { AccountingPeriodEntity } from '../../../domain/entities/accounting-period.entity';

// =============================================================================
// Response
// =============================================================================

export interface AccountingPeriodResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Accounting Period aggregate.
   *
   * This is the externally safe Accounting Period identifier.
   */
  publicId: string;

  // ---------------------------------------------------------------------------
  // Period
  // ---------------------------------------------------------------------------

  /**
   * Human-readable Accounting Period name.
   */
  name: string;

  /**
   * Timestamp at which the Accounting Period begins.
   */
  startsAt: Date;

  /**
   * Timestamp at which the Accounting Period ends.
   */
  endsAt: Date;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Current Accounting Period lifecycle status.
   *
   * Examples:
   *
   * - OPEN
   * - CLOSED
   */
  status: string;

  /**
   * Indicates whether the Accounting Period is open.
   */
  isOpen: boolean;

  /**
   * Indicates whether the Accounting Period is closed.
   */
  isClosed: boolean;

  /**
   * Indicates whether the Accounting Period is currently usable.
   *
   * Only OPEN periods are usable.
   */
  isUsable: boolean;

  // ---------------------------------------------------------------------------
  // Lifecycle Capability
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether the Accounting Period can still be modified.
   */
  canBeModified: boolean;

  /**
   * Indicates whether the Accounting Period can be closed.
   */
  canBeClosed: boolean;

  /**
   * Indicates whether the Accounting Period can accept new accounting
   * journals.
   */
  canAcceptJournals: boolean;

  // ---------------------------------------------------------------------------
  // Closing
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the Accounting Period was closed.
   *
   * Undefined while the period remains open.
   */
  closedAt?: Date;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the Accounting Period was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the Accounting Period was last updated.
   */
  updatedAt: Date;
}

// =============================================================================
// Mapper
// =============================================================================

export class AccountingPeriodResponseMapper {
  // ===========================================================================
  // Aggregate -> Response
  // ===========================================================================

  /**
   * Maps an AccountingPeriodAggregate into an
   * AccountingPeriodResponse.
   *
   * This is the canonical aggregate-to-response mapping entry point.
   */
  public static toResponse(
    aggregate: AccountingPeriodAggregate,
  ): AccountingPeriodResponse {
    if (aggregate === undefined) {
      throw new Error('Accounting Period aggregate is required.');
    }

    return this.mapPeriod(aggregate.period);
  }

  // ===========================================================================
  // Entity -> Response
  // ===========================================================================

  /**
   * Maps an AccountingPeriodEntity directly into an
   * AccountingPeriodResponse.
   *
   * Useful for application/read workflows where the aggregate wrapper is not
   * required by the caller.
   */
  public static fromEntity(
    period: AccountingPeriodEntity,
  ): AccountingPeriodResponse {
    if (period === undefined) {
      throw new Error('Accounting Period entity is required.');
    }

    return this.mapPeriod(period);
  }

  // ===========================================================================
  // Internal Period Mapping
  // ===========================================================================

  /**
   * Maps the AccountingPeriodEntity portion of the Accounting Period
   * aggregate.
   *
   * This is the single canonical implementation used by both:
   *
   * - toResponse();
   * - fromEntity();
   *
   * Keeping the mapping centralized prevents aggregate and entity response
   * paths from drifting apart.
   */
  private static mapPeriod(
    period: AccountingPeriodEntity,
  ): AccountingPeriodResponse {
    const closedAt = period.closedAt;

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: period.publicId.value,

      // -----------------------------------------------------------------------
      // Period
      // -----------------------------------------------------------------------

      name: period.name.value,

      startsAt: new Date(period.startsAt.getTime()),

      endsAt: new Date(period.endsAt.getTime()),

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: period.status.value,

      isOpen: period.isOpen(),

      isClosed: period.isClosed(),

      isUsable: period.isUsable(),

      // -----------------------------------------------------------------------
      // Lifecycle Capability
      // -----------------------------------------------------------------------

      canBeModified: period.canBeModified(),

      canBeClosed: period.canBeClosed(),

      canAcceptJournals: period.canAcceptJournals(),

      // -----------------------------------------------------------------------
      // Closing
      // -----------------------------------------------------------------------

      ...(closedAt !== undefined
        ? {
            closedAt: new Date(closedAt.getTime()),
          }
        : {}),

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(period.createdAt.getTime()),

      updatedAt: new Date(period.updatedAt.getTime()),
    };
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default AccountingPeriodResponseMapper;
