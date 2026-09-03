// -----------------------------------------------------------------------------
// Session — Get Session Query
// -----------------------------------------------------------------------------
//
// Retrieves a single Session aggregate by its public identifier.
//
// Query responsibilities:
//
// - Carry the Session public identifier.
// - Validate the query input shape.
// - Remain immutable.
// - Contain no business logic.
// - Contain no persistence logic.
// - Contain no Prisma dependencies.
//
// The corresponding query handler is responsible for:
//
// - loading the Session aggregate through the repository;
// - handling the not-found case;
// - mapping the aggregate to the application read model or DTO.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { SessionPublicId } from '../../domain/value-objects/session-public-id.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for retrieving a single Session aggregate.
 *
 * The Session is identified through its public identifier rather than its
 * internal persistence identity.
 */
export class GetSessionQuery extends Query {
  /**
   * Creates a query for retrieving a Session by its public ID.
   */
  public constructor(public readonly sessionPublicId: SessionPublicId) {
    super();

    if (sessionPublicId === undefined) {
      throw new Error('Session public ID is required to retrieve Session.');
    }
  }
}
