// -----------------------------------------------------------------------------
// Messaging — Message Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Messaging Message aggregate.
//
// Aggregate:
//
// MessagingMessageAggregate
// └── MessagingMessageEntity
//
// The Messaging Message aggregate is the consistency boundary for:
//
// - message identity;
// - owning conversation reference;
// - sender reference;
// - message type;
// - message content;
// - asset reference;
// - message lifecycle;
// - message timestamps;
// - message domain events.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Persist Messaging Message aggregates.
// - Retrieve Messaging Message aggregates.
// - Retrieve Messaging Message entities.
// - Query messages by public identity.
// - Query messages by internal identity.
// - Query messages by owning conversation.
// - Query messages by sender.
// - Query messages by message type.
// - Query messages by message status.
// - Query messages by asset reference.
// - Support existence checks.
//
// -----------------------------------------------------------------------------
//
// This repository does NOT:
//
// - Depend on Prisma.
// - Depend on ORM models.
// - Load Messaging Conversation aggregates.
// - Validate Messaging Conversation state.
// - Validate conversation membership.
// - Validate participant state.
// - Determine whether a sender may send a message.
// - Determine whether a sender may edit a message.
// - Determine whether a sender may delete a message.
// - Determine whether a message may be moderated.
// - Perform authorization.
// - Deliver messages.
// - Send notifications.
// - Perform external moderation.
// - Load Identity aggregates.
// - Validate Identity state.
// - Load Asset aggregates.
// - Validate Asset state.
//
// Message-local lifecycle behavior belongs to MessagingMessageAggregate and
// MessagingMessageEntity.
//
// Conversation membership and conversation lifecycle validation belong to the
// MessagingConversationAggregate or the application workflow coordinating the
// operation.
//
// Cross-domain Identity and Asset validation belongs to the appropriate
// application/domain workflow.
//
// -----------------------------------------------------------------------------
//
// Cross-domain references:
//
// MessagingMessageEntity stores opaque public references to:
//
//     Identity.publicId
//     Asset.publicId
//
// MessagingMessageEntity also stores:
//
//     MessagingConversation.id
//     MessagingConversation.publicId
//
// These references identify external aggregates or aggregate ownership.
//
// The repository may use these references for persistence queries, but must
// never dereference them by loading the referenced aggregates.
//
// -----------------------------------------------------------------------------
//
// Aggregate retrieval:
//
// Aggregate queries return:
//
// MessagingMessageAggregate
// └── MessagingMessageEntity
//
// The repository implementation is responsible for reconstructing the
// aggregate through:
//
//     MessagingMessageAggregate.rehydrate(entity)
//
// Rehydration must not emit domain events.
//
// -----------------------------------------------------------------------------
//
// Entity retrieval:
//
// Entity queries return:
//
// MessagingMessageEntity
//
// Entity retrieval is useful for infrastructure and application workflows
// where aggregate behavior is not required.
//
// When domain behavior or lifecycle transitions are required, the application
// layer should retrieve the MessagingMessageAggregate instead.
//
// -----------------------------------------------------------------------------
//
// Uniqueness:
//
// Persistence should enforce uniqueness of:
//
//     UNIQUE(MessagingMessage.id)
//     UNIQUE(MessagingMessage.publicId)
//
// The database remains the final persistence-level uniqueness guarantee.
//
// -----------------------------------------------------------------------------
//
// Repository design:
//
// The repository exposes persistence-oriented queries.
//
// It does NOT expose domain-policy predicates such as:
//
//     "may send"
//     "may edit"
//     "may delete"
//     "may moderate"
//     "may access"
//     "is authorized"
//
// Those decisions belong to the aggregate, domain policy, application
// service, or authorization boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { MessagingMessageAggregate } from '../aggregates/messaging-message.aggregate';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { MessagingMessageEntity } from '../entities/messaging-message.entity';

