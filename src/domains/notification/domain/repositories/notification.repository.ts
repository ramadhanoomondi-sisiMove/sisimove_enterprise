// -----------------------------------------------------------------------------
// Notification — Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Notification aggregate.
//
// Aggregate:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// NotificationEntity is the aggregate root entity.
//
// NotificationDeliveryEntity instances are child entities owned by the
// Notification aggregate.
//
// -----------------------------------------------------------------------------
//
// Aggregate boundary:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// The repository persists and rehydrates the COMPLETE aggregate boundary.
//
// A NotificationDeliveryEntity must never be persisted as an independent
// aggregate.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - persist Notification aggregates;
// - retrieve Notification aggregates;
// - retrieve Notification entities;
// - query notifications by public identity;
// - query notifications by internal identity;
// - query notifications by recipient public identity;
// - query notifications by status;
// - query notifications by recipient and status;
// - query notifications by notification type;
// - query notifications by priority;
// - query notifications by source event;
// - query notifications by referenced resource;
// - retrieve notification deliveries through the Notification aggregate;
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
// - validate recipient Identity existence;
// - validate recipient Identity state;
// - load Journey aggregates;
// - load Booking aggregates;
// - load Financial aggregates;
// - load Support aggregates;
// - perform authorization;
// - decide whether notifications should be sent;
// - decide whether notifications should be delivered;
// - send notifications;
// - deliver notifications;
// - communicate with Push providers;
// - communicate with Email providers;
// - communicate with SMS providers;
// - implement notification lifecycle rules;
// - implement notification delivery lifecycle rules;
// - implement notification preference rules.
//
// Notification behavior belongs to:
//
// NotificationAggregate
// NotificationEntity
// NotificationDeliveryEntity
//
// Cross-domain validation belongs to the appropriate application/domain
// workflow.
//
// -----------------------------------------------------------------------------
//
// Cross-domain recipient reference:
//
// NotificationEntity stores:
//
//     NotificationMemberPublicId
//
// This is an opaque public reference to:
//
//     Identity.publicId
//
// The repository may use recipientPublicId for persistence filtering, but it
// must NEVER dereference the Identity aggregate.
//
// There is intentionally no Prisma relation between Notification and Identity.
//
// -----------------------------------------------------------------------------
//
// Internal aggregate relationship:
//
// NotificationDeliveryEntity stores:
//
//     notificationId
//
// This references NotificationEntity.id.
//
// Unlike the Identity reference, this IS an internal Notification-domain
// persistence relationship and is represented by a Prisma foreign key.
//
// The repository implementation must preserve this relationship when saving
// and rehydrating the aggregate.
//
// -----------------------------------------------------------------------------
//
// Aggregate retrieval:
//
// Aggregate queries return:
//
// NotificationAggregate
// ├── NotificationEntity
// └── NotificationDeliveryEntity[]
//
// The repository implementation is responsible for reconstructing the complete
// aggregate through:
//
//     NotificationAggregate.rehydrate(
//       notification,
//       deliveries,
//     )
//
// Rehydration must not emit domain events.
//
// Persisted delivery entities must be reconstructed as children of the same
// Notification aggregate.
//
// -----------------------------------------------------------------------------
//
// Entity retrieval:
//
// Entity queries return:
//
//     NotificationEntity
//
// Entity-only retrieval intentionally does not construct a
// NotificationAggregate.
//
// This is useful for workflows that require only the Notification root.
//
// When notification delivery behavior or aggregate-level invariants are
// required, the application layer should retrieve the complete aggregate.
//
// -----------------------------------------------------------------------------
//
// Delivery retrieval:
//
// Deliveries are part of the Notification aggregate boundary.
//
// Therefore the primary aggregate retrieval mechanism is:
//
//     NotificationAggregate
//     ├── NotificationEntity
//     └── NotificationDeliveryEntity[]
//
// The repository should not expose NotificationDeliveryEntity as an independent
// aggregate.
//
// Delivery-specific infrastructure queries may be introduced separately only
// when an application use case genuinely requires them.
//
// -----------------------------------------------------------------------------
//
// Query semantics:
//
// Recipient:
//
//     recipientPublicId
//
// Status:
//
//     NotificationStatus
//
// Type:
//
//     NotificationType
//
// Priority:
//
//     NotificationPriority
//
// Source event:
//
//     eventType
//     eventPublicId
//
// Referenced resource:
//
//     referenceType
//     referencePublicId
//
// These are persistence-oriented filters only.
//
// They do not represent business policy.
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
//     "notification is allowed"
//     "delivery is allowed"
//     "recipient is active"
//     "recipient exists"
//     "provider can deliver"
//
// Those decisions belong to the aggregate, domain policy, application service,
// authorization boundary, or external delivery workflow.
//
// -----------------------------------------------------------------------------
//
// Persistence invariants:
//
// The repository implementation must preserve:
//
//     Notification.id
//     Notification.publicId
//
// and for every delivery:
//
//     NotificationDelivery.id
//     NotificationDelivery.publicId
//     NotificationDelivery.notificationId
//
// The persistence model additionally enforces:
//
//     UNIQUE(Notification.publicId)
//
//     UNIQUE(NotificationDelivery.publicId)
//
//     UNIQUE(NotificationDelivery.notificationId, NotificationDelivery.channel)
//
// The aggregate independently enforces delivery identity and channel
// uniqueness before persistence.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { NotificationAggregate } from '../aggregates/notification.aggregate';

