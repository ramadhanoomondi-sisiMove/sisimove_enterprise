// -----------------------------------------------------------------------------
// Journey Completion Repository
// -----------------------------------------------------------------------------
//
// Domain repository contract for the Journey Completion aggregate.
//
// Responsibilities:
// - Aggregate persistence and rehydration
// - Aggregate-scoped lookup
// - Root Journey Completion queries
// - Confirmation queries
// - Dispute queries
//
// Persistence concerns such as Prisma includes, joins, transactions,
// pagination, indexing, and query optimization belong to infrastructure.
//
// Journey Settlement is a separate aggregate and is intentionally NOT exposed
// through this repository.
//
// Cross-domain references such as journeyPublicId, providerPublicId,
// memberPublicId, and bookingPublicId are represented by strongly typed
// value objects and remain identifiers only.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { JourneyCompletionAggregate } from '../aggregates/journey-completion.aggregate';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { JourneyCompletionEntity } from '../entities/journey-completion.entity';

import type { JourneyCompletionConfirmationEntity } from '../entities/journey-completion-confirmation.entity';

import type { JourneyCompletionDisputeEntity } from '../entities/journey-completion-dispute.entity';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyCompletionPublicId } from '../value-objects/journey-completion-public-id.vo';

import type { JourneyCompletionJourneyPublicId } from '../value-objects/journey-completion-journey-public-id.vo';

import type { JourneyCompletionProviderPublicId } from '../value-objects/journey-completion-provider-public-id.vo';

import type { JourneyCompletionMemberPublicId } from '../value-objects/journey-completion-member-public-id.vo';

import type { JourneyCompletionBookingPublicId } from '../value-objects/journey-completion-booking-public-id.vo';

import type { JourneyCompletionStatus } from '../value-objects/journey-completion-status.vo';

import type { JourneyCompletionConfirmationPublicId } from '../value-objects/journey-completion-confirmation-public-id.vo';

import type { JourneyCompletionConfirmationRole } from '../value-objects/journey-completion-confirmation-role.vo';

import type { JourneyCompletionConfirmationStatus } from '../value-objects/journey-completion-confirmation-status.vo';

import type { JourneyCompletionDisputePublicId } from '../value-objects/journey-completion-dispute-public-id.vo';

import type { JourneyCompletionDisputeReason } from '../value-objects/journey-completion-dispute-reason.vo';

import type { JourneyCompletionDisputeStatus } from '../value-objects/journey-completion-dispute-status.vo';

// =============================================================================
// Journey Completion Repository
// =============================================================================

/**
 * Domain repository contract for the Journey Completion aggregate.
 *
 * Aggregate boundary:
 *
 * JourneyCompletionAggregate
 * ├── JourneyCompletionEntity
 * ├── JourneyCompletionConfirmationEntity[]
 * └── JourneyCompletionDisputeEntity[]
 *
 * Journey Settlement is a separate aggregate and is therefore intentionally
 * excluded from this repository.
 *
 * The repository exposes:
 *
 * - aggregate persistence and rehydration;
 * - root-entity queries;
 * - confirmation queries;
 * - dispute queries.
 *
 * Cross-domain identities are represented exclusively by strongly typed
 * public-identity value objects.
 */
export interface JourneyCompletionRepository {
  // ===========================================================================
  // Aggregate Persistence
  // ===========================================================================

  /**
   * Persists the complete Journey Completion aggregate.
   *
   * Infrastructure is responsible for persisting the root entity,
   * confirmations, and disputes atomically.
   */
  save(aggregate: JourneyCompletionAggregate): Promise<void>;

  /**
   * Finds and rehydrates a Journey Completion aggregate by internal ID.
   */
  findById(id: UniqueEntityId): Promise<JourneyCompletionAggregate | null>;

  /**
   * Finds and rehydrates a Journey Completion aggregate by public ID.
   */
  findByPublicId(
    publicId: JourneyCompletionPublicId,
  ): Promise<JourneyCompletionAggregate | null>;

  /**
   * Deletes a Journey Completion aggregate by internal ID.
   *
   * Infrastructure is responsible for deleting aggregate-owned confirmations
   * and disputes according to persistence rules.
   */
  delete(id: UniqueEntityId): Promise<void>;

  /**
   * Determines whether a Journey Completion exists by internal ID.
   */
  exists(id: UniqueEntityId): Promise<boolean>;

