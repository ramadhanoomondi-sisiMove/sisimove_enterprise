// -----------------------------------------------------------------------------
// Get Verification By Public ID Query
// -----------------------------------------------------------------------------
//
// Application query for retrieving a Verification aggregate by its own
// public identifier.
//
// Query responsibility:
// - request a Verification aggregate by VerificationPublicId;
// - remain immutable;
// - contain no business logic;
// - contain no persistence concerns;
// - contain no aggregate mutation logic.
//
// This query is intentionally separate from:
//
//     GetVerificationQuery
//
// which retrieves the Verification aggregate by its owning IdentityPublicId.
//
// Query boundaries:
//
//     GetVerificationQuery
//         IdentityPublicId
//         → findByIdentityPublicId()
//
//     GetVerificationByPublicIdQuery
//         VerificationPublicId
//         → findByPublicId()
//
// HTTP usage:
//
//     GET /verifications/:verificationPublicId
//
// The HTTP route is a reviewer/query boundary and addresses the Verification
// aggregate directly by its public identifier.
//
// -----------------------------------------------------------------------------

import type { VerificationPublicId } from '../../domain/value-objects/verification-public-id.vo';

export class GetVerificationByPublicIdQuery {
  public constructor(
    public readonly verificationPublicId: VerificationPublicId,
  ) {}
}
