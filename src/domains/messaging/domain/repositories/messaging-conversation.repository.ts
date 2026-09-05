// -----------------------------------------------------------------------------
// Messaging — Conversation Repository
// -----------------------------------------------------------------------------
//
// Repository contract for the Messaging Conversation aggregate.
//
// Aggregate ownership:
//
// MessagingConversationAggregate
// ├── MessagingConversationEntity
// ├── MessagingConversationParticipantEntity[]
// └── MessagingMessageEntity[]
//
// MessagingConversationAggregate is the consistency boundary for:
//
// - conversation lifecycle;
// - conversation participants;
// - participant membership;
// - messages belonging to the conversation;
// - message membership;
// - participant message permissions;
// - conversation closure.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Persist Messaging Conversation aggregates.
// - Retrieve Messaging Conversation aggregates.
// - Retrieve the Messaging Conversation entity when required by infrastructure.
// - Retrieve Messaging Conversation participants when required by infrastructure.
// - Retrieve Messaging Messages when required by infrastructure.
// - Support conversation public-identity lookup.
// - Support conversation internal-identity lookup.
// - Support Journey public-identity lookup.
// - Support Booking public-identity lookup.
// - Support conversation-status queries.
// - Support conversation-type queries.
// - Support participant-member lookup.
// - Support participant-status queries.
// - Support message lookup.
// - Support message sender lookup.
// - Support message-status queries.
// - Support message-type queries.
// - Support existence checks.
//
// -----------------------------------------------------------------------------
//
// This repository does NOT:
//
// - Depend on Prisma.
// - Depend on ORM models.
// - Load Identity aggregates.
// - Validate Identity aggregate state.
// - Load Journey aggregates.
// - Validate Journey aggregate state.
// - Load Booking aggregates.
// - Validate Booking aggregate state.
// - Load Asset aggregates.
// - Validate Asset aggregate state.
// - Perform authorization.
// - Decide whether a member may join a conversation.
// - Decide whether a member may send a message.
// - Decide whether a message may be edited.
// - Decide whether a message may be deleted.
// - Decide whether a message may be moderated.
// - Deliver messages.
// - Send notifications.
// - Moderate content externally.
// - Upload or delete physical assets.
//
// Cross-aggregate coordination belongs to the application layer or an
// appropriate domain service/policy.
//
// -----------------------------------------------------------------------------
//
// Cross-domain references:
//
// MessagingConversationEntity stores opaque public references to:
//
//     Journey.publicId
//     JourneyBooking.publicId
//
// MessagingConversationParticipantEntity stores an opaque public reference to:
//
//     Identity.publicId
//
// MessagingMessageEntity stores opaque public references to:
//
//     Identity.publicId
//     Asset.publicId
//
// These references are domain values, not mutable aggregate relationships.
//
// The repository may use them for persistence queries, but must not dereference
// or load the referenced aggregates.
//
// -----------------------------------------------------------------------------
//
// Aggregate retrieval:
//
// Aggregate queries return:
//
// MessagingConversationAggregate
// ├── MessagingConversationEntity
// ├── MessagingConversationParticipantEntity[]
// └── MessagingMessageEntity[]
//
// The repository implementation is responsible for reconstructing the complete
// aggregate through the appropriate mapper/factory.
//
// Entity queries exist for infrastructure use cases where loading the complete
// aggregate is unnecessary.
//
// -----------------------------------------------------------------------------
//
// Uniqueness:
//
// Persistence should enforce uniqueness of:
//
//     UNIQUE(MessagingConversation.id)
//     UNIQUE(MessagingConversation.publicId)
//
//     UNIQUE(MessagingConversationParticipant.id)
//     UNIQUE(MessagingConversationParticipant.publicId)
//     UNIQUE(conversationId, memberPublicId)
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
//     "may join"
//     "may leave"
//     "is authorized to access"
//
// Those decisions belong to the aggregate, domain policy, application service,
// or authorization boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { MessagingConversationAggregate } from '../aggregates/messaging-conversation.aggregate';

// -----------------------------------------------------------------------------
// Entities
// -----------------------------------------------------------------------------

import type { MessagingConversationEntity } from '../entities/messaging-conversation.entity';

