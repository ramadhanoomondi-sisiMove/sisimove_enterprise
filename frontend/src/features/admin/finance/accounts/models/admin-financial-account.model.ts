// -----------------------------------------------------------------------------
// sisiMove Admin — Financial Account Models
// -----------------------------------------------------------------------------
// Frontend representation of FinancialAccountResponse and
// FinancialAccountBalanceResponse from the backend response mapper.
// These types intentionally contain primitives only; no domain classes or
// runtime dependencies cross the REST boundary.
// -----------------------------------------------------------------------------

import type {
  AdminFinancialAccountStatus,
  AdminFinancialAccountType,
} from './admin-financial-account.enums';

/** REST representation returned by FinancialAccountResponseMapper.toResponse(). */
export interface AdminFinancialAccount {
  /** Public identifier used by routes and API requests. */
  publicId: string;

  /** Undefined for ownerless platform/system accounts. */
  ownerPublicId: string | undefined;

  type: AdminFinancialAccountType;
  status: AdminFinancialAccountStatus;
  currency: string;
  balance: AdminFinancialAccountBalance;

  /** ISO-8601 date-time strings after JSON serialization. */
  createdAt: string;
  updatedAt: string;
}

/** Aggregate-owned balance nested in the Financial Account response. */
export interface AdminFinancialAccountBalance {
  publicId: string;
  accountPublicId: string;

  /** Monetary amounts are integer minor units, not formatted display values. */
  availableAmount: number;
  pendingAmount: number;
  heldAmount: number;
  totalAmount: number;

  currency: string;
  version: number;

  /** ISO-8601 date-time strings after JSON serialization. */
  createdAt: string;
  updatedAt: string;
}

/** Response shape for GET /financial-accounts/:accountPublicId/balance. */
export type AdminFinancialAccountBalanceOnly = Omit<
  AdminFinancialAccountBalance,
  'accountPublicId'
>;
