// -----------------------------------------------------------------------------
// Financial Account — Query Handlers
// -----------------------------------------------------------------------------
//
// Public barrel export for all Financial Account query handlers.
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
// Retrieves all ACTIVE Financial Account Holds belonging to a Financial
// Account.
//
// Multiple ACTIVE holds are valid.
//
// RELEASED, CAPTURED and CANCELLED holds are terminal and are excluded
// by the corresponding application query.
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