import type { MessagingConversationParticipantEntity } from '../entities/messaging-conversation-participant.entity';

import type { MessagingMessageEntity } from '../entities/messaging-message.entity';

// -----------------------------------------------------------------------------
// Value Objects — Conversation
// -----------------------------------------------------------------------------

import type { MessagingConversationPublicId } from '../value-objects/messaging-conversation-public-id.vo';

import type { MessagingConversationType } from '../value-objects/messaging-conversation-type.vo';

import type { MessagingConversationStatus } from '../value-objects/messaging-conversation-status.vo';

import type { MessagingJourneyPublicId } from '../value-objects/messaging-journey-public-id.vo';

import type { MessagingBookingPublicId } from '../value-objects/messaging-booking-public-id.vo';

// -----------------------------------------------------------------------------
// Value Objects — Participant
// -----------------------------------------------------------------------------

import type { MessagingConversationParticipantPublicId } from '../value-objects/messaging-conversation-participant-public-id.vo';

import type { MessagingMemberPublicId } from '../value-objects/messaging-member-public-id.vo';

import type { MessagingParticipantRole } from '../value-objects/messaging-participant-role.vo';

import type { MessagingParticipantStatus } from '../value-objects/messaging-participant-status.vo';

// -----------------------------------------------------------------------------
// Value Objects — Message
// -----------------------------------------------------------------------------

import type { MessagingMessagePublicId } from '../value-objects/messaging-message-public-id.vo';

import type { MessagingMessageType } from '../value-objects/messaging-message-type.vo';

import type { MessagingMessageStatus } from '../value-objects/messaging-message-status.vo';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { UniqueEntityId } from '../../../../foundation/kernel/domain/unique-entity-id';

// =============================================================================
// Repository
// =============================================================================

export interface MessagingConversationRepository {
  // ===========================================================================
  // Persistence
  // ===========================================================================

  /**
   * Persists a Messaging Conversation aggregate.
   *
   * The repository implementation is responsible for translating the
   * aggregate into its persistence representation.
   *
   * Domain behavior remains inside the aggregate and its entities.
   */
  save(aggregate: MessagingConversationAggregate): Promise<void>;

  /**
   * Removes a Messaging Conversation aggregate.
   *
   * Deletion eligibility is determined by application/domain policy.
   * The repository only performs the persistence operation.
   */
  delete(aggregate: MessagingConversationAggregate): Promise<void>;

  // ===========================================================================
  // Aggregate Queries — Identity
  // ===========================================================================

  /**
   * Finds a Messaging Conversation aggregate by its public identifier.
   *
   * MessagingConversationPublicId is the public identity of the aggregate.
   */
  findByPublicId(
    publicId: MessagingConversationPublicId,
  ): Promise<MessagingConversationAggregate | null>;

  /**
   * Finds a Messaging Conversation aggregate by its internal identifier.
   *
   * The internal identity is intended primarily for infrastructure-oriented
   * persistence operations.
   */
  findById(id: UniqueEntityId): Promise<MessagingConversationAggregate | null>;

  // ===========================================================================
  // Aggregate Queries — Cross-Domain References
  // ===========================================================================

  /**
   * Finds all Messaging Conversation aggregates associated with a Journey.
   *
   * MessagingJourneyPublicId is an opaque reference to Journey.publicId.
   *
   * The repository does not load or validate the Journey aggregate.
   */
  findByJourneyPublicId(
    journeyPublicId: MessagingJourneyPublicId,
  ): Promise<MessagingConversationAggregate[]>;

  /**
   * Finds all Messaging Conversation aggregates associated with a Booking.
   *
   * MessagingBookingPublicId is an opaque reference to
   * JourneyBooking.publicId.
   *
   * The repository does not load or validate the Booking aggregate.
   */
  findByBookingPublicId(
    bookingPublicId: MessagingBookingPublicId,
  ): Promise<MessagingConversationAggregate[]>;

  // ===========================================================================
  // Aggregate Queries — Conversation State
  // ===========================================================================

  /**
   * Finds all Messaging Conversation aggregates with the supplied type.
   */
  findByType(
    type: MessagingConversationType,
  ): Promise<MessagingConversationAggregate[]>;

