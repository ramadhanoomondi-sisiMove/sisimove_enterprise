// -----------------------------------------------------------------------------
// Get Verification Requests Query
// -----------------------------------------------------------------------------
//
// Read-model query for retrieving the Verification Requests owned by a
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
// - identify the Verification aggregate;
// - request its owned Verification Requests;
// - remain immutable;
// - contain no business logic;
// - contain no persistence concerns;
// - contain no aggregate mutation logic.
//
// The query handler is responsible for:
//
// - loading the Verification aggregate/read model;
// - retrieving the owned requests;
// - translating them into the application response.
//
// VerificationRequestEntity is NOT an independent aggregate and therefore
// this query does not introduce a VerificationRequestRepository.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { VerificationPublicId } from '../../domain/value-objects/verification-public-id.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Requests all Verification Requests owned by a Verification aggregate.
 *
 * Verification is identified through its public identifier.
 */
export class GetVerificationRequestsQuery {
  public constructor(
    /**
     * Public identifier of the Verification aggregate whose requests
     * should be retrieved.
     */
    public readonly verificationPublicId: VerificationPublicId,
  ) {}
}
