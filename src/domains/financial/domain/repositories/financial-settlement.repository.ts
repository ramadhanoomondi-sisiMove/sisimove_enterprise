// -----------------------------------------------------------------------------
// Financial Settlement Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Financial Settlement aggregate.
//
// Aggregate ownership:
//
// FinancialSettlementAggregate
// └── FinancialSettlementEntity
//     └── FinancialSettlementItemEntity[]
//         └── FinancialSettlementAllocationEntity[]
//
// FinancialSettlementEntity remains the aggregate root.
//
// FinancialSettlementItemEntity and FinancialSettlementAllocationEntity are
// internal entities owned by the Financial Settlement aggregate.
//
// Repository boundary:
//
// - FinancialSettlementAggregate is the domain persistence boundary.
// - Child entities are never exposed as independent repository results.
// - Aggregate mutations must occur through the aggregate root.
// - Infrastructure implementations may query child tables internally.
//
// Responsibilities:
//
// - Persist Financial Settlement aggregates.
// - Retrieve Financial Settlement aggregates.
// - Support settlement identity lookup.
// - Support settlement lifecycle queries.
// - Support settlement business-reference queries.
// - Support settlement item lookup through the owning aggregate.
// - Support Financial Account traceability queries.
// - Support Financial Transaction traceability queries.
// - Support processing workflows.
// - Support allocation/completion workflows.
// - Support operational reconciliation workflows.
// - Support existence checks.
//
// This interface belongs entirely to the Financial domain.
//
// It does NOT:
//
// - Depend on Prisma.
// - Depend on ORM models.
// - Depend on database implementations.
// - Execute Financial Transactions.
// - Modify Financial Account balances.
// - Create Financial Transactions.
// - Post Financial Transactions.
// - Execute disbursements.
// - Perform accounting.
// - Communicate with external providers.
// - Move money.
//
// Financial movement belongs to Financial Transactions and the appropriate
// Financial application/integration boundaries.
//
// -----------------------------------------------------------------------------
//
// Settlement lifecycle:
//
//     PENDING
//        │
//        └── PROCESSING
//              │
//              ├── Settlement Item allocation
//              │      PENDING → ALLOCATED
//              │
//              └── Settlement Item settlement
//                     ALLOCATED → SETTLED
//
// Settlement-level ALLOCATED is intentionally NOT a lifecycle state.
//
// Terminal Settlement states:
//
// - COMPLETED
// - FAILED
// - CANCELLED
//
// COMPLETED is valid only after every Settlement Item has reached SETTLED.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { FinancialSettlementAggregate } from '../aggregates/financial-settlement.aggregate';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { Currency } from '../value-objects/currency.vo';

import type { FinancialSettlementPublicId } from '../value-objects/financial-settlement-public-id.vo';

import type { FinancialSettlementStatus } from '../value-objects/financial-settlement-status.vo';

import type { FinancialSettlementItemPublicId } from '../value-objects/financial-settlement-item-public-id.vo';

import type { FinancialReferenceType } from '../value-objects/financial-reference-type.vo';

import type { FinancialReferencePublicId } from '../value-objects/financial-reference-public-id.vo';

import type { FinancialTransactionPublicId } from '../value-objects/financial-transaction-public-id.vo';

// -----------------------------------------------------------------------------
// Financial Account Public ID
// -----------------------------------------------------------------------------
//
// Import the canonical Financial Account public-ID value object when available.
// If the Financial Account bounded model currently exposes only string public
// identifiers at the Financial domain boundary, this may temporarily remain
// string.
//
// -----------------------------------------------------------------------------

import type { FinancialAccountPublicId } from '../value-objects/financial-account-public-id.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

/**
 * Repository contract for the Financial Settlement aggregate.
 *
 * FinancialSettlementAggregate is the complete persistence boundary:
 *
 * FinancialSettlementAggregate
 * └── FinancialSettlementEntity
 *     └── FinancialSettlementItemEntity[]
 *         └── FinancialSettlementAllocationEntity[]
 *
 * Settlement Items and Settlement Allocations are not independent aggregate
 * roots and therefore must not be exposed through independent repository
 * contracts.
 *
 * Infrastructure implementations may query and persist child records as
 * required, but those details remain hidden behind this repository boundary.
 *
 * Domain behavior remains inside:
 *
 * - FinancialSettlementAggregate;
 * - FinancialSettlementEntity;
 * - FinancialSettlementItemEntity;
 * - FinancialSettlementAllocationEntity.
 */
