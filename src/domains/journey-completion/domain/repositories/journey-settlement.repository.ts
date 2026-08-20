// -----------------------------------------------------------------------------
// Journey Settlement Repository
// -----------------------------------------------------------------------------
//
// Domain repository contract for the Journey Settlement aggregate.
//
// Responsibilities:
// - Aggregate persistence and rehydration
// - Aggregate-scoped lookup
// - Root Journey Settlement queries
// - Journey Completion association queries
// - Journey queries
// - Provider queries
// - Settlement lifecycle queries
// - Financial transaction reference queries
//
// Persistence concerns such as Prisma includes, joins, transactions,
// pagination, indexing, and query optimization belong to infrastructure.
//
// Journey Completion is another aggregate. The settlement stores its internal
// aggregate identity as completionId.
//
// Cross-domain/public references such as journeyPublicId, providerPublicId,
// completionPublicId, and financialTransactionPublicId are represented by
// value objects.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { JourneySettlementAggregate } from '../aggregates/journey-settlement.aggregate';

// -----------------------------------------------------------------------------
// Domain Entity
// -----------------------------------------------------------------------------

import type { JourneySettlementEntity } from '../entities/journey-settlement.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneySettlementPublicId } from '../value-objects/journey-settlement-public-id.vo';

import type { JourneyCompletionPublicId } from '../value-objects/journey-completion-public-id.vo';

import type { JourneyCompletionJourneyPublicId } from '../value-objects/journey-completion-journey-public-id.vo';

import type { JourneyCompletionProviderPublicId } from '../value-objects/journey-completion-provider-public-id.vo';

import type { JourneySettlementFinancialTransactionPublicId } from '../value-objects/journey-settlement-financial-transaction-public-id.vo';

import type { JourneySettlementStatus } from '../value-objects/journey-settlement-status.vo';

// =============================================================================
// Journey Settlement Repository
// =============================================================================

/**
 * Domain repository contract for the Journey Settlement aggregate.
 *
 * Aggregate boundary:
 *
 * JourneySettlementAggregate
 * └── JourneySettlementEntity
 *
 * Journey Settlement owns only its settlement entity.
 *
 * Journey Completion, Journey, Provider, and Financial Transaction remain
 * outside this aggregate's ownership boundary.
 *
 * The repository therefore exposes:
 *
 * - aggregate persistence and rehydration
 * - root settlement queries
 * - Journey Completion association queries
 * - Journey queries
 * - provider queries
 * - lifecycle status queries
 * - Financial transaction reference queries
 *
 * Persistence implementation details remain outside the domain contract.
 */
export interface JourneySettlementRepository {
  // ===========================================================================
  // Aggregate Persistence
  // ===========================================================================

  /**
   * Persists the complete Journey Settlement aggregate.
   */
  save(aggregate: JourneySettlementAggregate): Promise<void>;

  /**
   * Finds and rehydrates a Journey Settlement aggregate by internal ID.
   */
  findById(id: UniqueEntityId): Promise<JourneySettlementAggregate | null>;

  /**
   * Finds and rehydrates a Journey Settlement aggregate by public ID.
   */
  findByPublicId(
    publicId: JourneySettlementPublicId,
  ): Promise<JourneySettlementAggregate | null>;

  /**
   * Deletes a Journey Settlement aggregate by internal ID.
   */
  delete(id: UniqueEntityId): Promise<void>;

  /**
   * Determines whether a Journey Settlement exists by internal ID.
   */
  exists(id: UniqueEntityId): Promise<boolean>;

  /**
   * Determines whether a Journey Settlement exists by public ID.
   */
  existsByPublicId(publicId: JourneySettlementPublicId): Promise<boolean>;

  // ===========================================================================
  // Root Journey Settlement Queries
  // ===========================================================================

  /**
   * Finds the Journey Settlement root entity by internal ID.
   *
   * This query does not imply aggregate rehydration.
   */
  findJourneySettlementById(
    id: UniqueEntityId,
  ): Promise<JourneySettlementEntity | null>;

  /**
   * Finds the Journey Settlement root entity by public ID.
   *
   * This query does not imply aggregate rehydration.
   */
  findJourneySettlementByPublicId(
    publicId: JourneySettlementPublicId,
  ): Promise<JourneySettlementEntity | null>;

  /**
   * Returns all Journey Settlement root entities.
   */
  findJourneySettlements(): Promise<JourneySettlementEntity[]>;

  // ===========================================================================
  // Journey Completion Queries
  // ===========================================================================

  /**
   * Finds the settlement associated with a Journey Completion by the
   * Journey Completion's internal aggregate ID.
   *
   * A Journey Completion can have at most one Journey Settlement.
   */
  findJourneySettlementByCompletionId(
    completionId: UniqueEntityId,
  ): Promise<JourneySettlementEntity | null>;

  /**
   * Finds the settlement associated with a Journey Completion by its
   * public ID.
   *
   * The settlement itself stores the internal completionId. Infrastructure
   * is responsible for resolving the public identity to the associated
   * Journey Completion.
   */
  findJourneySettlementByCompletionPublicId(
    completionPublicId: JourneyCompletionPublicId,
  ): Promise<JourneySettlementEntity | null>;

  /**
   * Determines whether a Journey Completion already has a settlement
   * using its internal ID.
   */
  existsByCompletionId(completionId: UniqueEntityId): Promise<boolean>;

  /**
   * Determines whether a Journey Completion already has a settlement
   * using its public ID.
   */
  existsByCompletionPublicId(
    completionPublicId: JourneyCompletionPublicId,
  ): Promise<boolean>;

