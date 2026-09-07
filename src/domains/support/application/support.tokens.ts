// -----------------------------------------------------------------------------
// Support — Application DI Tokens
// -----------------------------------------------------------------------------
//
// Central dependency-injection tokens for the Support application layer.
//
// Covers:
//
// - repositories;
// - command handlers;
// - query handlers.
//
// Aggregate boundary:
//
// SupportCaseAggregate
// ├── SupportCaseEntity
// ├── SupportCaseParticipantEntity[]
// ├── SupportCaseMessageEntity[]
// ├── SupportCaseNoteEntity[]
// ├── SupportCaseEvidenceEntity[]
// └── SupportCaseResolutionEntity?
//
// IMPORTANT:
//
// Support is responsible for:
//
// - Support Case lifecycle;
// - Support Case assignment;
// - Support Case priority and category;
// - Support Case participant lifecycle;
// - Support Case message lifecycle;
// - Support Case note lifecycle;
// - Support Case evidence lifecycle;
// - Support Case resolution lifecycle;
// - Support Case domain event recording.
//
// The SupportCaseEntity is the aggregate root.
//
// Child entities are owned by the SupportCaseAggregate and are therefore
// persisted and rehydrated through the SupportCaseRepository.
//
// The application layer depends only on repository abstractions and MUST NOT
// import concrete persistence implementations directly.
//
// Concrete infrastructure implementations are bound to these tokens by the
// infrastructure dependency-injection layer.
//
// Cross-domain references such as member, identity, asset, journey, booking,
// payment, or other domain public IDs remain opaque to Support.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Support Tokens
// =============================================================================

