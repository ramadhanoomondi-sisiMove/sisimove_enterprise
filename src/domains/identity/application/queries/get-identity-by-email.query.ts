// -----------------------------------------------------------------------------
// Identity — Get By Email Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving an existing Identity aggregate by its
// email address.
//
// The query carries a domain-ready IdentityEmail value object.
//
// Query behavior belongs to the application/query layer.
// Repository access and aggregate rehydration belong to the query handler.
//
// The query does NOT:
//
// - access persistence directly;
// - expose persistence models;
// - resolve internal entity identifiers;
// - mutate the Identity aggregate;
// - authenticate the Identity;
// - manage sessions;
// - evaluate permissions;
// - manage verification;
// - communicate with external systems.
//
// The query handler is responsible for resolving the Identity aggregate through
// the IdentityRepository.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { IdentityEmail } from '../../domain/value-objects';

// =============================================================================
// Query
// =============================================================================

/**
 * Query for retrieving an Identity aggregate by email address.
 *
 * The email remains represented by the IdentityEmail domain value object at
 * the application boundary.
 *
 * The query handler is responsible for:
 *
 * - querying IdentityRepository.findByEmail();
 * - retrieving the complete IdentityAggregate;
 * - returning the appropriate query result;
 * - handling the case where no Identity exists for the supplied email.
 *
 * The query itself contains no persistence or business logic.
 */
export class GetIdentityByEmailQuery extends Query {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Email address used to locate the Identity.
     *
     * This remains a domain value object rather than a primitive string so the
     * application boundary preserves domain validation and normalization.
     */
    public readonly email: IdentityEmail,
  ) {
    super();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetIdentityByEmailQuery;
