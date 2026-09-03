// -----------------------------------------------------------------------------
// OTP Challenge — Get Active OTP Challenges Query
// -----------------------------------------------------------------------------
//
// Retrieves active OTP Challenge aggregates.
//
// Aggregate:
//
// OtpChallengeAggregate
// └── OtpChallengeEntity
//
// Active OTP Challenge semantics:
//
// - The persisted lifecycle status is PENDING.
// - The challenge has not reached a terminal state.
// - Dynamic expiration is evaluated by the domain/application layer.
//
// IMPORTANT:
//
// `findPending()` is the repository operation used by this query because
// PENDING represents the persisted active lifecycle state.
//
// A PENDING challenge may already be dynamically expired according to its
// expiresAt timestamp. The query itself does not mutate or expire challenges.
//
// Query responsibilities:
//
// - Carry no persistence-specific information.
// - Validate the query input shape.
// - Remain immutable.
// - Contain no business logic.
// - Contain no persistence logic.
// - Contain no Prisma dependencies.
//
// The corresponding query handler is responsible for:
//
// - retrieving pending OTP Challenges through the repository;
// - optionally evaluating dynamic expiration through the aggregate;
// - mapping aggregates to application read models or DTOs.
//
// Security:
//
// - No OTP value is carried by this query.
// - No OTP hash is carried by this query.
// - No authentication credential is carried by this query.
// - No sensitive OTP material is exposed through the query.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for retrieving active OTP Challenge aggregates.
 *
 * Active OTP Challenges are retrieved through the repository's persisted
 * PENDING state.
 */
export class GetActiveOtpChallengesQuery extends Query {
  /**
   * Creates a query for retrieving active OTP Challenges.
   */
  public constructor() {
    super();
  }
}
