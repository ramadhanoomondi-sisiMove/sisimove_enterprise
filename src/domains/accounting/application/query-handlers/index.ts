// -----------------------------------------------------------------------------
// Accounting — Query Handlers
// -----------------------------------------------------------------------------
//
// Barrel exports for all Accounting application query handlers.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Accounting Account
// -----------------------------------------------------------------------------

export { default as GetAccountingAccountHandler } from './get-accounting-account.handler';

export { default as GetAccountingAccountsHandler } from './get-accounting-accounts.handler';

export { default as GetAccountingAccountByCodeHandler } from './get-accounting-account-by-code.handler';

// -----------------------------------------------------------------------------
// Accounting Period
// -----------------------------------------------------------------------------

export { default as GetAccountingPeriodHandler } from './get-accounting-period.handler';

export { default as GetAccountingPeriodsHandler } from './get-accounting-periods.handler';

// -----------------------------------------------------------------------------
// Accounting Journal
// -----------------------------------------------------------------------------

export { default as GetAccountingJournalHandler } from './get-accounting-journal.handler';

export { default as GetAccountingJournalsHandler } from './get-accounting-journals.handler';

export { default as GetAccountingJournalsBySourceHandler } from './get-accounting-journals-by-source.handler';
