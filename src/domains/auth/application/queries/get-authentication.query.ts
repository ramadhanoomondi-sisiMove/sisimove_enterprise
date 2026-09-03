// -----------------------------------------------------------------------------
// Authentication — Get Authentication Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving an Authentication aggregate by its public
// identifier.
//
// Query:
//
//     Get Authentication
//
// The query represents read intent only.
//
// It does NOT:
//
// - load the Authentication aggregate;
// - access the repository;
// - access Prisma;
// - perform authorization;
// - validate Identity state;
// - contain business logic;
// - map the aggregate to a DTO.
//
// The corresponding query handler is responsible for:
//
// - loading Authentication through AuthenticationRepository;
// - handling the not-found case;
// - mapping the aggregate to the application read model / DTO.
//
// -----------------------------------------------------------------------------
//
// Query input:
//
// - authenticationPublicId
//
// The query carries the domain-ready AuthenticationPublicId value object
// rather than a raw transport primitive.
//
// DTO-to-domain conversion belongs at the presentation/application boundary.
//
// -----------------------------------------------------------------------------
//
// Immutability:
//
// Query properties are readonly and the query contains no mutable state.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Exceptions
// -----------------------------------------------------------------------------

import { AuthenticationException } from '../../domain/exceptions/authentication.exception';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { AuthenticationPublicId } from '../../domain/value-objects/authentication-public-id.vo';

// =============================================================================
// Query
// =============================================================================

/**
 * Query for retrieving a single Authentication aggregate by its public
 * identifier.
 *
 * The query contains only the information required to identify the
 * Authentication being requested.
 */
export class GetAuthenticationQuery extends Query {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    /**
     * Public identifier of the Authentication aggregate to retrieve.
     */
    public readonly authenticationPublicId: AuthenticationPublicId,
  ) {
    super();

    GetAuthenticationQuery.ensureValidPublicId(authenticationPublicId);
  }

  // ===========================================================================
  // Validation
  // ===========================================================================

  /**
   * Ensures that the Authentication public identifier is supplied.
   *
   * The value object's own invariants remain responsible for validating the
   * actual structure and value of the identifier.
   */
  private static ensureValidPublicId(
    authenticationPublicId: AuthenticationPublicId,
  ): void {
    if (authenticationPublicId === undefined) {
      throw new AuthenticationException(
        'Authentication public ID is required to retrieve Authentication.',
      );
    }
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetAuthenticationQuery;
