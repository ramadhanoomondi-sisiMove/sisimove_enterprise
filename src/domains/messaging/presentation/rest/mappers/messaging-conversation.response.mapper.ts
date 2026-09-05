// -----------------------------------------------------------------------------
// Messaging — Conversation Response Mapper
// -----------------------------------------------------------------------------
//
// Maps the MessagingConversationAggregate / MessagingConversationEntity domain
// model into an application-facing MessagingConversationResponse.
//
// Aggregate:
//
// MessagingConversationAggregate
// ├── MessagingConversationEntity
// ├── MessagingConversationParticipantEntity[]
// └── MessagingMessageEntity[]
//
// Mapping principles:
//
// - Expose Messaging Conversation-safe state.
// - Serialize value objects into primitives.
// - Expose the Messaging Conversation public identity.
// - Expose the Journey public identity.
// - Expose the optional Booking public identity.
// - Expose conversation type and lifecycle status.
// - Expose conversation lifecycle predicates.
// - Expose participant collection state.
// - Map participant entities into safe response objects.
// - Expose message collection state.
// - Expose conversation message-activity timestamp.
// - Expose conversation lifecycle timestamps.
// - Expose defensive Date instances.
// - Do not expose internal persistence identifiers.
// - Do not expose domain entities.
// - Do not expose value objects directly.
// - Do not access Prisma.
// - Do not access persistence models.
// - Do not resolve Journey.
// - Do not resolve Booking.
// - Do not resolve Identity members.
// - Do not evaluate authorization.
// - Do not perform business validation.
// - Do not mutate the aggregate.
// - Do not emit domain events.
//
// -----------------------------------------------------------------------------
//
// Responsibilities:
//
// - Map MessagingConversationAggregate -> MessagingConversationResponse.
// - Map MessagingConversationEntity -> MessagingConversationResponse.
// - Map MessagingConversationParticipantEntity ->
//   MessagingConversationParticipantResponse.
// - Provide one canonical Messaging Conversation mapping implementation.
// - Convert Messaging Conversation value objects into primitive response values.
// - Convert participant value objects into primitive response values.
// - Expose safe lifecycle predicates.
// - Expose participant collection information.
// - Expose participant lifecycle state.
// - Expose participant read state.
// - Expose message collection information.
// - Return defensive Date instances.
//
// -----------------------------------------------------------------------------
//
// This mapper does NOT:
//
// - Mutate the Messaging Conversation aggregate.
// - Persist the Messaging Conversation.
// - Access Prisma.
// - Access repositories.
// - Resolve Journey.
// - Resolve Booking.
// - Resolve Identity members.
// - Resolve assets.
// - Perform authorization.
// - Perform business validation.
// - Emit domain events.
// - Change Messaging Conversation lifecycle state.
// - Change participant lifecycle state.
// - Change participant read state.
//
// -----------------------------------------------------------------------------
//
// Identity:
//
// publicId is the externally safe Messaging Conversation identifier.
//
// The internal entity identity (`id`) is intentionally excluded.
//
// journeyPublicId is exposed because it is an explicit opaque public reference
// owned by the Messaging Conversation domain model.
//
// bookingPublicId is exposed when a Booking has been associated with the
// conversation.
//
// Participant public identity is exposed through participant.publicId.
//
// The participant internal `id` and internal `conversationId` are intentionally
// excluded.
//
// -----------------------------------------------------------------------------
//
// Conversation Type:
//
// The mapper exposes:
//
// - type;
// - isJourneyConversation;
// - isDirectConversation.
//
// These are read-only projections of the conversation entity.
//
// -----------------------------------------------------------------------------
//
// Lifecycle:
//
// The mapper exposes:
//
// - status;
// - isActive;
// - isClosed;
// - isUsable;
// - canBeModified;
// - canReceiveMessages;
// - canBeClosed.
//
// These are read-only projections of the conversation entity's existing domain
// predicates.
//
// -----------------------------------------------------------------------------
//
// Participants:
//
// The aggregate owns the participant collection.
//
// The mapper exposes:
//
// - participantCount;
// - hasParticipants;
// - participants.
//
// Participant details are mapped directly by this mapper because the
// MessagingConversationParticipantEntity is not an aggregate root.
//
// -----------------------------------------------------------------------------
//
// Messages:
//
// The aggregate owns the message collection.
//
// The mapper intentionally exposes collection-level information:
//
// - messageCount;
// - hasMessages.
//
// Individual Messaging Message aggregate/entity response mapping belongs to
// MessagingMessageResponseMapper.
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

