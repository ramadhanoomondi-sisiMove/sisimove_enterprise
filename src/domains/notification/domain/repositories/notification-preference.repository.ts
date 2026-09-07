// -----------------------------------------------------------------------------
// Notification Preference — Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Notification Preference aggregate.
//
// Aggregate:
//
// NotificationPreferenceAggregate
// └── NotificationPreferenceEntity
//
// NotificationPreferenceEntity is the aggregate root entity.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundary:
//
// NotificationPreferenceAggregate
// └── NotificationPreferenceEntity
//
// The aggregate contains exactly one entity.
//
// There are no child entities.
//
// Unlike NotificationAggregate, which owns NotificationDeliveryEntity
// children, NotificationPreferenceAggregate has no internal collection or
// secondary entity.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - persist Notification Preference aggregates;
// - retrieve Notification Preference aggregates;
// - retrieve Notification Preference entities;
// - query preferences by public identity;
// - query preferences by internal identity;
// - query preferences by member public identity;
// - support existence checks.
//
// -----------------------------------------------------------------------------
//
// This repository does NOT:
//
// - depend on Prisma;
// - depend on ORM models;
// - expose Prisma-generated types;
// - load Identity aggregates;
// - validate Identity existence;
// - validate Identity state;
// - perform authorization;
// - decide whether notifications should be sent;
// - decide whether a notification should be delivered;
// - send notifications;
// - deliver notifications;
// - communicate with Push providers;
// - communicate with Email providers;
// - communicate with SMS providers;
// - implement notification preference business rules.
//
// Preference behavior belongs to:
//
// NotificationPreferenceAggregate
// NotificationPreferenceEntity
//
// Cross-domain member validation belongs to the appropriate application
// workflow or domain boundary.
//
// -----------------------------------------------------------------------------
//
// Cross-domain reference:
//
// NotificationPreferenceEntity stores:
//
//     NotificationMemberPublicId
//
// This is an opaque public reference to:
//
//     Identity.publicId
//
// The repository may use memberPublicId for persistence filtering, but it
// must NEVER dereference the Identity aggregate.
//
// There is intentionally no Prisma relation between:
//
//     NotificationPreference
//     Identity
//
// This preserves the Notification domain boundary.
//
// -----------------------------------------------------------------------------
//
// Aggregate retrieval:
//
// Aggregate queries return:
//
// NotificationPreferenceAggregate
// └── NotificationPreferenceEntity
//
// The repository implementation is responsible for reconstructing the
// aggregate through:
//
//     NotificationPreferenceAggregate.rehydrate(entity)
//
// Rehydration must not emit domain events.
//
// Domain events are produced only by explicit domain behavior such as:
//
//     create
//     enable
//     disable
//     set preference
//     enableAll
//     disableAll
//     etc.
//
// Repository reads must never accidentally produce domain events.
//
// -----------------------------------------------------------------------------
//
// Entity retrieval:
//
// Entity queries return:
//
//     NotificationPreferenceEntity
//
// Entity retrieval is useful for infrastructure and application workflows
// where the entity representation is required without aggregate behavior.
//
// When domain behavior or preference mutations are required, the application
// layer should retrieve the NotificationPreferenceAggregate instead.
//
// -----------------------------------------------------------------------------
//
// Uniqueness:
//
// The Prisma model defines:
//
//     memberPublicId String @unique
//
// Therefore the Notification domain guarantees one persisted preference
// record per member at the persistence level.
//
// The following identities are unique:
//
//     NotificationPreference.id
//     NotificationPreference.publicId
//     NotificationPreference.memberPublicId
//
// The database remains the final persistence-level uniqueness guarantee.
//
// -----------------------------------------------------------------------------
//
// Repository design:
//
// The repository exposes persistence-oriented queries.
//
// It does NOT expose policy predicates such as:
//
//     "should receive notification"
//     "may receive notification"
//     "is authorized"
//     "may change preference"
//     "member exists"
//     "member is active"
//     "notification is allowed"
//     "channel is allowed"
//
// Those decisions belong to the aggregate, domain policy, application
// service, or authorization boundary.
//
// -----------------------------------------------------------------------------
//
// Persistence mapping:
//
// Infrastructure implementations are responsible for translating between:
//
//     NotificationPreferenceAggregate
//
// and:
//
//     Prisma NotificationPreference
//
// The domain repository contract must remain independent from Prisma.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { NotificationPreferenceAggregate } from '../aggregates/notification-preference.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { NotificationPreferenceEntity } from '../entities/notification-preference.entity';

// -----------------------------------------------------------------------------
// Value Objects — Member
// -----------------------------------------------------------------------------

import type { NotificationMemberPublicId } from '../value-objects/notification-member-public-id.vo';

// -----------------------------------------------------------------------------
// Value Objects — Notification Preference
// -----------------------------------------------------------------------------

import type { NotificationPreferencePublicId } from '../value-objects/notification-preference-public-id.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Notification Preference Repository
// =============================================================================

/**
 * Repository contract for the Notification Preference aggregate.
 *
 * Aggregate:
 *
 * NotificationPreferenceAggregate
 * └── NotificationPreferenceEntity
 *
 * The repository is a domain-facing persistence abstraction.
 *
 * Infrastructure implementations may use Prisma, SQL, another ORM, or another
 * persistence mechanism without exposing that technology to the domain layer.
 */