export interface FinancialSettlementRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists the complete Financial Settlement aggregate.
   *
   * The implementation must persist the complete aggregate graph:
   *
   * FinancialSettlementAggregate
   * └── FinancialSettlementEntity
   *     └── FinancialSettlementItemEntity[]
   *         └── FinancialSettlementAllocationEntity[]
   *
   * Persistence must be atomic from the aggregate's perspective.
   *
   * The repository does not execute financial movement.
   */
  save(aggregate: FinancialSettlementAggregate): Promise<void>;

  // ===========================================================================
  // Aggregate Identity Queries
  // ===========================================================================

  /**
   * Finds a Financial Settlement aggregate by public identifier.
   *
   * The returned aggregate must contain the complete aggregate graph.
   */
  findByPublicId(
    publicId: FinancialSettlementPublicId,
  ): Promise<FinancialSettlementAggregate | null>;

  /**
   * Finds a Financial Settlement aggregate by internal identifier.
   *
   * Primarily intended for infrastructure-oriented workflows.
   */
  findById(id: UniqueEntityId): Promise<FinancialSettlementAggregate | null>;

  /**
   * Finds all Financial Settlement aggregates with the supplied lifecycle
   * status.
   */
  findByStatus(
    status: FinancialSettlementStatus,
  ): Promise<FinancialSettlementAggregate[]>;

  /**
   * Finds all Financial Settlement aggregates using the supplied currency.
   *
   * A Financial Settlement is single-currency.
   */
  findByCurrency(currency: Currency): Promise<FinancialSettlementAggregate[]>;

  // ===========================================================================
  // Lifecycle Queries
  // ===========================================================================

  /**
   * Finds all PENDING Financial Settlements.
   */
  findPending(): Promise<FinancialSettlementAggregate[]>;

  /**
   * Finds all PROCESSING Financial Settlements.
   */
  findProcessing(): Promise<FinancialSettlementAggregate[]>;

  /**
   * Finds all COMPLETED Financial Settlements.
   */
  findCompleted(): Promise<FinancialSettlementAggregate[]>;

  /**
   * Finds all FAILED Financial Settlements.
   */
  findFailed(): Promise<FinancialSettlementAggregate[]>;

  /**
   * Finds all CANCELLED Financial Settlements.
   */
  findCancelled(): Promise<FinancialSettlementAggregate[]>;

  /**
   * Finds all terminal Financial Settlements.
   *
   * Terminal states:
   *
   * - COMPLETED;
   * - FAILED;
   * - CANCELLED.
   */
  findTerminal(): Promise<FinancialSettlementAggregate[]>;

  /**
   * Finds all non-terminal Financial Settlements.
   *
   * Non-terminal states:
   *
   * - PENDING;
   * - PROCESSING.
   */
  findNonTerminal(): Promise<FinancialSettlementAggregate[]>;

  // ===========================================================================
  // Processing Queries
  // ===========================================================================

  /**
   * Finds Financial Settlements eligible to begin processing.
   *
   * Persistence filtering is permitted, but the aggregate remains authoritative
   * for final lifecycle validation.
   */
  findReadyForProcessing(): Promise<FinancialSettlementAggregate[]>;

  /**
   * Finds Financial Settlements currently undergoing processing.
   *
   * Useful for:
   *
   * - settlement workers;
   * - reconciliation;
   * - operational monitoring.
   */
  findInProgress(): Promise<FinancialSettlementAggregate[]>;

  /**
   * Finds PROCESSING Financial Settlements containing at least one Settlement
   * Item that has not reached SETTLED.
   */
  findProcessingWithUnsettledItems(): Promise<FinancialSettlementAggregate[]>;

  /**
   * Finds PROCESSING Financial Settlements containing Settlement Items that
   * have reached ALLOCATED state but not yet SETTLED state.
   */
  findProcessingWithAllocatedItems(): Promise<FinancialSettlementAggregate[]>;

  /**
   * Finds PROCESSING Financial Settlements that appear eligible for
   * completion according to persisted state.
   *
   * The aggregate remains authoritative for the final completion decision.
   */
  findReadyForCompletion(): Promise<FinancialSettlementAggregate[]>;

  // ===========================================================================
  // Business Reference Queries
  // ===========================================================================

  /**
   * Finds all Financial Settlements associated with a business reference.
   *
   * Financial intentionally treats the referenced business object as opaque.
   */
  findByReference(
    referenceType: FinancialReferenceType,
    referencePublicId: FinancialReferencePublicId,
  ): Promise<FinancialSettlementAggregate[]>;

  /**
   * Finds active Financial Settlements associated with a business reference.
   *
   * Active states:
   *
   * - PENDING;
   * - PROCESSING.
   */
  findActiveByReference(
    referenceType: FinancialReferenceType,
    referencePublicId: FinancialReferencePublicId,
  ): Promise<FinancialSettlementAggregate[]>;

  /**
   * Finds terminal Financial Settlements associated with a business
   * reference.
   */
  findTerminalByReference(
    referenceType: FinancialReferenceType,
    referencePublicId: FinancialReferencePublicId,
  ): Promise<FinancialSettlementAggregate[]>;

  // ===========================================================================
  // Settlement Item Queries
  // ===========================================================================

  /**
   * Finds the Financial Settlement aggregate containing the supplied
   * Settlement Item public identifier.
   *
   * The returned object is always the owning aggregate, never the child
   * Settlement Item entity by itself.
   */
  findByItemPublicId(
    itemPublicId: FinancialSettlementItemPublicId,
  ): Promise<FinancialSettlementAggregate | null>;

  // ===========================================================================
  // Financial Account Reference Queries
  // ===========================================================================

  /**
   * Finds all Financial Settlements containing Settlement Items associated
   * with the supplied Financial Account.
   *
   * Financial Account remains a separate aggregate.
   */
  findByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialSettlementAggregate[]>;

  /**
   * Finds active Financial Settlements associated with the supplied
   * Financial Account.
   *
   * Active states:
   *
   * - PENDING;
   * - PROCESSING.
   */
  findActiveByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<FinancialSettlementAggregate[]>;

  /**
   * Finds Financial Settlements associated with the supplied Financial
   * Account and lifecycle status.
   */
  findByAccountPublicIdAndStatus(
    accountPublicId: FinancialAccountPublicId,
    status: FinancialSettlementStatus,
  ): Promise<FinancialSettlementAggregate[]>;

  // ===========================================================================
  // Financial Transaction Reference Queries
  // ===========================================================================

  /**
   * Finds a Financial Settlement associated with a Financial Transaction.
   *
   * Intended for transaction-to-settlement traceability and reconciliation.
   */
  findByTransactionPublicId(
    transactionPublicId: FinancialTransactionPublicId,
  ): Promise<FinancialSettlementAggregate | null>;

  /**
   * Finds all Financial Settlements associated with a Financial Transaction.
   *
   * Supports persistence models where one transaction may be referenced by
   * more than one Settlement Item.
   */
  findAllByTransactionPublicId(
    transactionPublicId: FinancialTransactionPublicId,
  ): Promise<FinancialSettlementAggregate[]>;

  /**
   * Finds all active Financial Settlements associated with a Financial
   * Transaction.
   */
  findActiveByTransactionPublicId(
    transactionPublicId: FinancialTransactionPublicId,
  ): Promise<FinancialSettlementAggregate[]>;

  // ===========================================================================
  // Amount / Allocation Queries
  // ===========================================================================

  /**
   * Finds PROCESSING Financial Settlements whose allocated amount is less
   * than their Settlement total.
   *
   * This is an operational persistence query only.
   *
   * Allocation invariants remain owned by the aggregate.
   */
  findProcessingWithRemainingAmount(): Promise<FinancialSettlementAggregate[]>;

  /**
   * Finds PROCESSING Financial Settlements whose allocated amount equals
   * their Settlement total.
   *
   * The aggregate remains authoritative for determining whether completion
   * is permitted.
   */
  findProcessingFullyAllocated(): Promise<FinancialSettlementAggregate[]>;

  // ===========================================================================
  // Settlement Item Lifecycle Queries
  // ===========================================================================

  /**
   * Finds PROCESSING Financial Settlements containing at least one
   * Settlement Item still in PENDING allocation state.
   */
  findProcessingWithPendingItems(): Promise<FinancialSettlementAggregate[]>;

  /**
   * Finds PROCESSING Financial Settlements where every Settlement Item has
   * reached SETTLED state.
   *
   * The aggregate remains responsible for the final COMPLETED transition.
   */
  findProcessingWithAllItemsSettled(): Promise<FinancialSettlementAggregate[]>;

  // ===========================================================================
  // Operational Queries
  // ===========================================================================

  /**
   * Finds Financial Settlements created within the supplied half-open range:
   *
   *     from <= createdAt < to
   */
  findCreatedBetween(
    from: Date,
    to: Date,
  ): Promise<FinancialSettlementAggregate[]>;

  /**
   * Finds Financial Settlements updated within the supplied half-open range:
   *
   *     from <= updatedAt < to
   */
  findUpdatedBetween(
    from: Date,
    to: Date,
  ): Promise<FinancialSettlementAggregate[]>;

  /**
   * Finds PROCESSING Financial Settlements that started processing at or
   * before the supplied point in time.
   *
   * Useful for detecting long-running or stalled settlement operations.
   */
  findProcessingStartedBefore(
    at: Date,
  ): Promise<FinancialSettlementAggregate[]>;

  /**
   * Finds terminal Financial Settlements that reached their terminal state
   * at or before the supplied point in time.
   *
   * Useful for reconciliation and archival workflows.
   */
  findTerminalBefore(at: Date): Promise<FinancialSettlementAggregate[]>;

  // ===========================================================================
  // Existence
  // ===========================================================================

  /**
   * Returns true if a Financial Settlement exists for the supplied public
   * identifier.
   */
  existsByPublicId(publicId: FinancialSettlementPublicId): Promise<boolean>;

  /**
   * Returns true if a Financial Settlement exists for the supplied internal
   * identifier.
   */
  existsById(id: UniqueEntityId): Promise<boolean>;

  /**
   * Returns true if at least one Financial Settlement exists with the
   * supplied lifecycle status.
   */
  existsByStatus(status: FinancialSettlementStatus): Promise<boolean>;

  /**
   * Returns true if a Financial Settlement contains the supplied Settlement
   * Item.
   */
  existsByItemPublicId(
    itemPublicId: FinancialSettlementItemPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if a Financial Settlement exists for the supplied business
   * reference.
   */
  existsByReference(
    referenceType: FinancialReferenceType,
    referencePublicId: FinancialReferencePublicId,
  ): Promise<boolean>;

  /**
   * Returns true if an active Financial Settlement exists for the supplied
   * business reference.
   */
  existsActiveByReference(
    referenceType: FinancialReferenceType,
    referencePublicId: FinancialReferencePublicId,
  ): Promise<boolean>;

  /**
   * Returns true if a Financial Settlement exists for the supplied
   * Financial Account.
   */
  existsByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if an active Financial Settlement exists for the supplied
   * Financial Account.
   */
  existsActiveByAccountPublicId(
    accountPublicId: FinancialAccountPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if a Financial Settlement exists for the supplied Financial
   * Account and lifecycle status.
   */
  existsByAccountPublicIdAndStatus(
    accountPublicId: FinancialAccountPublicId,
    status: FinancialSettlementStatus,
  ): Promise<boolean>;

  /**
   * Returns true if a Financial Settlement exists for the supplied
   * Financial Transaction.
   */
  existsByTransactionPublicId(
    transactionPublicId: FinancialTransactionPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if an active Financial Settlement exists for the supplied
   * Financial Transaction.
   */
  existsActiveByTransactionPublicId(
    transactionPublicId: FinancialTransactionPublicId,
  ): Promise<boolean>;
}
