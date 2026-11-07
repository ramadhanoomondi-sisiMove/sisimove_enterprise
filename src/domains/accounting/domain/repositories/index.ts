// -----------------------------------------------------------------------------
// Accounting — Repository Exports
// -----------------------------------------------------------------------------
//
// Central export surface for Accounting repository contracts.
//
// Repositories:
//
// - AccountingAccountRepository
// - AccountingCalendarRepository
// - AccountingPeriodRepository
// - AccountingJournalRepository
//
// Infrastructure implementations depend on these contracts without exposing
// Prisma or other persistence concerns to the Accounting domain.
//
// -----------------------------------------------------------------------------

export type { AccountingAccountRepository } from './accounting-account.repository';
export type { AccountingCalendarRepository } from './accounting-calendar.repository';
export type { default as AccountingPeriodRepository } from './accounting-period.repository';
export type { default as AccountingJournalRepository } from './accounting-journal.repository';