export interface NotificationPreferenceRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a Notification Preference aggregate.
   *
   * The implementation is responsible for translating the aggregate into its
   * persistence representation.
   *
   * The repository must preserve the aggregate's:
   *
   * - internal identity;
   * - public identity;
   * - member public identity;
   * - preference state;
   * - timestamps.
   *
   * Domain behavior remains inside the aggregate and entity.
   */
  save(aggregate: NotificationPreferenceAggregate): Promise<void>;

  /**
   * Physically removes a Notification Preference aggregate from persistence.
   *
   * This method represents persistence deletion only.
   *
   * It must not be interpreted as a domain lifecycle operation.
   *
   * Deletion eligibility, authorization, and business policy belong outside
   * the repository.
   */
  delete(aggregate: NotificationPreferenceAggregate): Promise<void>;

  // ===========================================================================
  // Aggregate Queries — Public Identity
  // ===========================================================================

  /**
   * Finds a Notification Preference aggregate by its public identity.
   *
   * Returns:
   *
   *     NotificationPreferenceAggregate
   *
   * or:
   *
   *     null
   *
   * when no matching preference exists.
   *
   * The infrastructure implementation must rehydrate the aggregate without
   * emitting domain events.
   */
  findByPublicId(
    publicId: NotificationPreferencePublicId,
  ): Promise<NotificationPreferenceAggregate | null>;

  /**
   * Finds a Notification Preference aggregate by its internal identity.
   *
   * The internal identity is persistence/domain infrastructure identity and
   * must not be exposed as a cross-domain public reference.
   */
  findById(id: UniqueEntityId): Promise<NotificationPreferenceAggregate | null>;

  // ===========================================================================
  // Aggregate Queries — Member
  // ===========================================================================

  /**
   * Finds the Notification Preference aggregate belonging to the supplied
   * member public identity.
   *
   * NotificationMemberPublicId is an opaque reference to:
   *
   *     Identity.publicId
   *
   * The repository performs persistence filtering only.
   *
   * It does not:
   *
   * - load Identity;
   * - validate Identity;
   * - inspect Identity status;
   * - establish ownership;
   * - perform authorization.
   *
   * Because memberPublicId is unique in persistence, this query returns at
   * most one aggregate.
   */
  findByMemberPublicId(
    memberPublicId: NotificationMemberPublicId,
  ): Promise<NotificationPreferenceAggregate | null>;

  // ===========================================================================
  // Entity Queries — Public Identity
  // ===========================================================================

  /**
   * Finds a Notification Preference entity by its public identity.
   *
   * This query returns the aggregate root entity directly.
   *
   * It does not construct a NotificationPreferenceAggregate.
   */
  findEntityByPublicId(
    publicId: NotificationPreferencePublicId,
  ): Promise<NotificationPreferenceEntity | null>;

  /**
   * Finds a Notification Preference entity by its internal identity.
   *
   * This query returns the aggregate root entity directly.
   *
   * It does not construct a NotificationPreferenceAggregate.
   */
  findEntityById(
    id: UniqueEntityId,
  ): Promise<NotificationPreferenceEntity | null>;

  // ===========================================================================
  // Entity Queries — Member
  // ===========================================================================

  /**
   * Finds a Notification Preference entity by member public identity.
   *
   * The supplied member identity is an opaque Identity-domain reference.
   *
   * The repository does not dereference or validate the referenced Identity.
   *
   * Because memberPublicId is unique in persistence, this query returns at
   * most one entity.
   */
  findEntityByMemberPublicId(
    memberPublicId: NotificationMemberPublicId,
  ): Promise<NotificationPreferenceEntity | null>;

  // ===========================================================================
  // Aggregate Retrieval
  // ===========================================================================

  /**
   * Finds all Notification Preference aggregates.
   *
   * Each persisted NotificationPreference record is mapped to:
   *
   *     NotificationPreferenceEntity
   *
   * and then reconstructed through:
   *
   *     NotificationPreferenceAggregate.rehydrate(entity)
   *
   * Rehydration must not emit domain events.
   */
  findAll(): Promise<NotificationPreferenceAggregate[]>;

  // ===========================================================================
  // Entity Retrieval
  // ===========================================================================

  /**
   * Finds all Notification Preference entities.
   *
   * This method returns aggregate root entities directly and does not
   * construct aggregates.
   */
  findAllEntities(): Promise<NotificationPreferenceEntity[]>;

  // ===========================================================================
  // Existence — Public Identity
  // ===========================================================================

  /**
   * Determines whether a Notification Preference exists with the supplied
   * public identity.
   *
   * This is a persistence existence check.
   *
   * It does not load the aggregate.
   */
  existsByPublicId(publicId: NotificationPreferencePublicId): Promise<boolean>;

  /**
   * Determines whether a Notification Preference exists with the supplied
   * internal identity.
   *
   * This is a persistence existence check.
   *
   * It does not load the aggregate.
   */
  existsById(id: UniqueEntityId): Promise<boolean>;

  // ===========================================================================
  // Existence — Member
  // ===========================================================================

  /**
   * Determines whether the supplied member has a Notification Preference.
   *
   * NotificationPreference.memberPublicId is unique, therefore this
   * represents whether the member currently has a Notification Preference
   * aggregate.
   *
   * This method does not:
   *
   * - verify that the member exists;
   * - verify that the member is active;
   * - verify member authorization;
   * - load the Identity aggregate.
   */
  existsByMemberPublicId(
    memberPublicId: NotificationMemberPublicId,
  ): Promise<boolean>;
}
