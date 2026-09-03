// -----------------------------------------------------------------------------
// Session — Get Active Sessions Query
// -----------------------------------------------------------------------------
//
// Retrieves all currently active Session aggregates belonging to an Identity.
//
// Aggregate:
//
// SessionAggregate
// └── SessionEntity
//
// Query responsibilities:
//
// - Carry the Identity public identifier.
// - Remain immutable.
// - Contain no business logic.
// - Contain no persistence logic.
// - Contain no Prisma dependencies.
//
// The corresponding query handler is responsible for:
//
// - retrieving active Sessions through SessionRepository;
// - scoping the retrieval to the supplied Identity;
// - returning the retrieved aggregates.
//
// Repository operation:
//
// - SessionRepository.findActiveByIdentityPublicId()
//
// An Identity with no active Sessions is a valid result and therefore
// produces an empty collection rather than a not-found error.
//
// Security:
//
// - No refresh token is carried by this query.
// - No refresh-token hash is carried by this query.
// - No session credential is carried by this query.
// - No authentication credential is carried by this query.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { SessionIdentityPublicId } from '../../domain/value-objects/session-identity-public-id.vo';

// =============================================================================
// Query
// =============================================================================

/**
 * Query for retrieving all active Session aggregates belonging to an
 * Identity.
 *
 * The Identity public identifier is required because this query represents
 * the Identity-scoped active-session use case.
 */
export class GetActiveSessionsQuery extends Query {
  /**
   * Opaque public reference to the Identity aggregate.
   */
  public readonly identityPublicId: SessionIdentityPublicId;

  /**
   * Creates a query for retrieving active Sessions belonging to an Identity.
   */
  public constructor(identityPublicId: SessionIdentityPublicId) {
    super();

    if (identityPublicId === undefined) {
      throw new Error(
        'Identity public ID is required to retrieve active Sessions.',
      );
    }

    this.identityPublicId = identityPublicId;
  }
}