  // ===========================================================================
  // Journey Queries
  // ===========================================================================

  /**
   * Finds settlements associated with a Journey.
   */
  findJourneySettlementsByJourneyPublicId(
    journeyPublicId: JourneyCompletionJourneyPublicId,
  ): Promise<JourneySettlementEntity[]>;

  /**
   * Finds settlements associated with a Journey and lifecycle status.
   */
  findJourneySettlementsByJourneyAndStatus(
    journeyPublicId: JourneyCompletionJourneyPublicId,
    status: JourneySettlementStatus,
  ): Promise<JourneySettlementEntity[]>;

  /**
   * Determines whether a Journey has a settlement in the specified status.
   */
  existsByJourneyPublicIdAndStatus(
    journeyPublicId: JourneyCompletionJourneyPublicId,
    status: JourneySettlementStatus,
  ): Promise<boolean>;

  // ===========================================================================
  // Provider Queries
  // ===========================================================================

  /**
   * Finds settlements belonging to a provider.
   */
  findJourneySettlementsByProviderPublicId(
    providerPublicId: JourneyCompletionProviderPublicId,
  ): Promise<JourneySettlementEntity[]>;

  /**
   * Finds settlements belonging to a provider with a specific status.
   */
  findJourneySettlementsByProviderAndStatus(
    providerPublicId: JourneyCompletionProviderPublicId,
    status: JourneySettlementStatus,
  ): Promise<JourneySettlementEntity[]>;

  /**
   * Determines whether a provider has a settlement in the specified status.
   */
  existsByProviderPublicIdAndStatus(
    providerPublicId: JourneyCompletionProviderPublicId,
    status: JourneySettlementStatus,
  ): Promise<boolean>;

  // ===========================================================================
  // Status Queries
  // ===========================================================================

  /**
   * Finds settlements by lifecycle status.
   */
  findJourneySettlementsByStatus(
    status: JourneySettlementStatus,
  ): Promise<JourneySettlementEntity[]>;

  /**
   * Finds pending settlements.
   */
  findPendingSettlements(): Promise<JourneySettlementEntity[]>;

  /**
   * Finds submitted settlements.
   */
  findSubmittedSettlements(): Promise<JourneySettlementEntity[]>;

  /**
   * Finds settlements currently being processed.
   */
  findProcessingSettlements(): Promise<JourneySettlementEntity[]>;

  /**
   * Finds completed settlements.
   */
  findCompletedSettlements(): Promise<JourneySettlementEntity[]>;

  /**
   * Finds failed settlements.
   */
  findFailedSettlements(): Promise<JourneySettlementEntity[]>;

  /**
   * Finds held settlements.
   */
  findHeldSettlements(): Promise<JourneySettlementEntity[]>;

  /**
   * Finds cancelled settlements.
   */
  findCancelledSettlements(): Promise<JourneySettlementEntity[]>;

  /**
   * Counts settlements by lifecycle status.
   */
  countByStatus(status: JourneySettlementStatus): Promise<number>;

  /**
   * Determines whether at least one settlement exists in the specified
   * lifecycle status.
   */
  existsByStatus(status: JourneySettlementStatus): Promise<boolean>;

  // ===========================================================================
  // Financial Transaction Queries
  // ===========================================================================

  /**
   * Finds and rehydrates a Journey Settlement aggregate by its
   * Financial transaction public ID.
   */
  findByFinancialTransactionPublicId(
    financialTransactionPublicId: JourneySettlementFinancialTransactionPublicId,
  ): Promise<JourneySettlementAggregate | null>;

  /**
   * Finds the Journey Settlement root entity by its
   * Financial transaction public ID.
   */
  findJourneySettlementByFinancialTransactionPublicId(
    financialTransactionPublicId: JourneySettlementFinancialTransactionPublicId,
  ): Promise<JourneySettlementEntity | null>;

  /**
   * Determines whether a settlement already references a Financial
   * transaction.
   */
  existsByFinancialTransactionPublicId(
    financialTransactionPublicId: JourneySettlementFinancialTransactionPublicId,
  ): Promise<boolean>;

  /**
   * Finds settlements that do not yet have a Financial transaction
   * reference.
   */
  findSettlementsWithoutFinancialTransaction(): Promise<
    JourneySettlementEntity[]
  >;

  // ===========================================================================
  // Operational Queries
  // ===========================================================================

  /**
   * Finds settlements that are currently awaiting submission.
   *
   * This corresponds to the PENDING lifecycle state.
   */
  findSettlementsAwaitingSubmission(): Promise<JourneySettlementEntity[]>;

  /**
   * Finds settlements that have been submitted and are awaiting
   * Financial processing.
   *
   * This corresponds to the SUBMITTED lifecycle state.
   */
  findSettlementsAwaitingProcessing(): Promise<JourneySettlementEntity[]>;

  /**
   * Finds settlements currently being processed.
   *
   * This corresponds to the PROCESSING lifecycle state.
   */
  findSettlementsBeingProcessed(): Promise<JourneySettlementEntity[]>;

  /**
   * Finds settlements requiring operational attention.
   *
   * This includes FAILED and HELD settlements.
   */
  findSettlementsRequiringAttention(): Promise<JourneySettlementEntity[]>;

  /**
   * Determines whether at least one settlement requires operational
   * attention.
   *
   * This includes FAILED and HELD settlements.
   */
  existsSettlementRequiringAttention(): Promise<boolean>;
}
