// -----------------------------------------------------------------------------
// Journey Completion — Dependency Injection Tokens
// -----------------------------------------------------------------------------

export const JOURNEY_COMPLETION_TOKENS = {
  // ===========================================================================
  // Repository
  // ===========================================================================

  REPOSITORY: Symbol('JourneyCompletionRepository'),

  // ===========================================================================
  // Command Handlers
  // ===========================================================================

  COMMAND_HANDLERS: {
    // -------------------------------------------------------------------------
    // Journey Completion Lifecycle
    // -------------------------------------------------------------------------

    CREATE: Symbol('CreateJourneyCompletionHandler'),

    REQUEST: Symbol('RequestJourneyCompletionHandler'),

    CONFIRM: Symbol('ConfirmJourneyCompletionHandler'),

    CANCEL: Symbol('CancelJourneyCompletionHandler'),

    // -------------------------------------------------------------------------
    // Confirmation
    // -------------------------------------------------------------------------

    WITHDRAW_CONFIRMATION: Symbol(
      'WithdrawJourneyCompletionConfirmationHandler',
    ),

    // -------------------------------------------------------------------------
    // Dispute
    // -------------------------------------------------------------------------

    OPEN_DISPUTE: Symbol('OpenJourneyCompletionDisputeHandler'),

    REVIEW_DISPUTE: Symbol('ReviewJourneyCompletionDisputeHandler'),

    RESOLVE_DISPUTE: Symbol('ResolveJourneyCompletionDisputeHandler'),

    REJECT_DISPUTE: Symbol('RejectJourneyCompletionDisputeHandler'),

    WITHDRAW_DISPUTE: Symbol('WithdrawJourneyCompletionDisputeHandler'),
  } as const,

  // ===========================================================================
  // Query Handlers
  // ===========================================================================

  QUERY_HANDLERS: {
    // -------------------------------------------------------------------------
    // Journey Completion
    // -------------------------------------------------------------------------

    GET: Symbol('GetJourneyCompletionHandler'),

    GET_BY_JOURNEY: Symbol('GetJourneyCompletionByJourneyHandler'),

    LIST: Symbol('ListJourneyCompletionsHandler'),

    LIST_BY_PROVIDER: Symbol('ListJourneyCompletionsByProviderHandler'),

    LIST_BY_STATUS: Symbol('ListJourneyCompletionsByStatusHandler'),

    // -------------------------------------------------------------------------
    // Journey Completion Confirmations
    // -------------------------------------------------------------------------

    GET_CONFIRMATIONS: Symbol('GetJourneyCompletionConfirmationsHandler'),

    GET_CONFIRMATION: Symbol('GetJourneyCompletionConfirmationHandler'),

    // -------------------------------------------------------------------------
    // Journey Completion Disputes
    // -------------------------------------------------------------------------

    GET_DISPUTES: Symbol('GetJourneyCompletionDisputesHandler'),

    GET_DISPUTE: Symbol('GetJourneyCompletionDisputeHandler'),
  } as const,
} as const;
