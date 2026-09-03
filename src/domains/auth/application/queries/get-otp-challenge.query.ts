// -----------------------------------------------------------------------------
// OTP Challenge — Get OTP Challenge Query
// -----------------------------------------------------------------------------
//
// Retrieves a specific OTP Challenge aggregate by its public identity.
//
// Aggregate:
//
// OtpChallengeAggregate
// └── OtpChallengeEntity
//
// Query responsibilities:
//
// - Carry the OTP Challenge public identifier.
// - Validate the query input shape.
// - Remain immutable.
// - Contain no business logic.
// - Contain no persistence logic.
// - Contain no Prisma dependencies.
//
// The corresponding query handler is responsible for:
//
// - loading the OTP Challenge aggregate through the repository;
// - resolving the aggregate by its public identity;
// - handling the not-found case;
// - mapping the aggregate to the application read model or DTO.
//
// Security:
//
// - No OTP value is carried by this query.
// - No OTP hash is carried by this query.
// - No authentication credential is carried by this query.
// - No sensitive OTP material is exposed through the query.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Query } from '../../../../foundation/kernel/application/query';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { OtpChallengePublicId } from '../../domain/value-objects/otp-challenge-public-id.vo';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

/**
 * Query for retrieving an OTP Challenge by its public identity.
 *
 * The public identifier is the externally safe identity of the
 * OtpChallenge aggregate.
 */
export class GetOtpChallengeQuery extends Query {
  /**
   * Creates a query for retrieving an OTP Challenge by public ID.
   */
  public constructor(public readonly publicId: OtpChallengePublicId) {
    super();

    if (publicId === undefined) {
      throw new Error(
        'OTP Challenge public ID is required to retrieve OTP Challenge.',
      );
    }
  }
}