// -----------------------------------------------------------------------------
// Entity — Notification
// -----------------------------------------------------------------------------

import type { NotificationEntity } from '../entities/notification.entity';

// -----------------------------------------------------------------------------
// Value Objects — Notification
// -----------------------------------------------------------------------------

import type { NotificationPublicId } from '../value-objects/notification-public-id.vo';

import type { NotificationStatus } from '../value-objects/notification-status.vo';

// -----------------------------------------------------------------------------
// Value Objects — Recipient
// -----------------------------------------------------------------------------

import type { NotificationMemberPublicId } from '../value-objects/notification-member-public-id.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Repository
// =============================================================================

export interface NotificationRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a complete Notification aggregate.
   *
   * The implementation is responsible for persisting:
   *
   *     NotificationEntity
   *
   * together with:
   *
   *     NotificationDeliveryEntity[]
   *
   * as one aggregate persistence operation.
   *
   * The implementation must preserve the aggregate boundary and delivery
   * ownership relationship.
   *
   * Domain behavior remains inside the aggregate and entities.
   */
  save(aggregate: NotificationAggregate): Promise<void>;

  /**
   * Physically removes a Notification aggregate from persistence.
   *
   * Because NotificationDelivery records belong to the Notification through
   * the Prisma cascade relationship, deleting the Notification persistence
   * record also removes its persisted deliveries.
   *
   * This is a persistence operation only.
   *
   * It must not be interpreted as a domain cancellation.
   */
  delete(aggregate: NotificationAggregate): Promise<void>;

  // ===========================================================================
  // Aggregate Queries — Public Identity
  // ===========================================================================

  /**
   * Finds a complete Notification aggregate by public identity.
   *
   * The returned aggregate contains:
   *
   *     NotificationEntity
   *     NotificationDeliveryEntity[]
   *
   * or null when no matching Notification exists.
   */
  findByPublicId(
    publicId: NotificationPublicId,
  ): Promise<NotificationAggregate | null>;

  /**
   * Finds a complete Notification aggregate by internal identity.
   *
   * The returned aggregate contains its Notification root and all persisted
   * NotificationDelivery children.
   */
  findById(id: UniqueEntityId): Promise<NotificationAggregate | null>;

  // ===========================================================================
  // Aggregate Queries — Recipient
  // ===========================================================================

  /**
   * Finds Notifications belonging to the supplied recipient.
   *
   * recipientPublicId is an opaque reference to Identity.publicId.
   *
   * The repository performs persistence filtering only.
   *
   * It does not load, validate, or dereference Identity.
   */
  findByRecipientPublicId(
    recipientPublicId: NotificationMemberPublicId,
  ): Promise<NotificationAggregate[]>;

  /**
   * Finds Notifications belonging to the supplied recipient and having the
   * supplied Notification status.
   */
  findByRecipientPublicIdAndStatus(
    recipientPublicId: NotificationMemberPublicId,
    status: NotificationStatus,
  ): Promise<NotificationAggregate[]>;

  // ===========================================================================
  // Aggregate Queries — Status
  // ===========================================================================

  /**
   * Finds all Notification aggregates with the supplied status.
   */
  findByStatus(status: NotificationStatus): Promise<NotificationAggregate[]>;

  // ===========================================================================
  // Aggregate Retrieval
  // ===========================================================================

  /**
   * Finds all Notification aggregates.
   *
   * Every persisted Notification is reconstructed together with all of its
   * NotificationDelivery children through:
   *
   *     NotificationAggregate.rehydrate(
   *       notification,
   *       deliveries,
   *     )
   *
   * Rehydration must not emit domain events.
   */
  findAll(): Promise<NotificationAggregate[]>;

  // ===========================================================================
  // Entity Queries — Public Identity
  // ===========================================================================

  /**
   * Finds the Notification aggregate root entity by public identity.
   *
   * This query does not construct a NotificationAggregate.
   *
   * NotificationDeliveryEntity children are not returned by this method.
   */
  findEntityByPublicId(
    publicId: NotificationPublicId,
  ): Promise<NotificationEntity | null>;

  /**
   * Finds the Notification aggregate root entity by internal identity.
   *
   * This query does not construct a NotificationAggregate.
   *
   * NotificationDeliveryEntity children are not returned by this method.
   */
  findEntityById(id: UniqueEntityId): Promise<NotificationEntity | null>;

  // ===========================================================================
  // Entity Queries — Recipient
  // ===========================================================================

  /**
   * Finds Notification root entities belonging to the supplied recipient.
   *
   * recipientPublicId is an opaque Identity-domain reference.
   *
   * The repository does not load or validate Identity.
   */
  findEntitiesByRecipientPublicId(
    recipientPublicId: NotificationMemberPublicId,
  ): Promise<NotificationEntity[]>;

  /**
   * Finds Notification root entities belonging to the supplied recipient and
   * having the supplied Notification status.
   */
  findEntitiesByRecipientPublicIdAndStatus(
    recipientPublicId: NotificationMemberPublicId,
    status: NotificationStatus,
  ): Promise<NotificationEntity[]>;

  // ===========================================================================
  // Entity Queries — Status
  // ===========================================================================

  /**
   * Finds Notification root entities with the supplied status.
   */
  findEntitiesByStatus(
    status: NotificationStatus,
  ): Promise<NotificationEntity[]>;

  // ===========================================================================
  // Entity Retrieval
  // ===========================================================================

  /**
   * Finds all Notification root entities.
   *
   * This method does not construct Notification aggregates.
   *
   * NotificationDeliveryEntity children are not included.
   */
  findAllEntities(): Promise<NotificationEntity[]>;

  // ===========================================================================
  // Existence — Public Identity
  // ===========================================================================

  /**
   * Determines whether a Notification exists by public identity.
   *
   * This is a persistence existence check.
   *
   * The aggregate is not loaded.
   */
  existsByPublicId(publicId: NotificationPublicId): Promise<boolean>;

  /**
   * Determines whether a Notification exists by internal identity.
   *
   * This is a persistence existence check.
   *
   * The aggregate is not loaded.
   */
  existsById(id: UniqueEntityId): Promise<boolean>;

  // ===========================================================================
  // Existence — Recipient
  // ===========================================================================

  /**
   * Determines whether at least one Notification exists for the supplied
   * recipient.
   *
   * The repository performs a persistence existence check only.
   *
   * It does not verify that the recipient exists in Identity.
   */
  existsByRecipientPublicId(
    recipientPublicId: NotificationMemberPublicId,
  ): Promise<boolean>;

  // ===========================================================================
  // Existence — Recipient + Status
  // ===========================================================================
  // -----------------------------------------------------------------------------
  // Aggregate Queries — Source Event
  // -----------------------------------------------------------------------------

  /**
   * Finds Notification aggregates produced from the supplied source event.
   *
   * eventType identifies the type of source event.
   *
   * eventPublicId is the public identity of the source event.
   *
   * These values are persistence-oriented filters only.
   *
   * The repository does not:
   *
   * - load the source aggregate;
   * - validate the source event;
   * - interpret the source event;
   * - determine whether a notification should exist.
   *
   * The returned aggregates contain:
   *
   *     NotificationEntity
   *     NotificationDeliveryEntity[]
   */
  findByEventTypeAndEventPublicId(
    eventType: string,
    eventPublicId: string,
  ): Promise<NotificationAggregate[]>;

  // -----------------------------------------------------------------------------
  // Aggregate Queries — Referenced Resource
  // -----------------------------------------------------------------------------

  /**
   * Finds Notification aggregates referencing the supplied resource.
   *
   * referenceType identifies the type of referenced resource.
   *
   * referencePublicId is the public identity of the referenced resource.
   *
   * These values are opaque cross-domain references.
   *
   * The repository does not:
   *
   * - load the referenced aggregate;
   * - validate the referenced resource;
   * - dereference the resource;
   * - apply notification policy.
   *
   * The returned aggregates contain:
   *
   *     NotificationEntity
   *     NotificationDeliveryEntity[]
   */
  findByReferenceTypeAndReferencePublicId(
    referenceType: string,
    referencePublicId: string,
  ): Promise<NotificationAggregate[]>;
  /**
   * Determines whether at least one Notification exists for the supplied
   * recipient and status.
   */
  existsByRecipientPublicIdAndStatus(
    recipientPublicId: NotificationMemberPublicId,
    status: NotificationStatus,
  ): Promise<boolean>;
}
