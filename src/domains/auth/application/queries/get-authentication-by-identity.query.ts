// -----------------------------------------------------------------------------
// Authentication — Get Authentication By Identity Query
// -----------------------------------------------------------------------------
//
// Retrieves the Authentication aggregate associated with a specific Identity.
//
// Relationship:
//
// IdentityAggregate
//        │
//        │ Identity public ID
//        ▼
// AuthenticationAggregate
// └── AuthenticationEntity
//
// Authentication references Identity through the opaque
// AuthenticationIdentityPublicId value object.
//
// Query responsibilities:
//
// - Carry the Identity public identifier.
// - Validate the query input shape.
// - Remain immutable.
// - Contain no business logic.
// - Contain no persistence logic.
// - Contain no Prisma dependencies.
//
// The corresponding query handler is responsible for:
//
// - loading the Authentication aggregate through the repository;
// - resolving Authentication by its Identity public reference;
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

import type { AuthenticationIdentityPublicId } from '../../domain/value-objects/authentication-identity-public-id.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for retrieving the Authentication associated with an Identity.
 *
 * Authentication is located through its opaque reference to the
 * Identity aggregate rather than through Authentication's own public ID.
 */
export class GetAuthenticationByIdentityQuery extends Query {
  /**
   * Creates a query for retrieving Authentication by Identity public ID.
   */
  public constructor(
    public readonly identityPublicId: AuthenticationIdentityPublicId,
  ) {
    super();

    if (identityPublicId === undefined) {
      throw new Error(
        'Identity public ID is required to retrieve Authentication.',
      );
    }
  }
}
