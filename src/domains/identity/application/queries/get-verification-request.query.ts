// -----------------------------------------------------------------------------
// Get Verification Request Query
// -----------------------------------------------------------------------------
//
// Read-model query for retrieving a single Verification Request owned by a
// Verification aggregate.
//
// Aggregate ownership:
//
// VerificationAggregate
// └── VerificationEntity
//     └── VerificationRequestEntity[]
//
// Query responsibility:
//
// - identify the owning Verification aggregate;
// - identify the requested Verification Request;
// - remain immutable;
// - contain no business logic;
// - contain no persistence concerns;
// - contain no aggregate mutation logic.
//
// IMPORTANT
//
// VerificationRequestEntity is an owned child entity, not an aggregate root.
//
// Therefore this query does NOT introduce a VerificationRequestRepository.
// The application handler must resolve the Verification aggregate and obtain
// the requested request through the aggregate boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { VerificationPublicId } from '../../domain/value-objects/verification-public-id.vo';

import type { VerificationRequestPublicId } from '../../domain/value-objects/verification-request-public-id.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Requests a single Verification Request owned by a Verification aggregate.
 *
 * Both identifiers are required because VerificationRequestEntity is only
 * meaningful within the ownership boundary of its Verification aggregate.
 */
export class GetVerificationRequestQuery {
  public constructor(
    /**
     * Public identifier of the owning Verification aggregate.
     */
    public readonly verificationPublicId: VerificationPublicId,

    /**
     * Public identifier of the owned Verification Request.
     */
    public readonly requestPublicId: VerificationRequestPublicId,
  ) {}
}
