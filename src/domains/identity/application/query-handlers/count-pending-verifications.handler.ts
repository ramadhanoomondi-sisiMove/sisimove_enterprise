// -----------------------------------------------------------------------------
// Count Pending Verifications Handler
// -----------------------------------------------------------------------------
//
// Application query handler responsible for counting Verification aggregates
// whose lifecycle status is PENDING.
//
// Responsibilities:
//
// - execute CountPendingVerificationsQuery;
// - delegate counting to VerificationRepository;
// - return the total count;
// - avoid rehydrating complete Verification aggregates.
//
// Aggregate ownership:
//
// Identity
//   └── VerificationAggregate
//       ├── VerificationEntity
//       └── VerificationRequestEntity[]
//
// Counting rule:
//
// Counts pending Verification aggregates, not individual VerificationRequest
// entities.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import { IDENTITY_TOKENS } from '../identity.tokens';

import type { VerificationRepository } from '../../domain/repositories/verification.repository';

import type { CountPendingVerificationsQuery } from '../queries/count-pending-verifications.query';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class CountPendingVerificationsHandler implements QueryHandler<
  CountPendingVerificationsQuery,
  number
> {
  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.VERIFICATION)
    private readonly verificationRepository: VerificationRepository,
  ) {}

  public async execute(): Promise<number> {
    return this.verificationRepository.countPending();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CountPendingVerificationsHandler;
