// -----------------------------------------------------------------------------
// Count Pending Verifications Query
// -----------------------------------------------------------------------------
//
// Read-model query for counting Verification aggregates whose lifecycle status
// is PENDING.
//
// Query responsibility:
//
// - request the total number of pending Verification aggregates;
// - remain immutable;
// - contain no business logic;
// - contain no persistence concerns;
// - contain no aggregate mutation logic.
//
// The query handler is responsible for:
//
// - executing the pending Verification count through the repository;
// - returning the resulting count.
//
// Aggregate ownership:
//
// Identity
//   └── VerificationAggregate
//       ├── VerificationEntity
//       └── VerificationRequestEntity[]
//
// Counting rule:
//
// Count Verification aggregates with lifecycle status PENDING.
// This does not count individual VerificationRequest entities.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Requests the total number of pending Verification aggregates.
 *
 * This query contains no parameters because it counts all Verification
 * aggregates whose lifecycle status is PENDING.
 */
export class CountPendingVerificationsQuery {
  public constructor() {}
}

export default CountPendingVerificationsQuery;
