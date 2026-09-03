// -----------------------------------------------------------------------------
// Get Verification Query
// -----------------------------------------------------------------------------
//
// Read-model query for retrieving the Verification aggregate associated with
// an Identity.
//
// This query intentionally identifies Verification through the owning
// Identity's public identifier rather than exposing persistence identifiers.
//
// Query responsibility:
//
// - request the Verification belonging to an Identity;
// - remain immutable;
// - contain no business logic;
// - contain no persistence concerns;
// - contain no aggregate mutation logic.
//
// The query handler is responsible for:
//
// - resolving the Verification aggregate or read model;
// - translating the result into the application response;
// - deciding how "not found" is represented at the application boundary.
//
// Aggregate ownership:
//
// Identity
//   └── VerificationAggregate
//       ├── VerificationEntity
//       └── VerificationRequestEntity[]
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { IdentityPublicId } from '../../domain/value-objects/identity-public-id.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Requests the Verification associated with a specific Identity.
 *
 * The Identity public identifier is the authoritative cross-aggregate
 * reference used to locate the Verification.
 */
export class GetVerificationQuery {
  public constructor(
    /**
     * Public identifier of the Identity that owns the Verification.
     */
    public readonly identityPublicId: IdentityPublicId,
  ) {}
}