  /**
   * Finds all Messaging Conversation aggregates with the supplied status.
   */
  findByStatus(
    status: MessagingConversationStatus,
  ): Promise<MessagingConversationAggregate[]>;

  /**
   * Finds all active Messaging Conversations.
   */
  findActive(): Promise<MessagingConversationAggregate[]>;

  /**
   * Finds all closed Messaging Conversations.
   */
  findClosed(): Promise<MessagingConversationAggregate[]>;

  /**
   * Finds all Messaging Conversations associated with a Journey and status.
   *
   * This is a persistence query and does not determine whether the
   * conversation may receive messages or whether a member may access it.
   */
  findByJourneyPublicIdAndStatus(
    journeyPublicId: MessagingJourneyPublicId,
    status: MessagingConversationStatus,
  ): Promise<MessagingConversationAggregate[]>;

  /**
   * Finds all Messaging Conversations associated with a Booking and status.
   */
  findByBookingPublicIdAndStatus(
    bookingPublicId: MessagingBookingPublicId,
    status: MessagingConversationStatus,
  ): Promise<MessagingConversationAggregate[]>;

  // ===========================================================================
  // Entity Queries — Conversation
  // ===========================================================================

  /**
   * Finds the Messaging Conversation entity by public identifier.
   *
   * Returns the aggregate-root entity without wrapping it in an aggregate.
   */
  findEntityByPublicId(
    publicId: MessagingConversationPublicId,
  ): Promise<MessagingConversationEntity | null>;

  /**
   * Finds the Messaging Conversation entity by internal identifier.
   */
  findEntityById(
    id: UniqueEntityId,
  ): Promise<MessagingConversationEntity | null>;

  /**
   * Finds the Messaging Conversation entity by Journey public identifier.
   *
   * Returns the conversation entities without loading participants or messages.
   */
  findEntitiesByJourneyPublicId(
    journeyPublicId: MessagingJourneyPublicId,
  ): Promise<MessagingConversationEntity[]>;

  /**
   * Finds the Messaging Conversation entity by Booking public identifier.
   */
  findEntitiesByBookingPublicId(
    bookingPublicId: MessagingBookingPublicId,
  ): Promise<MessagingConversationEntity[]>;

  // ===========================================================================
  // Participant Queries
  // ===========================================================================

  /**
   * Finds a conversation participant by participant public identifier.
   *
   * Returns the participant entity without loading the complete aggregate.
   */
  findParticipantByPublicId(
    publicId: MessagingConversationParticipantPublicId,
  ): Promise<MessagingConversationParticipantEntity | null>;

  /**
   * Finds a conversation participant by internal identifier.
   */
  findParticipantById(
    id: UniqueEntityId,
  ): Promise<MessagingConversationParticipantEntity | null>;

  /**
   * Finds a participant by conversation and member public identifier.
   *
   * MessagingMemberPublicId is an opaque reference to Identity.publicId.
   *
   * The repository does not load or validate the Identity aggregate.
   */
  findParticipantByMemberPublicId(
    conversationPublicId: MessagingConversationPublicId,
    memberPublicId: MessagingMemberPublicId,
  ): Promise<MessagingConversationParticipantEntity | null>;

