// -----------------------------------------------------------------------------
// Accounting — Aggregate Exports
// -----------------------------------------------------------------------------
//
// Central export surface for Accounting domain aggregates.
//
// Aggregates:
//
// - AccountingAccountAggregate
// - AccountingPeriodAggregate
// - AccountingJournalAggregate
//
// -----------------------------------------------------------------------------

export { default as AccountingAccountAggregate } from './accounting-account.aggregate';
export { default as AccountingPeriodAggregate } from './accounting-period.aggregate';
export { AccountingJournalAggregate } from './accounting-journal.aggregate';
