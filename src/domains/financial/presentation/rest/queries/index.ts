// -----------------------------------------------------------------------------
// Financial — REST Query DTO Exports
// -----------------------------------------------------------------------------
//
// Central export surface for Financial REST query DTOs.
//
// These DTOs belong to the presentation boundary and contain transport-level
// primitives. Conversion into domain value objects is performed by the
// controller/application boundary.
//
// Covered areas:
//
// - Financial Account
// - Financial Account Balance
// - Financial Account Holds
// - Financial Account Transactions
// - Financial Account Payments
// - Financial Transaction
// - Financial Payment
// - Financial Payment Method
// - Financial Settlement
// - Financial Settlement Items
// - Financial Account Withdrawal
// - Financial Disbursement
// - Financial Disbursement Attempts
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Financial Account
// -----------------------------------------------------------------------------

export { GetFinancialAccountDto } from './get-financial-account.query.dto';

// -----------------------------------------------------------------------------
// Financial Account Balance
// -----------------------------------------------------------------------------

export { GetFinancialAccountBalanceDto } from './get-financial-account-balance.query.dto';

// -----------------------------------------------------------------------------
// Financial Account Holds
// -----------------------------------------------------------------------------

export { GetFinancialAccountHoldsQueryDto } from './get-financial-account-holds.query.dto';

// -----------------------------------------------------------------------------
// Financial Account Transactions
// -----------------------------------------------------------------------------

export { GetFinancialAccountTransactionsDto } from './get-financial-account-transactions.query.dto';

// -----------------------------------------------------------------------------
// Financial Account Payments
// -----------------------------------------------------------------------------

export { GetFinancialAccountPaymentsDto } from './get-financial-account-payments.query.dto';

// -----------------------------------------------------------------------------
// Financial Transaction
// -----------------------------------------------------------------------------

export { GetFinancialTransactionDto } from './get-financial-transaction.query.dto';

// -----------------------------------------------------------------------------
// Financial Payment
// -----------------------------------------------------------------------------

export { GetFinancialPaymentDto } from './get-financial-payment.query.dto';

// -----------------------------------------------------------------------------
// Financial Payment Method
// -----------------------------------------------------------------------------

export { GetFinancialPaymentMethodDto } from './get-financial-payment-method.query.dto';

// -----------------------------------------------------------------------------
// Financial Payment Method — Default
// -----------------------------------------------------------------------------

export { GetDefaultFinancialPaymentMethodDto } from './get-default-financial-payment-method.query.dto';

// -----------------------------------------------------------------------------
// Financial Settlement
// -----------------------------------------------------------------------------

export { GetFinancialSettlementRequestDto } from './get-financial-settlement.query.dto';

// -----------------------------------------------------------------------------
// Financial Settlement Items
// -----------------------------------------------------------------------------

export { GetFinancialSettlementItemsRequestDto } from './get-financial-settlement-items.query.dto';

// -----------------------------------------------------------------------------
// Financial Account Withdrawal
// -----------------------------------------------------------------------------

export { GetFinancialAccountWithdrawalQueryDto } from './get-financial-account-withdrawal.query.dto';

export { GetFinancialAccountWithdrawalsQueryDto } from './get-financial-account-withdrawals.query.dto';

export { GetFinancialAccountWithdrawalsByStatusQueryDto } from './get-financial-account-withdrawals-by-status.query.dto';

// -----------------------------------------------------------------------------
// Financial Disbursement
// -----------------------------------------------------------------------------
//
// Retrieves a Financial Disbursement aggregate by its public identity.
//
// The aggregate is fully rehydrated by the repository, including its
// aggregate-owned execution attempts and associated destination.
//
// -----------------------------------------------------------------------------

export { GetFinancialDisbursementQueryDto } from './get-financial-disbursement.query.dto';

// -----------------------------------------------------------------------------
// Financial Disbursement Attempts
// -----------------------------------------------------------------------------
//
// Retrieves execution attempts belonging to a Financial Disbursement.
//
// FinancialDisbursementAttemptEntity instances remain aggregate-owned entities
// and are therefore queried through their owning Financial Disbursement.
//
// -----------------------------------------------------------------------------

export { GetFinancialDisbursementAttemptsQueryDto } from './get-financial-disbursement-attempts.query.dto';
