// -----------------------------------------------------------------------------
// Accounting — Request DTOs
// -----------------------------------------------------------------------------
//
// Barrel export for Accounting HTTP request DTOs.
//
// This module exposes the complete Accounting request DTO surface while
// keeping individual DTO implementations in their respective files.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Accounting Account
// -----------------------------------------------------------------------------

export { CreateAccountingAccountRequestDto } from './create-accounting-account.request.dto';

export { UpdateAccountingAccountRequestDto } from './update-accounting-account.request.dto';

export { CloseAccountingAccountRequestDto } from './close-accounting-account.request.dto';

export { ActivateAccountingAccountRequestDto } from './activate-accounting-account.request.dto';

export { InactivateAccountingAccountRequestDto } from './inactivate-accounting-account.request.dto';

// -----------------------------------------------------------------------------
// Accounting Period
// -----------------------------------------------------------------------------

export { CreateAccountingPeriodRequestDto } from './create-accounting-period.request.dto';

export { CloseAccountingPeriodRequestDto } from './close-accounting-period.request.dto';

// -----------------------------------------------------------------------------
// Accounting Journal
// -----------------------------------------------------------------------------

export { CreateAccountingJournalRequestDto } from './create-accounting-journal.request.dto';

export { AddAccountingJournalEntryRequestDto } from './add-accounting-journal-entry.request.dto';

export { AddAccountingJournalLineRequestDto } from './add-accounting-journal-line.request.dto';

export { PostAccountingJournalRequestDto } from './post-accounting-journal.request.dto';

export { ReverseAccountingJournalRequestDto } from './reverse-accounting-journal.request.dto';
