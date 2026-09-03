// -----------------------------------------------------------------------------
// OTP Challenge — Get OTP Challenge Handler
// -----------------------------------------------------------------------------
//
// Handles:
//
// GetOtpChallengeQuery
//
// Aggregate:
//
// OtpChallengeAggregate
// └── OtpChallengeEntity
//
// Handler responsibilities:
//
// - Execute GetOtpChallengeQuery.
// - Retrieve the OTP Challenge aggregate by public identity.
// - Handle the not-found case.
// - Return the retrieved aggregate.
//
// This handler does NOT:
//
// - Contain OTP business rules.
// - Generate OTPs.
// - Hash OTPs.
// - Compare OTP values.
// - Modify the OTP Challenge aggregate.
// - Access Prisma directly.
// - Access persistence models directly.
// - Communicate with external systems.
//
// Persistence is accessed exclusively through OtpChallengeRepository.
//
// Security:
//
// - The query contains only the OTP Challenge public ID.
// - No raw OTP is exposed by the query.
// - No OTP hash is accepted by the query.
// - No authentication credentials are accepted by the query.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------

import { AUTH_TOKENS } from '../auth.tokens';

// -----------------------------------------------------------------------------
// Application Query
// -----------------------------------------------------------------------------

import type { GetOtpChallengeQuery } from '../queries/get-otp-challenge.query';

// -----------------------------------------------------------------------------
// Domain Aggregate
// -----------------------------------------------------------------------------

import type { OtpChallengeAggregate } from '../../domain/aggregates/otp-challenge.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { OtpChallengeRepository } from '../../domain/repositories/otp-challenge.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { OtpChallengeException } from '../../domain/exceptions/otp-challenge.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles GetOtpChallengeQuery.
 *
 * Retrieves a single OtpChallenge aggregate using its public identity.
 */
@Injectable()
export class GetOtpChallengeHandler implements QueryHandler<
  GetOtpChallengeQuery,
  OtpChallengeAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(AUTH_TOKENS.REPOSITORIES.OTP_CHALLENGE)
    private readonly otpChallengeRepository: OtpChallengeRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the GetOtpChallengeQuery.
   *
   * @throws OtpChallengeException when the OTP Challenge cannot be found.
   */
  public async execute(
    query: GetOtpChallengeQuery,
  ): Promise<OtpChallengeAggregate> {
    if (query === undefined) {
      throw new OtpChallengeException('Get OTP Challenge query is required.');
    }

    const otpChallenge = await this.otpChallengeRepository.findByPublicId(
      query.publicId,
    );

    if (otpChallenge === null) {
      throw new OtpChallengeException(
        `OTP Challenge with public ID "${query.publicId.value}" was not found.`,
      );
    }

    return otpChallenge;
  }
}
