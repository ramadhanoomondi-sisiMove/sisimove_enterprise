// -----------------------------------------------------------------------------
// Identity — Get Verification Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving the Verification aggregate owned by
// an Identity.
//
// Responsibilities:
// - validate that the query contains an Identity public ID;
// - resolve the aggregate through VerificationRepository;
// - throw VerificationNotFoundException when no aggregate exists;
// - return the complete rehydrated aggregate.
//
// The repository owns aggregate reconstruction. This handler does not access
// Prisma, reconstruct entities, mutate domain state, persist data, or perform
// external side effects.
//
// Application flow:
//
//     GetVerificationQuery
//              │
//              ▼
//     validate identity public ID
//              │
//              ▼
// verificationRepository.findByIdentityPublicId()
//              │
//              ├── not found → VerificationNotFoundException
//              │
//              ▼
//       VerificationAggregate
//              │
//              ▼
//             return
//
// -----------------------------------------------------------------------------

import { BadRequestException, Inject, Injectable } from '@nestjs/common';

import { IDENTITY_TOKENS } from '../identity.tokens';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { GetVerificationQuery } from '../queries/get-verification.query';

import type { VerificationAggregate } from '../../domain/aggregates/verification.aggregate';

import type { VerificationRepository } from '../../domain/repositories/verification.repository';

import { VerificationNotFoundException } from '../../domain/exceptions/verification-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetVerificationHandler implements QueryHandler<
  GetVerificationQuery,
  VerificationAggregate
> {
  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.VERIFICATION)
    private readonly verificationRepository: VerificationRepository,
  ) {}

  /**
   * Returns the complete Verification aggregate associated with the supplied
   * Identity public ID.
   *
   * VerificationRepository.findByIdentityPublicId() is responsible for
   * rehydrating the aggregate and its owned verification requests.
   */
  public async execute(
    query: GetVerificationQuery,
  ): Promise<VerificationAggregate> {
    // Invalid input is a request error, not a "verification not found" error.
    if (query === undefined || query === null) {
      throw new BadRequestException('Get verification query is required.');
    }

    const identityPublicId = query.identityPublicId;

    if (
      identityPublicId === undefined ||
      identityPublicId === null ||
      typeof identityPublicId.value !== 'string' ||
      identityPublicId.value.trim().length === 0
    ) {
      throw new BadRequestException(
        'Verification identity public ID is required.',
      );
    }

    const aggregate =
      await this.verificationRepository.findByIdentityPublicId(
        identityPublicId,
      );

    if (aggregate === null) {
      throw new VerificationNotFoundException(
        `Verification for identity ${identityPublicId.value} was not found.`,
      );
    }

    return aggregate;
  }
}

export default GetVerificationHandler;