import type { MessagingConversationAggregate } from '../../../domain/aggregates/messaging-conversation.aggregate';

// -----------------------------------------------------------------------------
// Domain Entities
// -----------------------------------------------------------------------------

import type { MessagingConversationEntity } from '../../../domain/entities/messaging-conversation.entity';

import type { MessagingConversationParticipantEntity } from '../../../domain/entities/messaging-conversation-participant.entity';

// =============================================================================
// Participant Response
// =============================================================================

export interface MessagingConversationParticipantResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Messaging Conversation Participant.
   *
   * The internal participant identity is intentionally excluded.
   */
  publicId: string;

  /**
   * Public identifier of the Identity-domain member represented by this
   * participant.
   */
  memberPublicId: string;

  // ---------------------------------------------------------------------------
  // Role
  // ---------------------------------------------------------------------------

  /**
   * Current participant role.
   */
  role: string;

  /**
   * Indicates whether the participant is a provider.
   */
  isProvider: boolean;

  /**
   * Indicates whether the participant is a passenger.
   */
  isPassenger: boolean;

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Current participant lifecycle status.
   */
  status: string;

  /**
   * Indicates whether the participant is active.
   */
  isActive: boolean;

  /**
   * Indicates whether the participant has left the conversation.
   */
  hasLeft: boolean;

  /**
   * Indicates whether the participant has been removed.
   */
  isRemoved: boolean;

  /**
   * Indicates whether the participant is currently usable.
   */
  isUsable: boolean;

  /**
   * Indicates whether the participant can currently be modified.
   */
  canBeModified: boolean;

  /**
   * Indicates whether the participant can currently leave.
   */
  canLeave: boolean;

  /**
   * Indicates whether the participant can currently be removed.
   */
  canBeRemoved: boolean;

  /**
   * Indicates whether the participant can currently read messages.
   */
  canReadMessages: boolean;

  /**
   * Indicates whether the participant can currently send messages.
   */
  canSendMessages: boolean;

  // ---------------------------------------------------------------------------
  // Membership
  // ---------------------------------------------------------------------------

  /**
   * Timestamp when the participant joined the conversation.
   */
  joinedAt: Date;

  /**
   * Timestamp when the participant left the conversation.
   */
  leftAt: Date | undefined;

  /**
   * Timestamp when the participant was removed.
   */
  removedAt: Date | undefined;

  // ---------------------------------------------------------------------------
  // Read State
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether the participant has a recorded read position.
   */
  hasReadPosition: boolean;

  /**
   * Timestamp through which the participant has read messages.
   */
  lastReadAt: Date | undefined;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the participant was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the participant was last updated.
   */
  updatedAt: Date;
}

// =============================================================================
// Conversation Response
// =============================================================================

export interface MessagingConversationResponse {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Messaging Conversation aggregate.
   */
  publicId: string;

  /**
   * Public identifier of the Journey associated with the conversation.
   */
  journeyPublicId: string;

  /**
   * Public identifier of the Booking associated with the conversation.
   *
   * Undefined when no Booking reference exists.
   */
  bookingPublicId: string | undefined;

  // ---------------------------------------------------------------------------
  // Conversation
  // ---------------------------------------------------------------------------

