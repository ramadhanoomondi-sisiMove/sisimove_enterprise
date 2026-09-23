// =============================================================================
// sisiMove — Create Withdrawal Request
// =============================================================================
//
// Member-facing request model for creating a FinancialAccountWithdrawal.
//
// Important boundaries:
//
// - `accountPublicId` is intentionally NOT part of this request model.
//   Account ownership/resolution belongs to the API/application boundary.
// - `amount` is transported as a decimal-free integer string representing
//   minor units. This avoids JavaScript floating-point money problems.
// - The destination is supplied directly because the withdrawal stores an
//   immutable destination snapshot.
// - This is a request contract, not a Prisma DTO.
// - Lifecycle operations such as process, complete, fail, and cancel are
//   intentionally not represented here.
//
// Example:
//
//     {
//       amount: "125000",
//       currency: "KES",
//       destinationType: "MOBILE_MONEY",
//       destinationValue: "0712345678",
//       correlationId: "correlation-id"
//     }
//
// =============================================================================

import type { WithdrawalDestinationType } from './withdrawal-destination-type';

/**
 * Request data required to create a financial withdrawal.
 */
export interface CreateWithdrawalRequest {
  /**
   * Withdrawal amount in integer minor units.
   *
   * Example:
   *     "125000" => KES 1,250.00
   */
  readonly amount: string;

  /**
   * ISO currency code.
   *
   * SisiMove currently operates with KES.
   */
  readonly currency: string;

  /**
   * Destination category captured by the withdrawal.
   */
  readonly destinationType: WithdrawalDestinationType;

  /**
   * Destination value captured as part of the withdrawal snapshot.
   */
  readonly destinationValue: string;

  /**
   * Correlation identifier for tracing the request across the application.
   */
  readonly correlationId: string;

  /**
   * Optional domain reference identifying what initiated the withdrawal.
   */
  readonly referenceType?: string;

  /**
   * Optional public identifier of the initiating domain reference.
   */
  readonly referencePublicId?: string;

  /**
   * Optional causation identifier linking this request to the event or command
   * that caused it.
   */
  readonly causationId?: string;
}

