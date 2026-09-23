// =============================================================================
// sisiMove — Financial Account Balance Model
// =============================================================================
//
// Authenticated member-facing representation of a FinancialAccountBalance.
//
// This is a frontend domain model, not a Prisma model mirror.
//
// Financial amounts are represented as integer minor units.
// For KES:
//
//     125000 = KES 1,250.00
//
// The model deliberately keeps monetary state separate from
// MyFinancialAccount. This preserves the backend aggregate/read-boundary
// distinction and allows balance data to evolve independently.
//
// =============================================================================

// -----------------------------------------------------------------------------
// FinancialAccountBalance
// -----------------------------------------------------------------------------

export interface FinancialAccountBalance {
  /**
   * Public identifier of the balance record.
   *
   * The database `id` is deliberately not exposed to the frontend.
   */
  publicId: string;

  /**
   * Amount currently available for use.
   *
   * Integer minor units.
   *
   * Example:
   *     125000 = KES 1,250.00
   */
  availableAmount: number;

  /**
   * Amount currently pending.
   *
   * These funds are not yet available for normal wallet activity.
   *
   * Integer minor units.
   */
  pendingAmount: number;

  /**
   * Amount currently held/reserved.
   *
   * These funds are reserved against an active financial hold and are not
   * available for normal wallet activity.
   *
   * Integer minor units.
   */
  heldAmount: number;

  /**
   * ISO currency code for the balance.
   *
   * SisiMove currently operates the member wallet in KES.
   */
  currency: string;

  /**
   * Optimistic-concurrency version of the balance record.
   *
   * This is useful to retain when the backend exposes it, but the frontend
   * must not independently mutate or increment it.
   */
  version: number;

  /**
   * ISO-8601 timestamp indicating when the balance record was created.
   */
  createdAt: string;

  /**
   * ISO-8601 timestamp indicating when the balance record was last updated.
   */
  updatedAt: string;
}