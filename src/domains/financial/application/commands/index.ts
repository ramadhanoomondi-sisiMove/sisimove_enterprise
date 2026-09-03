// -----------------------------------------------------------------------------
// Financial Application Commands
// -----------------------------------------------------------------------------
//
// Central export surface for Financial application commands.
//
// Covers:
//
// - Financial Account commands
// - Financial Account Hold commands
// - Financial Account Withdrawal commands
// - Financial Transaction commands
// - Financial Payment commands
// - Financial Payment Method commands
// - Financial Settlement commands
// - Financial Disbursement commands
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Financial Account Commands
// -----------------------------------------------------------------------------
//
// Central export surface for Financial Account application commands.
//
// Lifecycle:
//
//     PENDING
//        │
//        ├── ACTIVE
//        ├── SUSPENDED
//        └── CLOSED
//
// -----------------------------------------------------------------------------

export { CreateFinancialAccountCommand } from './create-financial-account.command';

export { ActivateFinancialAccountCommand } from './activate-financial-account.command';

export { SuspendFinancialAccountCommand } from './suspend-financial-account.command';

export { CloseFinancialAccountCommand } from './close-financial-account.command';

// -----------------------------------------------------------------------------
// Financial Account Hold Commands
// -----------------------------------------------------------------------------
//
// Central export surface for Financial Account Hold application commands.
//
// Lifecycle:
//
//     ACTIVE
//        │
//        ├── RELEASED
//        ├── CAPTURED
//        └── CANCELLED
//
// -----------------------------------------------------------------------------

export { CreateFinancialAccountHoldCommand } from './create-financial-account-hold.command';

export { CaptureFinancialAccountHoldCommand } from './capture-financial-account-hold.command';

export { ReleaseFinancialAccountHoldCommand } from './release-financial-account-hold.command';

export { CancelFinancialAccountHoldCommand } from './cancel-financial-account-hold.command';

// -----------------------------------------------------------------------------
// Financial Account Withdrawal Commands
// -----------------------------------------------------------------------------
//
// Central export surface for Financial Account Withdrawal application
// commands.
//
// Lifecycle:
//
//     PENDING
//        │
//        ├── PROCESSING
//        │      │
//        │      ├── COMPLETED
//        │      ├── FAILED
//        │      └── CANCELLED
//        │
//        └── CANCELLED
//
// COMPLETED, FAILED and CANCELLED are terminal states.
//
// The withdrawal aggregate represents the withdrawal workflow and references
// a Financial Disbursement responsible for executing the actual payout.
//
// Withdrawal commands do NOT directly move money, modify Financial Account
// balances, or execute external disbursement providers.
//
// -----------------------------------------------------------------------------

export { RequestFinancialAccountWithdrawalCommand } from './request-financial-account-withdrawal.command';

export { ProcessFinancialAccountWithdrawalCommand } from './process-financial-account-withdrawal.command';

export { CompleteFinancialAccountWithdrawalCommand } from './complete-financial-account-withdrawal.command';

export { FailFinancialAccountWithdrawalCommand } from './fail-financial-account-withdrawal.command';

export { CancelFinancialAccountWithdrawalCommand } from './cancel-financial-account-withdrawal.command';

// -----------------------------------------------------------------------------
// Financial Transaction Commands
// -----------------------------------------------------------------------------
//
// Central export surface for Financial Transaction application commands.
//
// -----------------------------------------------------------------------------

export { CreateFinancialTransactionCommand } from './create-financial-transaction.command';

export { CompleteFinancialTransactionCommand } from './complete-financial-transaction.command';

export { FailFinancialTransactionCommand } from './fail-financial-transaction.command';

export { ReverseFinancialTransactionCommand } from './reverse-financial-transaction.command';

export { CancelFinancialTransactionCommand } from './cancel-financial-transaction.command';

// -----------------------------------------------------------------------------
// Financial Payment Commands
// -----------------------------------------------------------------------------
//
// Central export surface for Financial Payment application commands.
//
// -----------------------------------------------------------------------------

export { CreateFinancialPaymentCommand } from './create-financial-payment.command';

export { ProcessFinancialPaymentCommand } from './process-financial-payment.command';

export { SucceedFinancialPaymentCommand } from './succeed-financial-payment.command';

export { FailFinancialPaymentCommand } from './fail-financial-payment.command';

export { CancelFinancialPaymentCommand } from './cancel-financial-payment.command';

export { ExpireFinancialPaymentCommand } from './expire-financial-payment.command';

export { LinkFinancialPaymentTransactionCommand } from './link-financial-payment-transaction.command';

// -----------------------------------------------------------------------------
// Financial Payment Method Commands
// -----------------------------------------------------------------------------
//
// Central export surface for Financial Payment Method application commands.
//
// -----------------------------------------------------------------------------

export { AddFinancialPaymentMethodCommand } from './add-financial-payment-method.command';

export { SetDefaultFinancialPaymentMethodCommand } from './set-default-financial-payment-method.command';

export { DeactivateFinancialPaymentMethodCommand } from './deactivate-financial-payment-method.command';

// -----------------------------------------------------------------------------
// Financial Settlement Commands
// -----------------------------------------------------------------------------
//
// Central export surface for Financial Settlement application commands.
//
// Settlement lifecycle:
//
//     PENDING
//        │
//        ├── PROCESSING
//        │      │
//        │      ├── item allocation
//        │      │      PENDING → ALLOCATED
//        │      │
//        │      └── item settlement
//        │             ALLOCATED → SETTLED
//        │
//        ├── FAILED
//        └── CANCELLED
//
//     PROCESSING → COMPLETED
//
// Allocation is an Item-level operation and is therefore intentionally
// represented by AllocateFinancialSettlementItemCommand rather than by an
// aggregate-level ALLOCATED lifecycle command.
//
// -----------------------------------------------------------------------------

export { CreateFinancialSettlementCommand } from './create-financial-settlement.command';

export { ProcessFinancialSettlementCommand } from './process-financial-settlement.command';

export { AllocateFinancialSettlementItemCommand } from './allocate-financial-settlement-item.command';

export { CompleteFinancialSettlementCommand } from './complete-financial-settlement.command';

export { FailFinancialSettlementCommand } from './fail-financial-settlement.command';

export { CancelFinancialSettlementCommand } from './cancel-financial-settlement.command';

// -----------------------------------------------------------------------------
// Financial Disbursement Commands
// -----------------------------------------------------------------------------
//
// Central export surface for Financial Disbursement application commands.
//
// Disbursement lifecycle:
//
//     PENDING
//        │
//        ├── PROCESSING
//        │      │
//        │      └── attempt execution
//        │             │
//        │             ├── successful attempt
//        │             └── failed attempt
//        │
//        ├── FAILED
//        └── CANCELLED
//
//     PROCESSING → COMPLETED
//
// FinancialDisbursementAggregate owns the disbursement lifecycle and its
// execution-attempt collection.
//
// Disbursement commands do NOT:
//
// - execute external providers;
// - create or post Financial Transactions;
// - modify Financial Account balances;
// - modify Financial Disbursement Destinations.
//
// -----------------------------------------------------------------------------

export { CreateFinancialDisbursementCommand } from './create-financial-disbursement.command';

export { ProcessFinancialDisbursementCommand } from './process-financial-disbursement.command';

export { CompleteFinancialDisbursementCommand } from './complete-financial-disbursement.command';

export { FailFinancialDisbursementCommand } from './fail-financial-disbursement.command';

export { CancelFinancialDisbursementCommand } from './cancel-financial-disbursement.command';
