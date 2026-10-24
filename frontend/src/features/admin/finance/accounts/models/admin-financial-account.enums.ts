// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account Enums
// -----------------------------------------------------------------------------
// Values mirror the Financial Account enums defined by the backend domain/schema.
// Keep these string values aligned with the API; do not invent UI-only states.
// -----------------------------------------------------------------------------

export enum AdminFinancialAccountType {
  USER = 'USER',
  PLATFORM = 'PLATFORM',
  MERCHANT = 'MERCHANT',
  HOLDING = 'HOLDING',
  SETTLEMENT = 'SETTLEMENT',
}

export enum AdminFinancialAccountStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  CLOSED = 'CLOSED',
}

/** Balance buckets exposed by the Financial Account balance response. */
export enum AdminFinancialBalanceType {
  AVAILABLE = 'AVAILABLE',
  PENDING = 'PENDING',
  HELD = 'HELD',
}
