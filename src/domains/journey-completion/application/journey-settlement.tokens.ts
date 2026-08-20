// -----------------------------------------------------------------------------
// Journey Settlement — Dependency Injection Tokens
// -----------------------------------------------------------------------------

export const JOURNEY_SETTLEMENT_TOKENS = {
  // ===========================================================================
  // Repository
  // ===========================================================================

  REPOSITORY: Symbol('JourneySettlementRepository'),

  // ===========================================================================
  // Command Handlers
  // ===========================================================================

  COMMAND_HANDLERS: {
    // -------------------------------------------------------------------------
    // Journey Settlement Lifecycle
    // -------------------------------------------------------------------------

    CREATE: Symbol('CreateJourneySettlementHandler'),

    SUBMIT: Symbol('SubmitJourneySettlementHandler'),

    PROCESS: Symbol('ProcessJourneySettlementHandler'),

    COMPLETE: Symbol('CompleteJourneySettlementHandler'),

    FAIL: Symbol('FailJourneySettlementHandler'),

    HOLD: Symbol('HoldJourneySettlementHandler'),

    CANCEL: Symbol('CancelJourneySettlementHandler'),
  } as const,

  // ===========================================================================
  // Query Handlers
  // ===========================================================================

  QUERY_HANDLERS: {
    // -------------------------------------------------------------------------
    // Journey Settlement
    // -------------------------------------------------------------------------

    GET: Symbol('GetJourneySettlementHandler'),

    GET_BY_COMPLETION: Symbol('GetJourneySettlementByCompletionHandler'),

    LIST: Symbol('ListJourneySettlementsHandler'),
  } as const,
} as const;