  /**
   * Finds all participants belonging to a conversation.
   *
   * The result is ordered according to the repository implementation's
   * persistence ordering contract.
   */
  findParticipants(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingConversationParticipantEntity[]>;

  /**
   * Finds all participants with the supplied status.
   */
  findParticipantsByStatus(
    conversationPublicId: MessagingConversationPublicId,
    status: MessagingParticipantStatus,
  ): Promise<MessagingConversationParticipantEntity[]>;

  /**
   * Finds all participants with the supplied role.
   */
  findParticipantsByRole(
    conversationPublicId: MessagingConversationPublicId,
    role: MessagingParticipantRole,
  ): Promise<MessagingConversationParticipantEntity[]>;

  /**
   * Finds all participants belonging to the supplied member.
   *
   * The member public identity is treated as an opaque Identity reference.
   */
  findParticipationsByMemberPublicId(
    memberPublicId: MessagingMemberPublicId,
  ): Promise<MessagingConversationParticipantEntity[]>;

  /**
   * Finds all active participants in a conversation.
   *
   * This is a persistence query for ACTIVE participant status.
   *
   * It does not itself grant permission to perform an operation.
   */
  findActiveParticipants(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingConversationParticipantEntity[]>;

  /**
   * Finds all participants who have left a conversation.
   */
  findLeftParticipants(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingConversationParticipantEntity[]>;

  /**
   * Finds all participants who have been removed from a conversation.
   */
  findRemovedParticipants(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingConversationParticipantEntity[]>;

  // ===========================================================================
  // Message Queries
  // ===========================================================================

  /**
   * Finds a Messaging Message entity by its public identifier.
   *
   * The message is returned without loading the complete conversation
   * aggregate.
   */
  findMessageByPublicId(
    publicId: MessagingMessagePublicId,
  ): Promise<MessagingMessageEntity | null>;

  /**
   * Finds a Messaging Message entity by its internal identifier.
   */
  findMessageById(id: UniqueEntityId): Promise<MessagingMessageEntity | null>;

  /**
   * Finds a message within a specific conversation by public identifier.
   *
   * This method is useful when the application already knows the conversation
   * boundary and wants to ensure the message belongs to it.
   */
  findMessageByPublicIdInConversation(
    conversationPublicId: MessagingConversationPublicId,
    messagePublicId: MessagingMessagePublicId,
  ): Promise<MessagingMessageEntity | null>;

  /**
   * Finds all messages belonging to a conversation.
   *
   * The result is ordered according to the repository implementation's
   * persistence ordering contract.
   */
  findMessages(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageEntity[]>;

  /**
   * Finds messages belonging to a conversation with the supplied status.
   */
  findMessagesByStatus(
    conversationPublicId: MessagingConversationPublicId,
    status: MessagingMessageStatus,
  ): Promise<MessagingMessageEntity[]>;

  /**
   * Finds messages belonging to a conversation with the supplied type.
   */
  findMessagesByType(
    conversationPublicId: MessagingConversationPublicId,
    type: MessagingMessageType,
  ): Promise<MessagingMessageEntity[]>;

  /**
   * Finds all messages sent by the supplied member.
   *
   * MessagingMemberPublicId is an opaque reference to Identity.publicId.
   *
   * The repository does not load or validate the Identity aggregate.
   */
  findMessagesBySenderPublicId(
    senderPublicId: MessagingMemberPublicId,
  ): Promise<MessagingMessageEntity[]>;

  /**
   * Finds all messages sent by a member within a specific conversation.
   */
  findMessagesBySenderInConversation(
    conversationPublicId: MessagingConversationPublicId,
    senderPublicId: MessagingMemberPublicId,
  ): Promise<MessagingMessageEntity[]>;

  /**
   * Finds all sent messages in a conversation.
   */
  findSentMessages(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageEntity[]>;

  /**
   * Finds all edited messages in a conversation.
   */
  findEditedMessages(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageEntity[]>;

  /**
   * Finds all deleted messages in a conversation.
   */
  findDeletedMessages(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageEntity[]>;

  /**
   * Finds all moderated messages in a conversation.
   */
  findModeratedMessages(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<MessagingMessageEntity[]>;

  // ===========================================================================
  // Aggregate Retrieval Helpers
  // ===========================================================================

  /**
   * Finds all Messaging Conversation aggregates.
   *
   * Each returned aggregate must contain its conversation entity, participants,
   * and messages according to the repository's aggregate reconstruction
   * contract.
   */
  findAll(): Promise<MessagingConversationAggregate[]>;

  /**
   * Finds all conversation aggregates belonging to a member.
   *
   * The member public identity remains an opaque cross-domain reference.
   */
  findByMemberPublicId(
    memberPublicId: MessagingMemberPublicId,
  ): Promise<MessagingConversationAggregate[]>;

  /**
   * Finds all active conversations containing a member.
   *
   * This is a persistence query based on conversation status and participant
   * membership. It does not itself perform authorization.
   */
  findActiveByMemberPublicId(
    memberPublicId: MessagingMemberPublicId,
  ): Promise<MessagingConversationAggregate[]>;

  // ===========================================================================
  // Existence — Conversation
  // ===========================================================================

  /**
   * Returns true if a conversation exists for the supplied public identifier.
   */
  existsByPublicId(publicId: MessagingConversationPublicId): Promise<boolean>;

  /**
   * Returns true if a conversation exists for the supplied internal identifier.
   */
  existsById(id: UniqueEntityId): Promise<boolean>;

  /**
   * Returns true if at least one conversation exists for the supplied Journey.
   */
  existsByJourneyPublicId(
    journeyPublicId: MessagingJourneyPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if at least one conversation exists for the supplied Booking.
   */
  existsByBookingPublicId(
    bookingPublicId: MessagingBookingPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if at least one conversation exists with the supplied type.
   */
  existsByType(type: MessagingConversationType): Promise<boolean>;

  /**
   * Returns true if at least one conversation exists with the supplied status.
   */
  existsByStatus(status: MessagingConversationStatus): Promise<boolean>;

  /**
   * Returns true if at least one active conversation exists.
   */
  existsActive(): Promise<boolean>;

  /**
   * Returns true if at least one closed conversation exists.
   */
  existsClosed(): Promise<boolean>;

  // ===========================================================================
  // Existence — Participant
  // ===========================================================================

  /**
   * Returns true if a participant exists for the supplied public identifier.
   */
  existsParticipantByPublicId(
    publicId: MessagingConversationParticipantPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if a participant exists for the supplied internal identifier.
   */
  existsParticipantById(id: UniqueEntityId): Promise<boolean>;

  /**
   * Returns true if the supplied member participates in the conversation.
   */
  existsParticipantByMemberPublicId(
    conversationPublicId: MessagingConversationPublicId,
    memberPublicId: MessagingMemberPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if at least one participant exists with the supplied status
   * in the conversation.
   */
  existsParticipantByStatus(
    conversationPublicId: MessagingConversationPublicId,
    status: MessagingParticipantStatus,
  ): Promise<boolean>;

  /**
   * Returns true if at least one participant exists with the supplied role
   * in the conversation.
   */
  existsParticipantByRole(
    conversationPublicId: MessagingConversationPublicId,
    role: MessagingParticipantRole,
  ): Promise<boolean>;

  /**
   * Returns true if at least one active participant exists in the conversation.
   */
  existsActiveParticipant(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<boolean>;

  // ===========================================================================
  // Existence — Message
  // ===========================================================================

  /**
   * Returns true if a message exists for the supplied public identifier.
   */
  existsMessageByPublicId(publicId: MessagingMessagePublicId): Promise<boolean>;

  /**
   * Returns true if a message exists for the supplied internal identifier.
   */
  existsMessageById(id: UniqueEntityId): Promise<boolean>;

  /**
   * Returns true if a message exists in the supplied conversation.
   */
  existsMessageInConversation(
    conversationPublicId: MessagingConversationPublicId,
    messagePublicId: MessagingMessagePublicId,
  ): Promise<boolean>;

  /**
   * Returns true if at least one message exists in the conversation.
   */
  existsMessages(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if at least one message exists with the supplied status.
   */
  existsMessagesByStatus(
    conversationPublicId: MessagingConversationPublicId,
    status: MessagingMessageStatus,
  ): Promise<boolean>;

  /**
   * Returns true if at least one message exists with the supplied type.
   */
  existsMessagesByType(
    conversationPublicId: MessagingConversationPublicId,
    type: MessagingMessageType,
  ): Promise<boolean>;

  /**
   * Returns true if at least one message exists from the supplied sender.
   */
  existsMessagesBySenderPublicId(
    senderPublicId: MessagingMemberPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if at least one message exists from the supplied sender
   * within a specific conversation.
   */
  existsMessagesBySenderInConversation(
    conversationPublicId: MessagingConversationPublicId,
    senderPublicId: MessagingMemberPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if at least one sent message exists in the conversation.
   */
  existsSentMessages(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if at least one edited message exists in the conversation.
   */
  existsEditedMessages(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if at least one deleted message exists in the conversation.
   */
  existsDeletedMessages(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<boolean>;

  /**
   * Returns true if at least one moderated message exists in the conversation.
   */
  existsModeratedMessages(
    conversationPublicId: MessagingConversationPublicId,
  ): Promise<boolean>;
}
