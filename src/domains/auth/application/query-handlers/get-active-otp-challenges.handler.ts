// -----------------------------------------------------------------------------
// OTP Challenge — Get Active OTP Challenges Handler
// -----------------------------------------------------------------------------
//
// Handles:
//
// GetActiveOtpChallengesQuery
//
// Aggregate:
//
// OtpChallengeAggregate
// └── OtpChallengeEntity
//
// Active OTP Challenge semantics:
//
// - Persisted lifecycle status must be PENDING.
// - The challenge must not be dynamically expired.
// - Terminal challenges are therefore excluded.
//
// Repository operation:
//
// - findPending()
//
// The repository provides persisted PENDING challenges.
// The handler evaluates dynamic expiration through the aggregate.
//
// IMPORTANT:
//
// This handler does NOT expire or mutate challenges.
//
// If a persisted PENDING challenge has passed its expiresAt timestamp,
// it is simply excluded from the active query result. A separate expiration
// workflow is responsible for transitioning it to EXPIRED.
//
// This handler does NOT:
//
// - Generate OTPs.
// - Hash OTPs.
// - Compare OTP values.
// - Modify OTP Challenge aggregates.
// - Persist aggregates.
// - Access Prisma.
// - Send OTPs.
// - Send notifications.
// - Manage Recovery.
// - Manage Authentication.
// - Manage Sessions.
//
// Security:
//
// - No raw OTP values are exposed.
// - No OTP hashes are exposed by the query.
// - No authentication credentials are exposed.
// - No sensitive destination information is introduced by the query.
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

import type { GetActiveOtpChallengesQuery } from '../queries/get-active-otp-challenges.query';

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
 * Handles GetActiveOtpChallengesQuery.
 *
 * Retrieves OTP Challenges whose persisted lifecycle status is PENDING
 * and whose expiration timestamp has not yet been reached.
 */
@Injectable()
export class GetActiveOtpChallengesHandler implements QueryHandler<
  GetActiveOtpChallengesQuery,
  OtpChallengeAggregate[]
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
   * Executes the GetActiveOtpChallengesQuery.
   *
   * Only persisted PENDING challenges that are not dynamically expired
   * are returned.
   *
   * This operation is read-only and does not transition expired challenges.
   */
  public async execute(
    query: GetActiveOtpChallengesQuery,
  ): Promise<OtpChallengeAggregate[]> {
    if (query === undefined) {
      throw new OtpChallengeException(
        'Get active OTP Challenges query is required.',
      );
    }

    const pendingChallenges = await this.otpChallengeRepository.findPending();

    const referenceDate = new Date();

    return pendingChallenges.filter(
      (otpChallenge) => !otpChallenge.isExpired(referenceDate),
    );
  }
}
