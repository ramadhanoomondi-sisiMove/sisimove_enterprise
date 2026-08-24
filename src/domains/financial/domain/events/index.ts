// -----------------------------------------------------------------------------
// Financial Domain Events
// -----------------------------------------------------------------------------
//
// Central export surface for Financial domain events.
//
// Covers:
// - Financial Account events
// - Financial Transaction events
// - Financial Payment events
// - Financial Payment Method events
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Base
// -----------------------------------------------------------------------------

export { FinancialDomainEvent } from './financial-domain.event';

// -----------------------------------------------------------------------------
// Financial Account
// -----------------------------------------------------------------------------

export { FinancialAccountCreatedEvent } from './financial-account-created.event';

export { FinancialAccountActivatedEvent } from './financial-account-activated.event';

export { FinancialAccountSuspendedEvent } from './financial-account-suspended.event';

export { FinancialAccountClosedEvent } from './financial-account-closed.event';

// -----------------------------------------------------------------------------
// Financial Transaction
// -----------------------------------------------------------------------------

export { FinancialTransactionCreatedEvent } from './financial-transaction-created.event';

export { FinancialTransactionCompletedEvent } from './financial-transaction-completed.event';

export { FinancialTransactionFailedEvent } from './financial-transaction-failed.event';

export { FinancialTransactionReversedEvent } from './financial-transaction-reversed.event';

export { FinancialTransactionCancelledEvent } from './financial-transaction-cancelled.event';

// -----------------------------------------------------------------------------
// Financial Payment
// -----------------------------------------------------------------------------

export { FinancialPaymentCreatedEvent } from './financial-payment-created.event';

export { FinancialPaymentAttemptAddedEvent } from './financial-payment-attempt-added.event';

export { FinancialPaymentProcessingEvent } from './financial-payment-processing.event';

export { FinancialPaymentSucceededEvent } from './financial-payment-succeeded.event';

export { FinancialPaymentFailedEvent } from './financial-payment-failed.event';

export { FinancialPaymentCancelledEvent } from './financial-payment-cancelled.event';

export { FinancialPaymentExpiredEvent } from './financial-payment-expired.event';

export { FinancialPaymentTransactionLinkedEvent } from './financial-payment-transaction-linked.event';

// -----------------------------------------------------------------------------
// Financial Payment Method
// -----------------------------------------------------------------------------

export { FinancialPaymentMethodAddedEvent } from './financial-payment-method-added.event';

export { FinancialPaymentMethodDefaultedEvent } from './financial-payment-method-defaulted.event';

export { FinancialPaymentMethodDeactivatedEvent } from './financial-payment-method-deactivated.event';