export const SUPPORT_TOKENS = {
  // ===========================================================================
  // Repositories
  // ===========================================================================

  REPOSITORIES: {
    // =========================================================================
    // Support Case
    // =========================================================================

    /**
     * Support Case aggregate repository.
     *
     * Infrastructure provides the concrete persistence implementation.
     *
     * The repository is responsible for persisting and rehydrating the
     * complete SupportCaseAggregate, including its owned child entities.
     */
    SUPPORT_CASE: Symbol('SupportCaseRepository'),
  } as const,

  // ===========================================================================
  // Command Handlers
  // ===========================================================================

  COMMAND_HANDLERS: {
    // =========================================================================
    // Support Case lifecycle
    // =========================================================================

    /**
     * Creates a Support Case aggregate.
     */
    CREATE_SUPPORT_CASE: Symbol('CreateSupportCaseHandler'),

    /**
     * Assigns a Support Case to an internal member.
     */
    ASSIGN_SUPPORT_CASE: Symbol('AssignSupportCaseHandler'),

    /**
     * Removes the current assignee from a Support Case.
     */
    UNASSIGN_SUPPORT_CASE: Symbol('UnassignSupportCaseHandler'),

    /**
     * Changes the priority of a Support Case.
     */
    CHANGE_SUPPORT_CASE_PRIORITY: Symbol('ChangeSupportCasePriorityHandler'),

    /**
     * Changes the category of a Support Case.
     */
    CHANGE_SUPPORT_CASE_CATEGORY: Symbol('ChangeSupportCaseCategoryHandler'),

    /**
     * Starts work on a Support Case.
     */
    START_SUPPORT_CASE: Symbol('StartSupportCaseHandler'),

    /**
     * Places a Support Case into a waiting-for-member state.
     */
    WAIT_FOR_MEMBER_SUPPORT_CASE: Symbol('WaitForMemberSupportCaseHandler'),

    /**
     * Places a Support Case into a waiting-for-internal-action state.
     */
    WAIT_FOR_INTERNAL_ACTION_SUPPORT_CASE: Symbol(
      'WaitForInternalActionSupportCaseHandler',
    ),

    /**
     * Resolves a Support Case.
     */
    RESOLVE_SUPPORT_CASE: Symbol('ResolveSupportCaseHandler'),

    /**
     * Closes a Support Case.
     */
    CLOSE_SUPPORT_CASE: Symbol('CloseSupportCaseHandler'),

    /**
     * Cancels a Support Case.
     */
    CANCEL_SUPPORT_CASE: Symbol('CancelSupportCaseHandler'),

    // =========================================================================
    // Support Case participants
    // =========================================================================

    /**
     * Adds a participant to a Support Case.
     */
    ADD_SUPPORT_CASE_PARTICIPANT: Symbol('AddSupportCaseParticipantHandler'),

    /**
     * Removes a participant from a Support Case.
     */
    REMOVE_SUPPORT_CASE_PARTICIPANT: Symbol(
      'RemoveSupportCaseParticipantHandler',
    ),

    // =========================================================================
    // Support Case messages
    // =========================================================================

    /**
     * Adds a message to a Support Case.
     */
    ADD_SUPPORT_CASE_MESSAGE: Symbol('AddSupportCaseMessageHandler'),

    /**
     * Edits a Support Case message.
     */
    EDIT_SUPPORT_CASE_MESSAGE: Symbol('EditSupportCaseMessageHandler'),

    /**
     * Deletes a Support Case message.
     */
    DELETE_SUPPORT_CASE_MESSAGE: Symbol('DeleteSupportCaseMessageHandler'),

    // =========================================================================
    // Support Case notes
    // =========================================================================

    /**
     * Adds an internal note to a Support Case.
     */
    ADD_SUPPORT_CASE_NOTE: Symbol('AddSupportCaseNoteHandler'),

    // =========================================================================
    // Support Case evidence
    // =========================================================================

    /**
     * Adds evidence to a Support Case.
     */
    ADD_SUPPORT_CASE_EVIDENCE: Symbol('AddSupportCaseEvidenceHandler'),

    // =========================================================================
    // Support Case resolution
    // =========================================================================

    /**
     * Creates a resolution for a Support Case.
     *
     * Creating the resolution does not itself transition the case to RESOLVED.
     * The aggregate's resolve operation controls that lifecycle transition.
     */
    CREATE_SUPPORT_CASE_RESOLUTION: Symbol(
      'CreateSupportCaseResolutionHandler',
    ),
  } as const,

  // ===========================================================================
  // Query Handlers
  // ===========================================================================

  QUERY_HANDLERS: {
    // =========================================================================
    // Support Case
    // =========================================================================

    /**
     * Retrieves a Support Case by public ID.
     */
    GET_SUPPORT_CASE: Symbol('GetSupportCaseHandler'),

    /**
     * Retrieves Support Cases using general query criteria.
     */
    GET_SUPPORT_CASES: Symbol('GetSupportCasesHandler'),

    /**
     * Retrieves Support Cases belonging to a requester.
     */
    GET_SUPPORT_CASES_BY_REQUESTER: Symbol('GetSupportCasesByRequesterHandler'),

    /**
     * Retrieves Support Cases assigned to an internal member.
     */
    GET_SUPPORT_CASES_BY_ASSIGNEE: Symbol('GetSupportCasesByAssigneeHandler'),

    /**
     * Retrieves Support Cases associated with a reference.
     */
    GET_SUPPORT_CASES_BY_REFERENCE: Symbol('GetSupportCasesByReferenceHandler'),

    /**
     * Retrieves Support Cases by lifecycle status.
     */
    GET_SUPPORT_CASES_BY_STATUS: Symbol('GetSupportCasesByStatusHandler'),

    /**
     * Retrieves Support Cases by category.
     */
    GET_SUPPORT_CASES_BY_CATEGORY: Symbol('GetSupportCasesByCategoryHandler'),

    /**
     * Retrieves Support Cases by priority.
     */
    GET_SUPPORT_CASES_BY_PRIORITY: Symbol('GetSupportCasesByPriorityHandler'),

    // =========================================================================
    // Support Case messages
    // =========================================================================

    /**
     * Retrieves messages belonging to a Support Case.
     */
    GET_SUPPORT_CASE_MESSAGES: Symbol('GetSupportCaseMessagesHandler'),

    // =========================================================================
    // Support Case participants
    // =========================================================================

    /**
     * Retrieves participants belonging to a Support Case.
     */
    GET_SUPPORT_CASE_PARTICIPANTS: Symbol('GetSupportCaseParticipantsHandler'),

    // =========================================================================
    // Support Case notes
    // =========================================================================

    /**
     * Retrieves internal notes belonging to a Support Case.
     */
    GET_SUPPORT_CASE_NOTES: Symbol('GetSupportCaseNotesHandler'),

    // =========================================================================
    // Support Case evidence
    // =========================================================================

    /**
     * Retrieves evidence belonging to a Support Case.
     */
    GET_SUPPORT_CASE_EVIDENCE: Symbol('GetSupportCaseEvidenceHandler'),

    // =========================================================================
    // Support Case resolution
    // =========================================================================

    /**
     * Retrieves the resolution belonging to a Support Case.
     *
     * A Support Case can have at most one resolution.
     */
    GET_SUPPORT_CASE_RESOLUTION: Symbol('GetSupportCaseResolutionHandler'),
  } as const,
} as const;

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default SUPPORT_TOKENS;
