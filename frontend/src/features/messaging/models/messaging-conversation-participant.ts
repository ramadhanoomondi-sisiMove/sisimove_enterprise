// -----------------------------------------------------------------------------
// SisiMove — Messaging Conversation Participant Model
// -----------------------------------------------------------------------------
//
// Frontend representation of a MessagingConversationParticipant response.
//
// Domain structure:
//
// MessagingConversationAggregate
// └── MessagingConversationParticipantEntity
//
// A participant is a child entity of the Messaging Conversation aggregate.
//
// The frontend receives participant state as a primitive application model.
//
// This model does NOT:
//
// - authorize the participant;
// - determine Journey ownership;
// - determine Booking ownership;
// - mutate participant state;
// - implement participant lifecycle transitions;
// - resolve the Identity/TravellerProfile;
// - resolve conversations.
//
// The backend remains authoritative for participant state and capabilities.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Participant Role
// -----------------------------------------------------------------------------

import type { MessagingParticipantRole } from './messaging-participant-role';

// -----------------------------------------------------------------------------
// Participant Status
// -----------------------------------------------------------------------------

import type { MessagingParticipantStatus } from './messaging-participant-status';

// =============================================================================
// Messaging Conversation Participant
// =============================================================================

/**
 * Application-facing Messaging Conversation Participant model.
 *
 * Mirrors the participant portion of MessagingConversationResponse.
 */
export interface MessagingConversationParticipant {
  // ---------------------------------------------------------------------------
  // Identity
  // ---------------------------------------------------------------------------

  /**
   * Public identifier of this participant entity.
   *
   * This is the participant entity's externally safe identity.
   */
  publicId: string;

  /**
   * Public identifier of the owning Messaging Conversation.
   */
  conversationPublicId: string;

  /**
   * Public identifier of the member represented by this participant.
   */
  memberPublicId: string;

  // ---------------------------------------------------------------------------
  // Participant Role
  // ---------------------------------------------------------------------------

  /**
   * Current participant role.
   */
  role: MessagingParticipantRole;

  /**
   * Indicates whether the participant has the PROVIDER role.
   */
  isProvider: boolean;

  /**
   * Indicates whether the participant has the PASSENGER role.
   */
  isPassenger: boolean;

  // ---------------------------------------------------------------------------
  // Participant Lifecycle
  // ---------------------------------------------------------------------------

  /**
   * Current participant lifecycle status.
   */
  status: MessagingParticipantStatus;

  /**
   * Indicates whether the participant is currently active.
   */
  isActive: boolean;

  /**
   * Indicates whether the participant has voluntarily left.
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
   * Indicates whether participant state can currently be modified.
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
  // Read State
  // ---------------------------------------------------------------------------

  /**
   * Indicates whether a read position has been recorded.
   */
  hasReadPosition: boolean;

  /**
   * Timestamp through which the participant has read the conversation.
   *
   * Undefined when no read position has been recorded.
   */
  lastReadAt: Date | undefined;

  // ---------------------------------------------------------------------------
  // Lifecycle Timestamps
  // ---------------------------------------------------------------------------

  /**
   * Timestamp at which the participant joined the conversation.
   */
  joinedAt: Date;

  /**
   * Timestamp at which the participant left the conversation.
   */
  leftAt: Date | undefined;

  /**
   * Timestamp at which the participant was removed.
   */
  removedAt: Date | undefined;

  /**
   * Timestamp at which the participant entity was created.
   */
  createdAt: Date;

  /**
   * Timestamp at which the participant entity was last updated.
   */
  updatedAt: Date;
}