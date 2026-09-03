// -----------------------------------------------------------------------------
// Recovery — Get Recoveries Query
// -----------------------------------------------------------------------------
//
// Retrieves multiple Recovery aggregates.
//
// Aggregate:
//
// RecoveryAggregate
// └── RecoveryEntity
//
// Query responsibilities:
//
// - Request retrieval of Recovery aggregates.
// - Remain immutable.
// - Contain no business logic.
// - Contain no persistence logic.
// - Contain no Prisma dependencies.
//
// The corresponding query handler is responsible for:
//
// - loading Recovery aggregates through the repository;
// - handling the empty-result case;
// - mapping aggregates to the application read model or DTO.
//
// Repository operation:
//
// - RecoveryRepository.findByStatus() may be used when filtering by status.
// - RecoveryRepository.findByType() may be used when filtering by type.
// - For an unfiltered collection, the infrastructure may provide the
//   appropriate repository/query implementation.
//
// -----------------------------------------------------------------------------
//
// Security:
//
// Recovery token material is intentionally not part of this query.
//
// Raw recovery tokens, recovery-token hashes, passwords, password hashes,
// OTP values, OTP hashes, and session credentials must never be carried by
// this query.
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
 * Query for retrieving multiple Recovery aggregates.
 *
 * This query intentionally carries no filtering criteria.
 *
 * Filtering by Identity, type, status, or composite criteria should be
 * represented by dedicated queries so that each application use case has
 * explicit semantics.
 */
export class GetRecoveriesQuery extends Query {
  /**
   * Creates a query for retrieving Recovery aggregates.
   */
  public constructor() {
    super();
  }
}