// -----------------------------------------------------------------------------
// Value Objects — Conversation
// -----------------------------------------------------------------------------

import type { MessagingConversationPublicId } from '../value-objects/messaging-conversation-public-id.vo';

// -----------------------------------------------------------------------------
// Value Objects — Sender
// -----------------------------------------------------------------------------

import type { MessagingMemberPublicId } from '../value-objects/messaging-member-public-id.vo';

// -----------------------------------------------------------------------------
// Value Objects — Asset
// -----------------------------------------------------------------------------

import type { MessagingAssetPublicId } from '../value-objects/messaging-asset-public-id.vo';

// -----------------------------------------------------------------------------
// Value Objects — Message
// -----------------------------------------------------------------------------

import type { MessagingMessagePublicId } from '../value-objects/messaging-message-public-id.vo';

import type { MessagingMessageStatus } from '../value-objects/messaging-message-status.vo';

import type { MessagingMessageType } from '../value-objects/messaging-message-type.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Repository
// =============================================================================

export interface MessagingMessageRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a Messaging Message aggregate.
   *
   * The repository implementation is responsible for translating the
   * aggregate into its persistence representation.
   *
   * Domain behavior remains inside the aggregate and entity.
   */
  save(aggregate: MessagingMessageAggregate): Promise<void>;

  /**
   * Removes a Messaging Message aggregate.
   *
   * Deletion eligibility is determined by application/domain policy.
   *
   * This repository operation represents physical persistence deletion.
   *
   * It must not be confused with MessagingMessageAggregate.delete(), which
   * performs a domain lifecycle transition and preserves historical state.
   */
  delete(aggregate: MessagingMessageAggregate): Promise<void>;

  // ===========================================================================
  // Aggregate Queries — Identity
  // ===========================================================================

  /**
   * Finds a Messaging Message aggregate by its public identity.
   */
  findByPublicId(
    publicId: MessagingMessagePublicId,
  ): Promise<MessagingMessageAggregate | null>;

  /**
   * Finds a Messaging Message aggregate by its internal identity.
   */
  findById(id: UniqueEntityId): Promise<MessagingMessageAggregate | null>;

  // ===========================================================================
  // Aggregate Queries — Conversation
  // ===========================================================================

  /**
   * Finds all Messaging Message aggregates belonging to the supplied
   * Messaging Conversation internal identity.
   *
   * The repository only compares the persisted conversation reference.
   *
   * It does not load or validate the Messaging Conversation aggregate.
   */
  findByConversationId(
    conversationId: UniqueEntityId,
  ): Promise<MessagingMessageAggregate[]>;

  /**
   * Finds all Messaging Message aggregates belonging to the supplied
   * Messaging Conversation public identity.
   *
   * The repository only uses the opaque public reference.
   *
   * It does not load or validate the Messaging Conversation aggregate.
   */
  findByConversationPublicId(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageAggregate[]>;

  // ===========================================================================
  // Aggregate Queries — Sender
  // ===========================================================================

  /**
   * Finds all Messaging Message aggregates sent by the supplied member.
   *
   * MessagingMemberPublicId is an opaque reference to Identity.publicId.
   *
   * The repository does not load or validate the Identity aggregate.
   */
  findBySenderPublicId(
    senderPublicId: MessagingMemberPublicId,
  ): Promise<MessagingMessageAggregate[]>;

  /**
   * Finds all Messaging Message aggregates sent by a member within a
   * particular conversation.
   *
   * This query only filters persisted references.
   *
   * It does not validate participant membership.
   */
  findBySenderPublicIdInConversation(
    conversationPublicId: MessagingConversationPublicId,
    senderPublicId: MessagingMemberPublicId,
  ): Promise<MessagingMessageAggregate[]>;

  // ===========================================================================
  // Aggregate Queries — Message State
  // ===========================================================================

  /**
   * Finds all Messaging Message aggregates with the supplied lifecycle
   * status.
   */
  findByStatus(
    status: MessagingMessageStatus,
  ): Promise<MessagingMessageAggregate[]>;

  /**
   * Finds all Messaging Message aggregates of the supplied message type.
   */
  findByType(type: MessagingMessageType): Promise<MessagingMessageAggregate[]>;

  /**
   * Finds all Messaging Message aggregates referencing the supplied Asset.
   *
   * MessagingAssetPublicId is an opaque reference to Asset.publicId.
   *
   * The repository does not load or validate the Asset aggregate.
   */
  findByAssetPublicId(
    assetPublicId: MessagingAssetPublicId,
  ): Promise<MessagingMessageAggregate[]>;

  // ===========================================================================
  // Aggregate Queries — Conversation + Status
  // ===========================================================================

  /**
   * Finds messages in a conversation with the supplied lifecycle status.
   */
  findByConversationPublicIdAndStatus(
    conversationPublicId: MessagingConversationPublicId,
    status: MessagingMessageStatus,
  ): Promise<MessagingMessageAggregate[]>;

  /**
   * Finds messages in a conversation with the supplied message type.
   */
  findByConversationPublicIdAndType(
    conversationPublicId: MessagingConversationPublicId,
    type: MessagingMessageType,
  ): Promise<MessagingMessageAggregate[]>;

  /**
   * Finds messages in a conversation sent by the supplied member.
   */
  findByConversationPublicIdAndSenderPublicId(
    conversationPublicId: MessagingConversationPublicId,
    senderPublicId: MessagingMemberPublicId,
  ): Promise<MessagingMessageAggregate[]>;

  /**
   * Finds messages in a conversation with the supplied status and type.
   */
  findByConversationPublicIdAndStatusAndType(
    conversationPublicId: MessagingConversationPublicId,
    status: MessagingMessageStatus,
    type: MessagingMessageType,
  ): Promise<MessagingMessageAggregate[]>;

  // ===========================================================================
  // Aggregate Queries — Lifecycle
  // ===========================================================================

  /**
   * Finds all SENT messages.
   */
  findSent(): Promise<MessagingMessageAggregate[]>;

  /**
   * Finds all EDITED messages.
   */
  findEdited(): Promise<MessagingMessageAggregate[]>;

  /**
   * Finds all DELETED messages.
   */
  findDeleted(): Promise<MessagingMessageAggregate[]>;

  /**
   * Finds all MODERATED messages.
   */
  findModerated(): Promise<MessagingMessageAggregate[]>;

  /**
   * Finds SENT messages in a conversation.
   */
  findSentByConversationPublicId(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageAggregate[]>;

  /**
   * Finds EDITED messages in a conversation.
   */
  findEditedByConversationPublicId(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageAggregate[]>;

  /**
   * Finds DELETED messages in a conversation.
   */
  findDeletedByConversationPublicId(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageAggregate[]>;

  /**
   * Finds MODERATED messages in a conversation.
   */
  findModeratedByConversationPublicId(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageAggregate[]>;

  // ===========================================================================
  // Aggregate Queries — Message Type
  // ===========================================================================

  /**
   * Finds all TEXT messages.
   */
  findTextMessages(): Promise<MessagingMessageAggregate[]>;

  /**
   * Finds all IMAGE messages.
   */
  findImageMessages(): Promise<MessagingMessageAggregate[]>;

  /**
   * Finds all FILE messages.
   */
  findFileMessages(): Promise<MessagingMessageAggregate[]>;

  /**
   * Finds all SYSTEM messages.
   */
  findSystemMessages(): Promise<MessagingMessageAggregate[]>;

  /**
   * Finds TEXT messages in a conversation.
   */
  findTextMessagesByConversationPublicId(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageAggregate[]>;

  /**
   * Finds IMAGE messages in a conversation.
   */
  findImageMessagesByConversationPublicId(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageAggregate[]>;

  /**
   * Finds FILE messages in a conversation.
   */
  findFileMessagesByConversationPublicId(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageAggregate[]>;

  /**
   * Finds SYSTEM messages in a conversation.
   */
  findSystemMessagesByConversationPublicId(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageAggregate[]>;

  // ===========================================================================
  // Entity Queries — Identity
  // ===========================================================================

  /**
   * Finds a Messaging Message entity by public identity.
   *
   * This does not construct an aggregate.
   */
  findEntityByPublicId(
    publicId: MessagingMessagePublicId,
  ): Promise<MessagingMessageEntity | null>;

  /**
   * Finds a Messaging Message entity by internal identity.
   *
   * This does not construct an aggregate.
   */
  findEntityById(id: UniqueEntityId): Promise<MessagingMessageEntity | null>;

  // ===========================================================================
  // Entity Queries — Conversation
  // ===========================================================================

  /**
   * Finds all Messaging Message entities belonging to a conversation by
   * internal conversation identity.
   */
  findEntitiesByConversationId(
    conversationId: UniqueEntityId,
  ): Promise<MessagingMessageEntity[]>;

  /**
   * Finds all Messaging Message entities belonging to a conversation by
   * public conversation identity.
   */
  findEntitiesByConversationPublicId(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageEntity[]>;

  // ===========================================================================
  // Entity Queries — Sender
  // ===========================================================================

  /**
   * Finds all Messaging Message entities sent by a member.
   */
  findEntitiesBySenderPublicId(
    senderPublicId: MessagingMemberPublicId,
  ): Promise<MessagingMessageEntity[]>;

  /**
   * Finds all Messaging Message entities sent by a member within a
   * conversation.
   */
  findEntitiesBySenderPublicIdInConversation(
    conversationPublicId: MessagingConversationPublicId,
    senderPublicId: MessagingMemberPublicId,
  ): Promise<MessagingMessageEntity[]>;

  // ===========================================================================
  // Entity Queries — Asset
  // ===========================================================================

  /**
   * Finds all Messaging Message entities referencing an Asset.
   *
   * The repository does not load or validate the Asset.
   */
  findEntitiesByAssetPublicId(
    assetPublicId: MessagingAssetPublicId,
  ): Promise<MessagingMessageEntity[]>;

  // ===========================================================================
  // Entity Queries — Status
  // ===========================================================================

  /**
   * Finds all Messaging Message entities with the supplied lifecycle status.
   */
  findEntitiesByStatus(
    status: MessagingMessageStatus,
  ): Promise<MessagingMessageEntity[]>;

  /**
   * Finds all Messaging Message entities of the supplied message type.
   */
  findEntitiesByType(
    type: MessagingMessageType,
  ): Promise<MessagingMessageEntity[]>;

  /**
   * Finds all Messaging Message entities in a conversation with the supplied
   * status.
   */
  findEntitiesByConversationPublicIdAndStatus(
    conversationPublicId: MessagingConversationPublicId,
    status: MessagingMessageStatus,
  ): Promise<MessagingMessageEntity[]>;

  /**
   * Finds all Messaging Message entities in a conversation with the supplied
   * type.
   */
  findEntitiesByConversationPublicIdAndType(
    conversationPublicId: MessagingConversationPublicId,
    type: MessagingMessageType,
  ): Promise<MessagingMessageEntity[]>;

  // ===========================================================================
  // Entity Queries — Lifecycle
  // ===========================================================================

  /**
   * Finds all SENT Messaging Message entities.
   */
  findSentEntities(): Promise<MessagingMessageEntity[]>;

  /**
   * Finds all EDITED Messaging Message entities.
   */
  findEditedEntities(): Promise<MessagingMessageEntity[]>;

  /**
   * Finds all DELETED Messaging Message entities.
   */
  findDeletedEntities(): Promise<MessagingMessageEntity[]>;

  /**
   * Finds all MODERATED Messaging Message entities.
   */
  findModeratedEntities(): Promise<MessagingMessageEntity[]>;

  // ===========================================================================
  // Aggregate Retrieval
  // ===========================================================================

  /**
   * Finds every Messaging Message aggregate.
   */
  findAll(): Promise<MessagingMessageAggregate[]>;

  // ===========================================================================
  // Existence — Identity
  // ===========================================================================

  /**
   * Determines whether a message exists by public identity.
   */
  existsByPublicId(publicId: MessagingMessagePublicId): Promise<boolean>;

  /**
   * Determines whether a message exists by internal identity.
   */
  existsById(id: UniqueEntityId): Promise<boolean>;

  // ===========================================================================
  // Existence — Conversation
  // ===========================================================================

  /**
   * Determines whether at least one message belongs to the supplied
   * conversation internal identity.
   */
  existsByConversationId(conversationId: UniqueEntityId): Promise<boolean>;

  /**
   * Determines whether at least one message belongs to the supplied
   * conversation public identity.
   */
  existsByConversationPublicId(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<boolean>;

  // ===========================================================================
  // Existence — Sender
  // ===========================================================================

  /**
   * Determines whether the supplied member has sent at least one message.
   */
  existsBySenderPublicId(
    senderPublicId: MessagingMemberPublicId,
  ): Promise<boolean>;

  /**
   * Determines whether the supplied member has sent at least one message in
   * the supplied conversation.
   *
   * This only checks persisted references.
   *
   * It does not validate participant membership.
   */
  existsBySenderPublicIdInConversation(
    conversationPublicId: MessagingConversationPublicId,
    senderPublicId: MessagingMemberPublicId,
  ): Promise<boolean>;

  // ===========================================================================
  // Existence — Asset
  // ===========================================================================

  /**
   * Determines whether at least one message references the supplied Asset.
   */
  existsByAssetPublicId(
    assetPublicId: MessagingAssetPublicId,
  ): Promise<boolean>;

  // ===========================================================================
  // Existence — Status
  // ===========================================================================

  /**
   * Determines whether at least one message has the supplied lifecycle
   * status.
   */
  existsByStatus(status: MessagingMessageStatus): Promise<boolean>;

  /**
   * Determines whether at least one message has the supplied message type.
   */
  existsByType(type: MessagingMessageType): Promise<boolean>;

  /**
   * Determines whether at least one message in a conversation has the
   * supplied lifecycle status.
   */
  existsByConversationPublicIdAndStatus(
    conversationPublicId: MessagingConversationPublicId,
    status: MessagingMessageStatus,
  ): Promise<boolean>;

  /**
   * Determines whether at least one message in a conversation has the
   * supplied message type.
   */
  existsByConversationPublicIdAndType(
    conversationPublicId: MessagingConversationPublicId,
    type: MessagingMessageType,
  ): Promise<boolean>;

  // ===========================================================================
  // Existence — Lifecycle
  // ===========================================================================

  /**
   * Determines whether at least one SENT message exists.
   */
  existsSent(): Promise<boolean>;

  /**
   * Determines whether at least one EDITED message exists.
   */
  existsEdited(): Promise<boolean>;

  /**
   * Determines whether at least one DELETED message exists.
   */
  existsDeleted(): Promise<boolean>;

  /**
   * Determines whether at least one MODERATED message exists.
   */
  existsModerated(): Promise<boolean>;

  // ===========================================================================
  // Existence — Message Types
  // ===========================================================================

  /**
   * Determines whether at least one TEXT message exists.
   */
  existsTextMessages(): Promise<boolean>;

  /**
   * Determines whether at least one IMAGE message exists.
   */
  existsImageMessages(): Promise<boolean>;

  /**
   * Determines whether at least one FILE message exists.
   */
  existsFileMessages(): Promise<boolean>;

  /**
   * Determines whether at least one SYSTEM message exists.
   */
  existsSystemMessages(): Promise<boolean>;
}