  /**
   * Determines whether a Journey Completion exists by public ID.
   */
  existsByPublicId(publicId: JourneyCompletionPublicId): Promise<boolean>;

  // ===========================================================================
  // Root Journey Completion Queries
  // ===========================================================================

  /**
   * Finds the Journey Completion root entity by internal ID.
   *
   * This query does not imply aggregate rehydration.
   */
  findJourneyCompletionById(
    id: UniqueEntityId,
  ): Promise<JourneyCompletionEntity | null>;

  /**
   * Finds the Journey Completion root entity by public ID.
   *
   * This query does not imply aggregate rehydration.
   */
  findJourneyCompletionByPublicId(
    publicId: JourneyCompletionPublicId,
  ): Promise<JourneyCompletionEntity | null>;

  /**
   * Returns all Journey Completion root entities.
   */
  findJourneyCompletions(): Promise<JourneyCompletionEntity[]>;

  /**
   * Finds the Journey Completion associated with a Journey.
   *
   * The Journey public identity is a cross-domain reference.
   */
  findJourneyCompletionByJourneyPublicId(
    journeyPublicId: JourneyCompletionJourneyPublicId,
  ): Promise<JourneyCompletionEntity | null>;

  /**
   * Determines whether a Journey already has a Journey Completion.
   */
  existsByJourneyPublicId(
    journeyPublicId: JourneyCompletionJourneyPublicId,
  ): Promise<boolean>;

  /**
   * Finds Journey Completions belonging to a provider.
   */
  findJourneyCompletionsByProviderPublicId(
    providerPublicId: JourneyCompletionProviderPublicId,
  ): Promise<JourneyCompletionEntity[]>;

  /**
   * Finds Journey Completions by lifecycle status.
   */
  findJourneyCompletionsByStatus(
    status: JourneyCompletionStatus,
  ): Promise<JourneyCompletionEntity[]>;

  /**
   * Finds Journey Completions belonging to a provider with a specific
   * lifecycle status.
   */
  findJourneyCompletionsByProviderAndStatus(
    providerPublicId: JourneyCompletionProviderPublicId,
    status: JourneyCompletionStatus,
  ): Promise<JourneyCompletionEntity[]>;

  /**
   * Finds Journey Completions for a Journey with a specific lifecycle
   * status.
   */
  findJourneyCompletionsByJourneyAndStatus(
    journeyPublicId: JourneyCompletionJourneyPublicId,
    status: JourneyCompletionStatus,
  ): Promise<JourneyCompletionEntity[]>;

  // ===========================================================================
  // Completion Lifecycle Queries
  // ===========================================================================

  /**
   * Finds a Journey Completion currently awaiting confirmation.
   *
   * This corresponds to the CONFIRMATION_REQUIRED lifecycle state.
   */
  findConfirmationRequiredByJourneyPublicId(
    journeyPublicId: JourneyCompletionJourneyPublicId,
  ): Promise<JourneyCompletionAggregate | null>;

  /**
   * Determines whether a Journey currently has a completion awaiting
   * confirmation.
   */
  existsConfirmationRequiredByJourneyPublicId(
    journeyPublicId: JourneyCompletionJourneyPublicId,
  ): Promise<boolean>;

  /**
   * Finds Journey Completions currently awaiting confirmation.
   */
  findConfirmationRequiredCompletions(): Promise<JourneyCompletionEntity[]>;

  /**
   * Finds confirmed Journey Completions.
   */
  findConfirmedCompletions(): Promise<JourneyCompletionEntity[]>;

  /**
   * Finds disputed Journey Completions.
   */
  findDisputedCompletions(): Promise<JourneyCompletionEntity[]>;

  /**
   * Finds cancelled Journey Completions.
   */
  findCancelledCompletions(): Promise<JourneyCompletionEntity[]>;

  /**
   * Determines whether a Journey Completion exists with the specified status.
   */
  existsByStatus(status: JourneyCompletionStatus): Promise<boolean>;

  /**
   * Counts Journey Completions by lifecycle status.
   */
  countByStatus(status: JourneyCompletionStatus): Promise<number>;

  // ===========================================================================
  // Confirmation Queries
  // ===========================================================================

  /**
   * Finds a confirmation by internal ID.
   */
  findConfirmationById(
    id: UniqueEntityId,
  ): Promise<JourneyCompletionConfirmationEntity | null>;

