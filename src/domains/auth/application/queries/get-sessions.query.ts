// -----------------------------------------------------------------------------
// Session — Get Sessions Query
// -----------------------------------------------------------------------------
//
// Retrieves multiple Session aggregates.
//
// The query may optionally be scoped to a specific Identity.
//
// Query responsibilities:
//
// - Carry optional Session query criteria.
// - Support filtering Sessions by Identity public ID.
// - Validate the query input shape.
// - Remain immutable.
// - Contain no business logic.
// - Contain no persistence logic.
// - Contain no Prisma dependencies.
//
// The corresponding query handler is responsible for:
//
// - resolving Sessions through the repository;
// - applying query criteria;
// - mapping aggregates to application read models or DTOs.
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
// Query Props
// =============================================================================

export interface GetSessionsQueryProps {
  /**
   * Optional opaque public reference to the Identity aggregate.
   *
   * When provided, only Sessions belonging to this Identity should
   * be retrieved.
   */
  identityPublicId?: SessionIdentityPublicId;
}

// =============================================================================
// Query
// =============================================================================

/**
 * Query for retrieving multiple Session aggregates.
 *
 * Sessions may optionally be filtered by their associated Identity.
 *
 * Additional read concerns such as pagination, ordering, or status filtering
 * should be added explicitly when those capabilities are required by the
 * application use case.
 */
export class GetSessionsQuery extends Query {
  /**
   * Optional query criteria.
   */
  public readonly identityPublicId: SessionIdentityPublicId | undefined;

  /**
   * Creates a query for retrieving Sessions.
   */
  public constructor(props: GetSessionsQueryProps = {}) {
    super();

    this.identityPublicId = props.identityPublicId;
  }
}