  /**
   * Messaging Conversation type.
   */
  type: string;

  /**
   * Current Messaging Conversation lifecycle status.
   */
  status: string;

  // ---------------------------------------------------------------------------
  // Conversation Type Predicates
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether this is a Journey conversation.
   */
  isJourneyConversation: boolean;

  /**
   * Indicates whether this is a direct conversation.
   */
  isDirectConversation: boolean;

  // ---------------------------------------------------------------------------
  // Lifecycle Predicates
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether the conversation is currently active.
   */
  isActive: boolean;

  /**
   * Indicates whether the conversation is closed.
   */
  isClosed: boolean;

  /**
   * Indicates whether the conversation is currently usable.
   */
  isUsable: boolean;

  /**
   * Indicates whether the conversation can currently be modified.
   */
  canBeModified: boolean;

  /**
   * Indicates whether the conversation can currently receive messages.
   */
  canReceiveMessages: boolean;

  /**
   * Indicates whether the conversation can currently be closed.
   */
  canBeClosed: boolean;

  // ---------------------------------------------------------------------------
  // Booking State
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether the conversation has an associated Booking.
   */
  hasBooking: boolean;

  // ---------------------------------------------------------------------------
  // Participant State
  // ---------------------------------------------------------------------------

  /**
   * Number of participants represented by the aggregate.
   */
  participantCount: number;

  /**
   * Indicates whether the conversation contains participants.
   */
  hasParticipants: boolean;

  /**
   * Participants belonging to the conversation.
   *
   * Participant entities are mapped into safe response objects.
   */
  participants: MessagingConversationParticipantResponse[];

  // ---------------------------------------------------------------------------
  // Message State
  // ---------------------------------------------------------------------------

  /**
   * Number of messages currently represented by the aggregate.
   */
  messageCount: number;

  /**
   * Indicates whether the conversation contains messages.
   */
  hasMessages: boolean;

  // ---------------------------------------------------------------------------
  // Message Activity
  // ---------------------------------------------------------------------------

  /**
   * Timestamp of the most recent message activity.
   */
  lastMessageAt: Date | undefined;

  // ---------------------------------------------------------------------------
  // Closure
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the conversation was closed.
   */
  closedAt: Date | undefined;

  // ---------------------------------------------------------------------------
  // Audit
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the Messaging Conversation was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the Messaging Conversation was last updated.
   */
  updatedAt: Date;
}

// =============================================================================
// Mapper
// =============================================================================

export class MessagingConversationResponseMapper {
  // ===========================================================================
  // Aggregate -> Response
  // ===========================================================================

  /**
   * Maps a MessagingConversationAggregate into a
   * MessagingConversationResponse.
   *
   * This is the canonical aggregate-to-response mapping entry point.
   */
  public static toResponse(
    aggregate: MessagingConversationAggregate,
  ): MessagingConversationResponse {
    if (aggregate === undefined || aggregate === null) {
      throw new Error('Messaging Conversation aggregate is required.');
    }

    return this.mapConversation(aggregate);
  }

  // ===========================================================================
  // Entity -> Response
  // ===========================================================================

  /**
   * Maps a MessagingConversationEntity directly into a
   * MessagingConversationResponse.
   *
   * Entity-level participant and message collections are not available from
   * the conversation entity alone.
   *
   * Therefore:
   *
   * - participants is an empty collection;
   * - participantCount is 0;
   * - hasParticipants is false;
   * - messageCount is 0;
   * - hasMessages is false.
   *
   * Application workflows that have the complete aggregate should prefer
   * toResponse().
   */
  public static fromEntity(
    conversation: MessagingConversationEntity,
  ): MessagingConversationResponse {
    if (conversation === undefined || conversation === null) {
      throw new Error('Messaging Conversation entity is required.');
    }

    return this.mapEntity(conversation);
  }

  // ===========================================================================
  // Participant Entity -> Response
  // ===========================================================================

