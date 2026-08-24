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
