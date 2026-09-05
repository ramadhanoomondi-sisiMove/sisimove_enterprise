// -----------------------------------------------------------------------------
// Accounting Domain — Exceptions
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Root Exception
// -----------------------------------------------------------------------------

export { AccountingException } from './accounting.exception';

// -----------------------------------------------------------------------------
// Accounting Account Exceptions
// -----------------------------------------------------------------------------

export { AccountingAccountNotFoundException } from './accounting-account-not-found.exception';

export { AccountingAccountAlreadyExistsException } from './accounting-account-already-exists.exception';

export { AccountingAccountInvalidStatusException } from './accounting-account-invalid-status.exception';

export { AccountingAccountClosedException } from './accounting-account-closed.exception';

// -----------------------------------------------------------------------------
// Accounting Period Exceptions
// -----------------------------------------------------------------------------

export { AccountingPeriodNotFoundException } from './accounting-period-not-found.exception';

export { AccountingPeriodAlreadyClosedException } from './accounting-period-already-closed.exception';

// -----------------------------------------------------------------------------
// Accounting Journal Exceptions
// -----------------------------------------------------------------------------

export { AccountingJournalNotFoundException } from './accounting-journal-not-found.exception';

export { AccountingJournalInvalidStatusException } from './accounting-journal-invalid-status.exception';

export { AccountingJournalAlreadyPostedException } from './accounting-journal-already-posted.exception';

export { AccountingJournalAlreadyReversedException } from './accounting-journal-already-reversed.exception';

export { AccountingJournalNotBalancedException } from './accounting-journal-not-balanced.exception';

export { AccountingJournalEmptyException } from './accounting-journal-empty.exception';
