// -----------------------------------------------------------------------------
// Financial — Query Handlers
// -----------------------------------------------------------------------------
//
// Public barrel export for all Financial query handlers.
//
// Query handlers:
//
// - retrieve existing aggregates or related financial data;
// - perform no domain mutations;
// - create no domain events;
// - do not execute financial operations.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Financial Account
// -----------------------------------------------------------------------------

export * from './get-financial-account.handler';

// -----------------------------------------------------------------------------
// Financial Account Balance
// -----------------------------------------------------------------------------

export * from './get-financial-account-balance.handler';

// -----------------------------------------------------------------------------
// Financial Transaction
// -----------------------------------------------------------------------------

export * from './get-financial-transaction.handler';

// -----------------------------------------------------------------------------
// Financial Account Transactions
// -----------------------------------------------------------------------------

export * from './get-financial-account-transactions.handler';

// -----------------------------------------------------------------------------
// Financial Payment
// -----------------------------------------------------------------------------

export * from './get-financial-payment.handler';

// -----------------------------------------------------------------------------
// Financial Account Payments
// -----------------------------------------------------------------------------

export * from './get-financial-account-payments.handler';

// -----------------------------------------------------------------------------
// Financial Payment Method
// -----------------------------------------------------------------------------

export * from './get-financial-payment-method.handler';

// -----------------------------------------------------------------------------
// Default Financial Payment Method
// -----------------------------------------------------------------------------

export * from './get-default-financial-payment-method.handler';

// -----------------------------------------------------------------------------
// Financial Account Holds
// -----------------------------------------------------------------------------
//
// Retrieves Financial Account Holds belonging to a Financial Account.
//
// Multiple ACTIVE holds are valid.
//
// RELEASED, CAPTURED, and CANCELLED holds remain historical lifecycle states
// and are returned according to the corresponding application query.
//
// -----------------------------------------------------------------------------

export * from './get-financial-account-holds.handler';

// -----------------------------------------------------------------------------
// Financial Settlement
// -----------------------------------------------------------------------------
//
// Retrieves a complete Financial Settlement aggregate.
//
// Aggregate:
//
// FinancialSettlementAggregate
// └── FinancialSettlementEntity
//     └── FinancialSettlementItemEntity[]
//         └── FinancialSettlementAllocationEntity[]
//
// The Settlement aggregate remains the persistence and domain boundary.
//
// -----------------------------------------------------------------------------

export * from './get-financial-settlement.handler';

// -----------------------------------------------------------------------------
// Financial Settlement Items
// -----------------------------------------------------------------------------
//
// Retrieves Settlement Items owned by a Financial Settlement aggregate.
//
// Settlement Items are aggregate-owned entities and are therefore retrieved
// through the FinancialSettlementAggregate.
//
// They are not independent aggregate roots and do not have a separate
// repository boundary.
//
// -----------------------------------------------------------------------------

export * from './get-financial-settlement-items.handler';

// -----------------------------------------------------------------------------
// Financial Account Withdrawal
// -----------------------------------------------------------------------------
//
// Retrieves a Financial Account Withdrawal aggregate by its public identity.
//
// -----------------------------------------------------------------------------

export * from './get-financial-account-withdrawal.handler';

// -----------------------------------------------------------------------------
// Financial Account Withdrawals
// -----------------------------------------------------------------------------
//
// Retrieves all Financial Account Withdrawal aggregates belonging to a
// Financial Account.
//
// -----------------------------------------------------------------------------

export * from './get-financial-account-withdrawals.handler';

// -----------------------------------------------------------------------------
// Financial Account Withdrawals By Status
// -----------------------------------------------------------------------------
//
// Retrieves Financial Account Withdrawal aggregates belonging to a Financial
// Account and matching the supplied lifecycle status.
//
// -----------------------------------------------------------------------------

export * from './get-financial-account-withdrawals-by-status.handler';

// -----------------------------------------------------------------------------
// Financial Disbursement
// -----------------------------------------------------------------------------
//
// Retrieves a Financial Disbursement aggregate by its public identity.
//
// Aggregate:
//
// FinancialDisbursementAggregate
// ├── FinancialDisbursementEntity
// │   └── FinancialDisbursementAttemptEntity[]
// └── FinancialDisbursementDestinationEntity
//
// The Financial Disbursement aggregate remains the domain boundary.
//
// -----------------------------------------------------------------------------

export * from './get-financial-disbursement.handler';

// -----------------------------------------------------------------------------
// Financial Disbursement Attempts
// -----------------------------------------------------------------------------
//
// Retrieves execution attempts belonging to a Financial Disbursement.
//
// FinancialDisbursementAttemptEntity instances are aggregate-owned entities
// and are therefore retrieved through the FinancialDisbursementAggregate.
//
// They are not independent aggregate roots and do not have a separate
// repository/query boundary.
//
// -----------------------------------------------------------------------------

export * from './get-financial-disbursement-attempts.handler';
