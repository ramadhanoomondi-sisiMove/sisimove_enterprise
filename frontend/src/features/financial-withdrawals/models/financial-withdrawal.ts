// =============================================================================
// sisiMove — Financial Withdrawal Model
// =============================================================================
//
// Member-facing representation of a FinancialAccountWithdrawal.
//
// A withdrawal represents a member's request to move funds out of their
// sisiMove financial account to an external destination.
//
// Important boundaries:
//
// - This model contains public/member-facing data only.
// - Persistence IDs such as the database `id`, `accountId`, and internal
//   relations are intentionally excluded.
// - `publicId` is the stable identifier exposed to the frontend.
// - `amount` is represented as an integer minor-unit amount.
//   Example: KES 1,250.00 => 125000.
// - `destinationType` and `destinationValue` represent the immutable
//   destination snapshot captured by the withdrawal.
// - `disbursementPublicId` and `transactionPublicId` are references to
//   backend financial workflows and accounting records. They are exposed
//   only as public identifiers.
// - Lifecycle processing is owned by the backend. The frontend should
//   present lifecycle state rather than directly mutate it.
//
// Backend lifecycle:
//
//     PENDING
//        │
//        ├── PROCESSING
//        │      ├── COMPLETED
//        │      ├── FAILED
//        │      └── CANCELLED
//        │
//        └── CANCELLED
//
// =============================================================================

import type { FinancialWithdrawalStatus } from './financial-withdrawal-status';
import type { WithdrawalDestinationType } from './withdrawal-destination-type';

/**
 * Member-facing financial withdrawal.
 */
export interface FinancialWithdrawal {
  /**
   * Stable public identifier for the withdrawal.
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
   *
   * SisiMove currently operates with KES.
   */
  readonly currency: string;

  /**
   * Current withdrawal lifecycle status.
   */
  readonly status: FinancialWithdrawalStatus;

  /**
   * Type of external destination captured for this withdrawal.
   */
  readonly destinationType: WithdrawalDestinationType;

  /**
   * Destination value captured when the withdrawal was created.
   *
   * The backend owns the exact representation and may return a masked or
   * otherwise privacy-safe value.
   */
  readonly destinationValue: string;

  /**
   * Optional domain reference identifying what initiated the withdrawal.
   */
  readonly referenceType?: string;

  /**
   * Optional public identifier of the initiating domain reference.
   */
  readonly referencePublicId?: string;

  /**
   * Public identifier of the resulting disbursement, when one exists.
   */
  readonly disbursementPublicId?: string;

  /**
   * Public identifier of the resulting financial transaction, when one exists.
   */
  readonly transactionPublicId?: string;

  /**
   * Timestamp at which the withdrawal was requested.
   */
  readonly requestedAt: string;

  /**
   * Timestamp at which the withdrawal completed successfully.
   */
  readonly completedAt?: string;

  /**
   * Timestamp at which the withdrawal failed.
   */
  readonly failedAt?: string;

  /**
   * Timestamp at which the withdrawal was cancelled.
   */
  readonly cancelledAt?: string;

  /**
   * Timestamp at which the withdrawal record was created.
   */
  readonly createdAt: string;

  /**
   * Timestamp at which the withdrawal record was last updated.
   */
  readonly updatedAt: string;
}

