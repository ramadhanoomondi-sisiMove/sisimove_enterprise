// =============================================================================
// sisiMove — Financial Withdrawal View Model
// =============================================================================
//
// Frontend-safe presentation model for a FinancialWithdrawal.
//
// This model is intentionally narrower than the API/domain-facing withdrawal
// model. Components should prefer this view model when rendering withdrawal
// information in wallet screens, withdrawal history, status cards, and
// confirmation/result surfaces.
//
// Important boundaries:
//
// - This is a UI presentation contract, not a persistence model.
// - It does not expose database IDs.
// - It does not expose internal disbursement or transaction identifiers.
// - The destination value is already expected to be privacy-safe/masked by
//   the mapping layer before it reaches presentation components.
// - Monetary values remain integer minor units. Formatting KES amounts belongs
//   to the presentation/formatting layer.
// - Lifecycle state is represented by the public withdrawal status.
//
// =============================================================================

import type { FinancialWithdrawalStatus } from './financial-withdrawal-status';
import type { WithdrawalDestinationType } from './withdrawal-destination-type';

/**
 * Frontend-safe representation of a financial withdrawal.
 *
 * Intended for:
 * - wallet withdrawal history;
 * - withdrawal detail views;
 * - withdrawal status components;
 * - withdrawal success/failure states;
 * - member-facing activity summaries.
 */
export interface FinancialWithdrawalView {
  /**
   * Stable public identifier used when navigating to withdrawal details.
   */
  readonly publicId: string;

  /**
   * Withdrawal amount in integer minor units.
   *
   * Example:
   *     KES 1,250.00 => 125000
   */
  readonly amount: number;

  /**
   * ISO currency code.
   */
  readonly currency: string;

  /**
   * Current member-visible lifecycle status.
   */
  readonly status: FinancialWithdrawalStatus;

  /**
   * Destination category.
   */
  readonly destinationType: WithdrawalDestinationType;

  /**
   * Privacy-safe destination representation suitable for display.
   *
   * Examples:
   *     0712••••34
   *     ••••1234
   *
   * The frontend must not assume that this value is safe to unmask.
   */
  readonly destinationDisplay: string;

  /**
   * When the withdrawal was requested.
   */
  readonly requestedAt: string;

  /**
   * When the withdrawal completed successfully.
   */
  readonly completedAt?: string;

  /**
   * When the withdrawal failed.
   */
  readonly failedAt?: string;

  /**
   * When the withdrawal was cancelled.
   */
  readonly cancelledAt?: string;
}