  /**
   * Maps a MessagingConversationParticipantEntity into a safe participant
   * response object.
   *
   * This method remains inside the Conversation response mapper because the
   * participant is owned by MessagingConversationAggregate and is not an
   * aggregate root.
   */
  public static fromParticipantEntity(
    participant: MessagingConversationParticipantEntity,
  ): MessagingConversationParticipantResponse {
    if (participant === undefined || participant === null) {
      throw new Error('Messaging Conversation Participant entity is required.');
    }

    return this.mapParticipant(participant);
  }

  // ===========================================================================
  // Aggregate Mapping
  // ===========================================================================

  /**
   * Maps the Messaging Conversation aggregate.
   *
   * This mapping preserves aggregate-owned participant and message collection
   * state.
   */
  private static mapConversation(
    aggregate: MessagingConversationAggregate,
  ): MessagingConversationResponse {
    const conversation = aggregate.conversation;

    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: conversation.publicId.value,

      journeyPublicId: conversation.journeyPublicId.value,

      bookingPublicId: conversation.bookingPublicId?.value,

      // -----------------------------------------------------------------------
      // Conversation
      // -----------------------------------------------------------------------

      type: conversation.type.value,

      status: conversation.status.value,

      // -----------------------------------------------------------------------
      // Conversation Type Predicates
      // -----------------------------------------------------------------------

      isJourneyConversation: conversation.isJourneyConversation(),

      isDirectConversation: conversation.isDirectConversation(),

      // -----------------------------------------------------------------------
      // Lifecycle Predicates
      // -----------------------------------------------------------------------

      isActive: conversation.isActive(),

      isClosed: conversation.isClosed(),

      isUsable: conversation.isUsable(),

      canBeModified: conversation.canBeModified(),

      canReceiveMessages: conversation.canReceiveMessages(),

      canBeClosed: conversation.canBeClosed(),

      // -----------------------------------------------------------------------
      // Booking State
      // -----------------------------------------------------------------------

      hasBooking: conversation.hasBooking(),

      // -----------------------------------------------------------------------
      // Participant State
      // -----------------------------------------------------------------------

      participantCount: aggregate.participantCount,

      hasParticipants: aggregate.hasParticipants(),

      participants: aggregate.participants.map((participant) =>
        this.mapParticipant(participant),
      ),

      // -----------------------------------------------------------------------
      // Message State
      // -----------------------------------------------------------------------

      messageCount: aggregate.messageCount,

      hasMessages: aggregate.hasMessages(),

      // -----------------------------------------------------------------------
      // Message Activity
      // -----------------------------------------------------------------------

      lastMessageAt:
        conversation.lastMessageAt !== undefined
          ? new Date(conversation.lastMessageAt.getTime())
          : undefined,

      // -----------------------------------------------------------------------
      // Closure
      // -----------------------------------------------------------------------

      closedAt:
        conversation.closedAt !== undefined
          ? new Date(conversation.closedAt.getTime())
          : undefined,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(conversation.createdAt.getTime()),

      updatedAt: new Date(conversation.updatedAt.getTime()),
    };
  }

  // ===========================================================================
  // Entity Mapping
  // ===========================================================================

  /**
   * Maps the Messaging Conversation entity directly.
   *
   * Because participants and messages are aggregate-owned collections, the
   * entity-only response cannot infer their collection state.
   */
  private static mapEntity(
    conversation: MessagingConversationEntity,
  ): MessagingConversationResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: conversation.publicId.value,

      journeyPublicId: conversation.journeyPublicId.value,

      bookingPublicId: conversation.bookingPublicId?.value,

      // -----------------------------------------------------------------------
      // Conversation
      // -----------------------------------------------------------------------

      type: conversation.type.value,

      status: conversation.status.value,

      // -----------------------------------------------------------------------
      // Conversation Type Predicates
      // -----------------------------------------------------------------------

      isJourneyConversation: conversation.isJourneyConversation(),

      isDirectConversation: conversation.isDirectConversation(),

      // -----------------------------------------------------------------------
      // Lifecycle Predicates
      // -----------------------------------------------------------------------

      isActive: conversation.isActive(),

      isClosed: conversation.isClosed(),

      isUsable: conversation.isUsable(),

      canBeModified: conversation.canBeModified(),

      canReceiveMessages: conversation.canReceiveMessages(),

      canBeClosed: conversation.canBeClosed(),

      // -----------------------------------------------------------------------
      // Booking State
      // -----------------------------------------------------------------------

      hasBooking: conversation.hasBooking(),

      // -----------------------------------------------------------------------
      // Participant State
      // -----------------------------------------------------------------------

      participants: [],

      participantCount: 0,

      hasParticipants: false,

      // -----------------------------------------------------------------------
      // Message State
      // -----------------------------------------------------------------------

      messageCount: 0,

      hasMessages: false,

      // -----------------------------------------------------------------------
      // Message Activity
      // -----------------------------------------------------------------------

      lastMessageAt:
        conversation.lastMessageAt !== undefined
          ? new Date(conversation.lastMessageAt.getTime())
          : undefined,

      // -----------------------------------------------------------------------
      // Closure
      // -----------------------------------------------------------------------

      closedAt:
        conversation.closedAt !== undefined
          ? new Date(conversation.closedAt.getTime())
          : undefined,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(conversation.createdAt.getTime()),

      updatedAt: new Date(conversation.updatedAt.getTime()),
    };
  }

  // ===========================================================================
  // Participant Mapping
  // ===========================================================================

  /**
   * Maps a Messaging Conversation Participant entity.
   *
   * The participant's internal `id` and `conversationId` are intentionally
   * excluded from the response.
   */
  private static mapParticipant(
    participant: MessagingConversationParticipantEntity,
  ): MessagingConversationParticipantResponse {
    return {
      // -----------------------------------------------------------------------
      // Identity
      // -----------------------------------------------------------------------

      publicId: participant.publicId.value,

      memberPublicId: participant.memberPublicId.value,

      // -----------------------------------------------------------------------
      // Role
      // -----------------------------------------------------------------------

      role: participant.role.value,

      isProvider: participant.isProvider(),

      isPassenger: participant.isPassenger(),

      // -----------------------------------------------------------------------
      // Lifecycle
      // -----------------------------------------------------------------------

      status: participant.status.value,

      isActive: participant.isActive(),

      hasLeft: participant.hasLeft(),

      isRemoved: participant.isRemoved(),

      isUsable: participant.isUsable(),

      canBeModified: participant.canBeModified(),

      canLeave: participant.canLeave(),

      canBeRemoved: participant.canBeRemoved(),

      canReadMessages: participant.canReadMessages(),

      canSendMessages: participant.canSendMessages(),

      // -----------------------------------------------------------------------
      // Membership
      // -----------------------------------------------------------------------

      joinedAt: new Date(participant.joinedAt.getTime()),

      leftAt:
        participant.leftAt !== undefined
          ? new Date(participant.leftAt.getTime())
          : undefined,

      removedAt:
        participant.removedAt !== undefined
          ? new Date(participant.removedAt.getTime())
          : undefined,

      // -----------------------------------------------------------------------
      // Read State
      // -----------------------------------------------------------------------

      hasReadPosition: participant.hasReadPosition(),

      lastReadAt:
        participant.lastReadAt !== undefined
          ? new Date(participant.lastReadAt.getTime())
          : undefined,

      // -----------------------------------------------------------------------
      // Audit
      // -----------------------------------------------------------------------

      createdAt: new Date(participant.createdAt.getTime()),

      updatedAt: new Date(participant.updatedAt.getTime()),
    };
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default MessagingConversationResponseMapper;
