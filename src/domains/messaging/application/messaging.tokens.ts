// -----------------------------------------------------------------------------
// Messaging — Application DI Tokens
// -----------------------------------------------------------------------------
//
// Central dependency-injection tokens for the Messaging application layer.
//
// Covers:
//
// - repositories;
// - command handlers;
// - query handlers.
//
// Aggregate boundaries:
//
// MessagingConversationAggregate
// ├── MessagingConversationEntity
// ├── MessagingConversationParticipantEntity[]
// └── MessagingMessageEntity[]
//
// MessagingMessageAggregate
// └── MessagingMessageEntity
//
// IMPORTANT:
//
// Messaging is responsible for:
//
// - conversation lifecycle;
// - conversation participant lifecycle;
// - conversation read state;
// - message lifecycle;
// - message content editing;
// - message deletion;
// - message moderation state;
// - Messaging domain event recording.
//
// Repository implementations are provided by infrastructure.
//
// The application layer depends only on repository abstractions and MUST NOT
// import concrete persistence implementations directly.
//
// Concrete infrastructure implementations are bound to these tokens by the
// infrastructure dependency-injection layer.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Messaging Tokens
// =============================================================================

export const MESSAGING_TOKENS = {
  // ===========================================================================
  // Repositories
  // ===========================================================================

  REPOSITORIES: {
    /**
     * Messaging Conversation aggregate repository.
     *
     * Infrastructure provides the concrete persistence implementation.
     */
    MESSAGING_CONVERSATION: Symbol('MessagingConversationRepository'),

    /**
     * Messaging Message aggregate repository.
     *
     * Infrastructure provides the concrete persistence implementation.
     */
    MESSAGING_MESSAGE: Symbol('MessagingMessageRepository'),
  } as const,

  // ===========================================================================
  // Command Handlers
  // ===========================================================================

  COMMAND_HANDLERS: {
    // =========================================================================
    // Messaging Conversation
    // =========================================================================

    /**
     * Creates a Messaging Conversation aggregate.
     */
    CREATE_MESSAGING_CONVERSATION: Symbol('CreateMessagingConversationHandler'),

    /**
     * Closes a Messaging Conversation.
     */
    CLOSE_MESSAGING_CONVERSATION: Symbol('CloseMessagingConversationHandler'),

    // =========================================================================
    // Messaging Conversation Participants
    // =========================================================================

    /**
     * Adds a participant to a Messaging Conversation.
     */
    ADD_MESSAGING_PARTICIPANT: Symbol('AddMessagingParticipantHandler'),

    /**
     * Allows a participant to leave a Messaging Conversation.
     */
    LEAVE_MESSAGING_CONVERSATION: Symbol('LeaveMessagingConversationHandler'),

    /**
     * Removes a participant from a Messaging Conversation.
     */
    REMOVE_MESSAGING_PARTICIPANT: Symbol('RemoveMessagingParticipantHandler'),

    /**
     * Marks a Messaging Conversation as read for a participant.
     */
    MARK_MESSAGING_CONVERSATION_READ: Symbol(
      'MarkMessagingConversationReadHandler',
    ),

    // =========================================================================
    // Messaging Message
    // =========================================================================

    /**
     * Sends a Messaging Message.
     */
    SEND_MESSAGING_MESSAGE: Symbol('SendMessagingMessageHandler'),

    /**
     * Edits a Messaging Message.
     */
    EDIT_MESSAGING_MESSAGE: Symbol('EditMessagingMessageHandler'),

    /**
     * Deletes a Messaging Message.
     */
    DELETE_MESSAGING_MESSAGE: Symbol('DeleteMessagingMessageHandler'),

    /**
     * Marks a Messaging Message as moderated.
     *
     * The moderation decision itself belongs to the appropriate application
     * or moderation workflow.
     */
    MODERATE_MESSAGING_MESSAGE: Symbol('ModerateMessagingMessageHandler'),
  } as const,

  // ===========================================================================
  // Query Handlers
  // ===========================================================================

  QUERY_HANDLERS: {
    // =========================================================================
    // Messaging Conversation
    // =========================================================================

    /**
     * Retrieves a Messaging Conversation aggregate by public ID.
     */
    GET_MESSAGING_CONVERSATION: Symbol('GetMessagingConversationHandler'),

    /**
     * Retrieves Messaging Conversations using general query criteria.
     */
    GET_MESSAGING_CONVERSATIONS: Symbol('GetMessagingConversationsHandler'),

    /**
     * Retrieves a Messaging Conversation associated with a Journey.
     */
    GET_MESSAGING_CONVERSATION_BY_JOURNEY: Symbol(
      'GetMessagingConversationByJourneyHandler',
    ),

    /**
     * Retrieves a Messaging Conversation associated with a Booking.
     */
    GET_MESSAGING_CONVERSATION_BY_BOOKING: Symbol(
      'GetMessagingConversationByBookingHandler',
    ),

    // =========================================================================
    // Messaging Message
    // =========================================================================

    /**
     * Retrieves a Messaging Message aggregate by public ID.
     */
    GET_MESSAGING_MESSAGE: Symbol('GetMessagingMessageHandler'),

    /**
     * Retrieves Messaging Messages using general query criteria.
     */
    GET_MESSAGING_MESSAGES: Symbol('GetMessagingMessagesHandler'),
  } as const,
} as const;

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default MESSAGING_TOKENS;
