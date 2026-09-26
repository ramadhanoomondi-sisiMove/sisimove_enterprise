// -----------------------------------------------------------------------------
// SisiMove — Messaging Conversation Model
// -----------------------------------------------------------------------------
//
// Frontend representation of the application-facing
// MessagingConversationResponse.
//
// Backend aggregate:
//
// MessagingConversationAggregate
// ├── MessagingConversationEntity
// ├── MessagingConversationParticipantEntity[]
// └── MessagingMessageEntity[]
//
// The frontend model exposes the aggregate's safe application-facing state.
//
// The backend remains authoritative for:
//
// - conversation lifecycle;
// - participant lifecycle;
// - message lifecycle;
// - capability predicates;
// - participant membership;
// - message counts;
// - timestamps.
//
// This model does NOT:
//
// - recreate aggregate invariants;
// - authorize actions;
// - mutate participants;
// - mutate messages;
// - validate Journey references;
// - validate Booking references;
// - resolve Journey data;
// - resolve Booking data;
// - resolve member profiles.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Conversation Type
// -----------------------------------------------------------------------------

import type { MessagingConversationType } from './messaging-conversation-type';

// -----------------------------------------------------------------------------
// Conversation Status
// -----------------------------------------------------------------------------

import type { MessagingConversationStatus } from './messaging-conversation-status';

// -----------------------------------------------------------------------------
// Participant
// -----------------------------------------------------------------------------

import type { MessagingConversationParticipant } from './messaging-conversation-participant';

// -----------------------------------------------------------------------------
// Message
// -----------------------------------------------------------------------------

import type { MessagingMessage } from './messaging-message';

// =============================================================================
// Messaging Conversation
// =============================================================================

/**
 * Application-facing Messaging Conversation model.
 *
 * Mirrors the backend MessagingConversationResponse contract.
 */
export interface MessagingConversation {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Messaging Conversation.
   */
  publicId: string;

  // ---------------------------------------------------------------------------
  // Context References
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of the Journey associated with this conversation.
   */
  journeyPublicId: string;

  /**
   * Optional public identifier of the associated Booking.
   *
   * A conversation may exist before a Booking reference is assigned.
   */
  bookingPublicId: string | undefined;

  // ---------------------------------------------------------------------------
  // Conversation
  // ---------------------------------------------------------------------------

  /**
   * Messaging Conversation type.
   */
  type: MessagingConversationType;

  /**
   * Current Messaging Conversation lifecycle status.
   */
  status: MessagingConversationStatus;

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
  // Conversation Lifecycle Predicates
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether the conversation is currently active.
   */
  isActive: boolean;

  /**
   * Indicates whether the conversation has been closed.
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
  // Booking
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether this conversation currently has a Booking reference.
   */
  hasBooking: boolean;

  // ---------------------------------------------------------------------------
  // Participants
  // ---------------------------------------------------------------------------

  /**
   * Participants belonging to the conversation.
   *
   * The backend response may provide an empty collection when the query does
   * not include participant data.
   */
  participants: MessagingConversationParticipant[];

  /**
   * Number of participants represented by the response.
   */
  participantCount: number;

  /**
   * Indicates whether participants are present in the response.
   */
  hasParticipants: boolean;

  // ---------------------------------------------------------------------------
  // Messages
  // ---------------------------------------------------------------------------

  /**
   * Messages represented by the response.
   *
   * The conversation response may contain an empty collection when messages
   * are not included by the particular read workflow.
   */
  messages: MessagingMessage[];

  /**
   * Number of messages represented by the response.
   */
  messageCount: number;

  /**
   * Indicates whether messages are present in the response.
   */
  hasMessages: boolean;

  // ---------------------------------------------------------------------------
  // Activity
  // ---------------------------------------------------------------------------

  /**
   * Timestamp of the most recent message activity.
   *
   * Undefined when no message activity has occurred.
   */
  lastMessageAt: Date | undefined;

  // ---------------------------------------------------------------------------
  // Lifecycle Timestamps
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the conversation was closed.
   *
   * Undefined while the conversation remains active.
   */
  closedAt: Date | undefined;

  /**
   * Timestamp at which the conversation was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the conversation was last updated.
   */
  updatedAt: Date;
}