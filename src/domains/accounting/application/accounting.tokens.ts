// -----------------------------------------------------------------------------
// Accounting — Application DI Tokens
// -----------------------------------------------------------------------------
//
// Central dependency-injection tokens for the Accounting application layer.
//
// Covers:
//
// - repositories;
// - command handlers;
// - query handlers.
//
// Aggregate boundaries:
//
// AccountingAccountAggregate
// └── AccountingAccountEntity
//
// AccountingPeriodAggregate
// └── AccountingPeriodEntity
//
// AccountingJournalAggregate
// └── AccountingJournalEntity
//     └── AccountingJournalEntryEntity
//         └── AccountingJournalLineEntity
//
// IMPORTANT:
//
// Accounting is responsible for:
//
// - chart-of-accounts lifecycle;
// - accounting-period lifecycle;
// - journal creation;
// - journal entry composition;
// - journal-line composition;
// - journal balancing;
// - journal posting;
// - journal reversal.
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
// Accounting Tokens
// =============================================================================

export const ACCOUNTING_TOKENS = {
  // ===========================================================================
  // Repositories
  // ===========================================================================

  REPOSITORIES: {
    /**
     * Accounting Account aggregate repository.
     *
     * Infrastructure provides the concrete persistence implementation.
     */
    ACCOUNTING_ACCOUNT: Symbol('AccountingAccountRepository'),

    /**
     * Accounting Period aggregate repository.
     *
     * Infrastructure provides the concrete persistence implementation.
     */
    ACCOUNTING_PERIOD: Symbol('AccountingPeriodRepository'),

    /**
     * Accounting Journal aggregate repository.
     *
     * Infrastructure provides the concrete persistence implementation.
     */
    ACCOUNTING_JOURNAL: Symbol('AccountingJournalRepository'),
  } as const,

  // ===========================================================================
  // Command Handlers
  // ===========================================================================

  COMMAND_HANDLERS: {
    // =========================================================================
    // Accounting Account
    // =========================================================================

    /**
     * Creates an Accounting Account aggregate.
     */
    CREATE_ACCOUNTING_ACCOUNT: Symbol('CreateAccountingAccountHandler'),

    /**
     * Updates an Accounting Account aggregate.
     */
    UPDATE_ACCOUNTING_ACCOUNT: Symbol('UpdateAccountingAccountHandler'),

    /**
     * Activates an Accounting Account.
     */
    ACTIVATE_ACCOUNTING_ACCOUNT: Symbol('ActivateAccountingAccountHandler'),

    /**
     * Inactivates an Accounting Account.
     */
    INACTIVATE_ACCOUNTING_ACCOUNT: Symbol('InactivateAccountingAccountHandler'),

    /**
     * Closes an Accounting Account.
     */
    CLOSE_ACCOUNTING_ACCOUNT: Symbol('CloseAccountingAccountHandler'),

    // =========================================================================
    // Accounting Period
    // =========================================================================

    /**
     * Creates and opens an Accounting Period aggregate.
     */
    CREATE_ACCOUNTING_PERIOD: Symbol('CreateAccountingPeriodHandler'),

    /**
     * Closes an Accounting Period.
     */
    CLOSE_ACCOUNTING_PERIOD: Symbol('CloseAccountingPeriodHandler'),

    // =========================================================================
    // Accounting Journal
    // =========================================================================

    /**
     * Creates an Accounting Journal aggregate.
     */
    CREATE_ACCOUNTING_JOURNAL: Symbol('CreateAccountingJournalHandler'),

    /**
     * Adds an Accounting Journal Entry to an Accounting Journal.
     */
    ADD_ACCOUNTING_JOURNAL_ENTRY: Symbol('AddAccountingJournalEntryHandler'),

    /**
     * Adds an Accounting Journal Line to an Accounting Journal Entry.
     */
    ADD_ACCOUNTING_JOURNAL_LINE: Symbol('AddAccountingJournalLineHandler'),

    /**
     * Posts an Accounting Journal.
     *
     * The aggregate is responsible for enforcing journal posting invariants,
     * including journal balancing.
     */
    POST_ACCOUNTING_JOURNAL: Symbol('PostAccountingJournalHandler'),

    /**
     * Reverses an Accounting Journal.
     */
    REVERSE_ACCOUNTING_JOURNAL: Symbol('ReverseAccountingJournalHandler'),
  } as const,

  // ===========================================================================
  // Query Handlers
  // ===========================================================================

  QUERY_HANDLERS: {
    // =========================================================================
    // Accounting Account
    // =========================================================================

    /**
     * Retrieves an Accounting Account aggregate by public ID.
     */
    GET_ACCOUNTING_ACCOUNT: Symbol('GetAccountingAccountHandler'),

    /**
     * Retrieves Accounting Accounts using general query criteria.
     */
    GET_ACCOUNTING_ACCOUNTS: Symbol('GetAccountingAccountsHandler'),

    /**
     * Retrieves an Accounting Account by account code.
     */
    GET_ACCOUNTING_ACCOUNT_BY_CODE: Symbol('GetAccountingAccountByCodeHandler'),

    // =========================================================================
    // Accounting Period
    // =========================================================================

    /**
     * Retrieves an Accounting Period aggregate by public ID.
     */
    GET_ACCOUNTING_PERIOD: Symbol('GetAccountingPeriodHandler'),

    /**
     * Retrieves Accounting Periods using general query criteria.
     */
    GET_ACCOUNTING_PERIODS: Symbol('GetAccountingPeriodsHandler'),

    // =========================================================================
    // Accounting Journal
    // =========================================================================

    /**
     * Retrieves an Accounting Journal aggregate by public ID.
     */
    GET_ACCOUNTING_JOURNAL: Symbol('GetAccountingJournalHandler'),

    /**
     * Retrieves Accounting Journals using general query criteria.
     */
    GET_ACCOUNTING_JOURNALS: Symbol('GetAccountingJournalsHandler'),

    /**
     * Retrieves Accounting Journals associated with a source reference.
     */
    GET_ACCOUNTING_JOURNALS_BY_SOURCE: Symbol(
      'GetAccountingJournalsBySourceHandler',
    ),
  } as const,
} as const;

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default ACCOUNTING_TOKENS;