  /**
   * Finds a confirmation by public ID within its owning Journey Completion.
   *
   * The owning aggregate is identified internally by UniqueEntityId,
   * while the confirmation itself uses JourneyCompletionConfirmationPublicId.
   */
  findConfirmationByPublicId(
    journeyCompletionId: UniqueEntityId,
    confirmationPublicId: JourneyCompletionConfirmationPublicId,
  ): Promise<JourneyCompletionConfirmationEntity | null>;

  /**
   * Finds a confirmation by public ID within a Journey Completion identified
   * by its public identity.
   *
   * This mirrors the child entity's public completion reference.
   */
  findConfirmationByCompletionPublicId(
    completionPublicId: JourneyCompletionPublicId,
    confirmationPublicId: JourneyCompletionConfirmationPublicId,
  ): Promise<JourneyCompletionConfirmationEntity | null>;

  /**
   * Finds a confirmation by member public ID within a Journey Completion.
   */
  findConfirmationByMemberPublicId(
    journeyCompletionId: UniqueEntityId,
    memberPublicId: JourneyCompletionMemberPublicId,
  ): Promise<JourneyCompletionConfirmationEntity | null>;

  /**
   * Finds a confirmation by booking public ID within a Journey Completion.
   */
  findConfirmationByBookingPublicId(
    journeyCompletionId: UniqueEntityId,
    bookingPublicId: JourneyCompletionBookingPublicId,
  ): Promise<JourneyCompletionConfirmationEntity | null>;

  /**
   * Finds all confirmations belonging to a Journey Completion.
   */
  findConfirmations(
    journeyCompletionId: UniqueEntityId,
  ): Promise<JourneyCompletionConfirmationEntity[]>;

  /**
   * Finds confirmations belonging to a Journey Completion identified by
   * its public identity.
   */
  findConfirmationsByCompletionPublicId(
    completionPublicId: JourneyCompletionPublicId,
  ): Promise<JourneyCompletionConfirmationEntity[]>;

  /**
   * Finds confirmations by role within a Journey Completion.
   */
  findConfirmationsByRole(
    journeyCompletionId: UniqueEntityId,
    role: JourneyCompletionConfirmationRole,
  ): Promise<JourneyCompletionConfirmationEntity[]>;

  /**
   * Finds confirmations by status within a Journey Completion.
   */
  findConfirmationsByStatus(
    journeyCompletionId: UniqueEntityId,
    status: JourneyCompletionConfirmationStatus,
  ): Promise<JourneyCompletionConfirmationEntity[]>;

  /**
   * Finds confirmations belonging to a member across Journey Completions.
   */
  findConfirmationsByMemberPublicId(
    memberPublicId: JourneyCompletionMemberPublicId,
  ): Promise<JourneyCompletionConfirmationEntity[]>;

  /**
   * Finds confirmations associated with a booking across Journey
   * Completions.
   */
  findConfirmationsByBookingPublicId(
    bookingPublicId: JourneyCompletionBookingPublicId,
  ): Promise<JourneyCompletionConfirmationEntity[]>;

  /**
   * Determines whether a confirmation exists within a Journey Completion.
   */
  existsConfirmation(
    journeyCompletionId: UniqueEntityId,
    confirmationPublicId: JourneyCompletionConfirmationPublicId,
  ): Promise<boolean>;

  /**
   * Determines whether a member already has a confirmation within a
   * Journey Completion.
   */
  existsConfirmationByMemberPublicId(
    journeyCompletionId: UniqueEntityId,
    memberPublicId: JourneyCompletionMemberPublicId,
  ): Promise<boolean>;

  /**
   * Determines whether a booking is already represented by a confirmation
   * within a Journey Completion.
   */
  existsConfirmationByBookingPublicId(
    journeyCompletionId: UniqueEntityId,
    bookingPublicId: JourneyCompletionBookingPublicId,
  ): Promise<boolean>;

  /**
   * Counts all confirmations belonging to a Journey Completion.
   */
  countConfirmations(journeyCompletionId: UniqueEntityId): Promise<number>;

  /**
   * Counts confirmed confirmations belonging to a Journey Completion.
   */
  countConfirmedConfirmations(
    journeyCompletionId: UniqueEntityId,
  ): Promise<number>;

