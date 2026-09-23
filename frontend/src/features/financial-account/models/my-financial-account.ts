// =============================================================================
// sisiMove — Financial Account
// =============================================================================
//
// Member-facing representation of the authenticated user's Financial Account.
//
// Architectural boundary:
//
//     Backend FinancialAccount
//              │
//              ▼
//     API response / DTO
//              │
//              ▼
//     mapMyFinancialAccount()
//              │
//              ▼
//     MyFinancialAccount
//              │
//              ▼
//     Wallet components
//
// This model deliberately does NOT mirror the Prisma FinancialAccount model.
//
// It excludes backend/internal concerns such as:
// - database id
// - transaction relations
// - transaction entries
// - payments
// - payment methods
// - holds
// - withdrawals
// - settlements
// - disbursements
//
// Those concerns belong to their respective financial feature boundaries.
//
// The authenticated member has one USER FinancialAccount. Therefore the
// frontend does not expose account selection or arbitrary account ownership.
//
// Money values are represented as integer minor units.
//
// Example:
//
//     125000 → KES 1,250.00
//
// Never use floating-point numbers for financial arithmetic.
//
// =============================================================================

import type {
  FinancialAccountStatus,
  FinancialAccountType,
} from './index';

// -----------------------------------------------------------------------------
// MyFinancialAccount
// -----------------------------------------------------------------------------

export interface MyFinancialAccount {
  /**
   * Public, non-database identifier of the authenticated member's
   * FinancialAccount.
   *
   * This is safe for frontend/API boundary usage.
   */
  publicId: string;

  /**
   * Financial account type.
   *
   * For a normal member wallet this should be USER.
   */
  type: FinancialAccountType;

  /**
   * Current lifecycle state of the financial account.
   */
  status: FinancialAccountStatus;

  /**
   * Account currency.
   *
   * sisiMove currently operates in KES.
   */
  currency: string;

  /**
   * Public identifier of the owning member/identity when the backend
   * exposes it in the authenticated account representation.
   *
   * This is optional because the authenticated "my account" boundary
   * does not need to expose ownership data for normal wallet rendering.
   */
  ownerPublicId?: string;

  /**
   * Available balance in integer minor units.
   *
   * Example:
   *
   *     125000 → KES 1,250.00
   */
  availableAmount: number;

  /**
   * Funds currently pending settlement/payment processing.
   */
  pendingAmount: number;

  /**
   * Funds currently reserved/held.
   */
  heldAmount: number;

  /**
   * Optimistic-concurrency/version value supplied by the backend balance
   * representation.
   *
   * This is retained as data, but frontend components must not mutate it.
   */
  balanceVersion: number;

  /**
   * Account creation timestamp in ISO-8601 format.
   */
  createdAt: string;

  /**
   * Last account update timestamp in ISO-8601 format.
   */
  updatedAt: string;
}