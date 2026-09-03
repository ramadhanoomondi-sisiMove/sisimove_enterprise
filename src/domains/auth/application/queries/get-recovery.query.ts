// -----------------------------------------------------------------------------
// Recovery — Get Recovery Query
// -----------------------------------------------------------------------------
//
// Retrieves a Recovery aggregate by its public identity.
//
// Aggregate:
//
// RecoveryAggregate
// └── RecoveryEntity
//
// Recovery is an independent aggregate responsible for the lifecycle of one
// recovery workflow associated with an Identity.
//
// Query responsibilities:
//
// - Carry the Recovery public identifier.
// - Validate the query input shape.
// - Remain immutable.
// - Contain no business logic.
// - Contain no persistence logic.
// - Contain no Prisma dependencies.
//
// The corresponding query handler is responsible for:
//
// - loading the Recovery aggregate through the repository;
// - resolving Recovery by its public identity;
// - handling the not-found case;
// - mapping the aggregate to the application read model or DTO.
//
// -----------------------------------------------------------------------------
//
// Security:
//
// The query uses RecoveryPublicId rather than the internal persistence ID.
//
// Recovery token material is intentionally not part of the query.
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
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { RecoveryPublicId } from '../../domain/value-objects/recovery-public-id.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for retrieving a Recovery aggregate by its public identity.
 *
 * Recovery is located through its own opaque public identifier.
 */
export class GetRecoveryQuery extends Query {
  /**
   * Creates a query for retrieving Recovery by public ID.
   */
  public constructor(public readonly recoveryPublicId: RecoveryPublicId) {
    super();

    if (recoveryPublicId === undefined) {
      throw new Error('Recovery public ID is required to retrieve Recovery.');
    }
  }
}