  /**
   * Counts withdrawn confirmations belonging to a Journey Completion.
   */
  countWithdrawnConfirmations(
    journeyCompletionId: UniqueEntityId,
  ): Promise<number>;

  /**
   * Determines whether the required confirmation count has been satisfied.
   */
  hasRequiredConfirmations(
    journeyCompletionId: UniqueEntityId,
  ): Promise<boolean>;

  // ===========================================================================
  // Confirmation State Queries
  // ===========================================================================

  /**
   * Finds active confirmations.
   *
   * An active confirmation has CONFIRMED status.
   */
  findConfirmedConfirmations(
    journeyCompletionId: UniqueEntityId,
  ): Promise<JourneyCompletionConfirmationEntity[]>;

  /**
   * Finds withdrawn confirmations.
   */
  findWithdrawnConfirmations(
    journeyCompletionId: UniqueEntityId,
  ): Promise<JourneyCompletionConfirmationEntity[]>;

  /**
   * Finds the provider confirmation within a Journey Completion.
   */
  findProviderConfirmation(
    journeyCompletionId: UniqueEntityId,
  ): Promise<JourneyCompletionConfirmationEntity | null>;

  /**
   * Finds passenger confirmations within a Journey Completion.
   */
  findPassengerConfirmations(
    journeyCompletionId: UniqueEntityId,
  ): Promise<JourneyCompletionConfirmationEntity[]>;

  /**
   * Determines whether a member has an active confirmation.
   */
  existsActiveConfirmationByMemberPublicId(
    journeyCompletionId: UniqueEntityId,
    memberPublicId: JourneyCompletionMemberPublicId,
  ): Promise<boolean>;

  // ===========================================================================
  // Dispute Queries
  // ===========================================================================

  findDisputeById(
    id: UniqueEntityId,
  ): Promise<JourneyCompletionDisputeEntity | null>;

  findDisputeByPublicId(
    journeyCompletionId: UniqueEntityId,
    disputePublicId: JourneyCompletionDisputePublicId,
  ): Promise<JourneyCompletionDisputeEntity | null>;

  findDisputeByCompletionPublicId(
    completionPublicId: JourneyCompletionPublicId,
    disputePublicId: JourneyCompletionDisputePublicId,
  ): Promise<JourneyCompletionDisputeEntity | null>;

  findDisputes(
    journeyCompletionId: UniqueEntityId,
  ): Promise<JourneyCompletionDisputeEntity[]>;

  findDisputesByCompletionPublicId(
    completionPublicId: JourneyCompletionPublicId,
  ): Promise<JourneyCompletionDisputeEntity[]>;

  findDisputesByRaisedByPublicId(
    journeyCompletionId: UniqueEntityId,
    memberPublicId: JourneyCompletionMemberPublicId,
  ): Promise<JourneyCompletionDisputeEntity[]>;

  findDisputesByStatus(
    journeyCompletionId: UniqueEntityId,
    status: JourneyCompletionDisputeStatus,
  ): Promise<JourneyCompletionDisputeEntity[]>;

  findDisputesByReason(
    journeyCompletionId: UniqueEntityId,
    reason: JourneyCompletionDisputeReason,
  ): Promise<JourneyCompletionDisputeEntity[]>;

  findDisputesByMemberPublicId(
    memberPublicId: JourneyCompletionMemberPublicId,
  ): Promise<JourneyCompletionDisputeEntity[]>;

  existsDispute(
    journeyCompletionId: UniqueEntityId,
    disputePublicId: JourneyCompletionDisputePublicId,
  ): Promise<boolean>;

  countDisputes(journeyCompletionId: UniqueEntityId): Promise<number>;

  countDisputesByStatus(
    journeyCompletionId: UniqueEntityId,
    status: JourneyCompletionDisputeStatus,
  ): Promise<number>;

  hasActiveDispute(journeyCompletionId: UniqueEntityId): Promise<boolean>;

  findActiveDisputes(
    journeyCompletionId: UniqueEntityId,
  ): Promise<JourneyCompletionDisputeEntity[]>;

  // ===========================================================================
  // Dispute Aggregate Lookup
  // ===========================================================================

  /**
   * Finds and rehydrates the Journey Completion aggregate that owns a dispute.
   */
  findByDisputePublicId(
    disputePublicId: JourneyCompletionDisputePublicId,
  ): Promise<JourneyCompletionAggregate | null>;
}
