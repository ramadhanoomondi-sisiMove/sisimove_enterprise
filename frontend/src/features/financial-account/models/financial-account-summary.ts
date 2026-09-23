// =============================================================================
// sisiMove — Financial Account Summary Model
// =============================================================================
//
// Compact member-facing representation of a financial account.
//
// This model is intended for wallet overview/read surfaces where the frontend
// needs the essential account and balance information without loading the
// complete financial account representation.
//
// It is a frontend read model, not a Prisma model mirror and not a separate
// backend aggregate.
//
// Monetary amounts are represented as integer minor units.
//
// For KES:
//
//     125000 = KES 1,250.00
//
// =============================================================================

import type { FinancialAccountStatus } from './financial-account-status';
import type { FinancialAccountType } from './financial-account-type';

// -----------------------------------------------------------------------------
// FinancialAccountSummary
// -----------------------------------------------------------------------------

export interface FinancialAccountSummary {
  /**
   * Public identifier of the financial account.
   *
   * The database `id` is deliberately not exposed to the frontend.
   */
  publicId: string;

  /**
   * Financial account type.
   *
   * A normal authenticated member wallet uses USER.
   */
  type: FinancialAccountType;

  /**
   * Current lifecycle status of the financial account.
   */
  status: FinancialAccountStatus;

  /**
   * ISO currency code for the account.
   *
   * SisiMove currently operates the member wallet in KES.
   */
  currency: string;

  /**
   * Amount currently available for use or withdrawal.
   *
   * Integer minor units.
   */
  availableAmount: number;

  /**
   * Amount currently pending.
   *
   * Integer minor units.
   */
  pendingAmount: number;

  /**
   * Amount currently held/reserved.
   *
   * Integer minor units.
   */
  heldAmount: number;
}