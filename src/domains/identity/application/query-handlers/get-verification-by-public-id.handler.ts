// -----------------------------------------------------------------------------
// Get Verification By Public ID Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving a Verification aggregate by its
// own public identifier.
//
// Query boundary:
//
//     GetVerificationByPublicIdQuery
//         VerificationPublicId
//             ↓
//     VerificationRepository.findByPublicId()
//             ↓
//     VerificationAggregate
//
// This handler is intentionally separate from GetVerificationHandler.
//
// GetVerificationHandler:
//
//     IdentityPublicId
//         → findByIdentityPublicId()
//
// GetVerificationByPublicIdHandler:
//
//     VerificationPublicId
//         → findByPublicId()
//
// The distinction is important because these are two different application
// lookup boundaries even though both return the same aggregate.
//
// Responsibilities:
// - validate the query input;
// - delegate retrieval to the VerificationRepository;
// - return the Verification aggregate;
// - translate a missing aggregate into the domain not-found exception.
//
// Non-responsibilities:
// - HTTP concerns;
// - authentication;
// - authorization;
// - persistence implementation;
// - aggregate mutation;
// - response mapping.
//
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import { IDENTITY_TOKENS } from '../identity.tokens';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { GetVerificationByPublicIdQuery } from '../queries/get-verification-by-public-id.query';

import type { VerificationAggregate } from '../../domain/aggregates/verification.aggregate';

import type { VerificationRepository } from '../../domain/repositories/verification.repository';

import { VerificationNotFoundException } from '../../domain/exceptions/verification-not-found.exception';

@Injectable()
export class GetVerificationByPublicIdHandler implements QueryHandler<
  GetVerificationByPublicIdQuery,
  VerificationAggregate
> {
  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.VERIFICATION)
    private readonly verificationRepository: VerificationRepository,
  ) {}

  public async execute(
    query: GetVerificationByPublicIdQuery,
  ): Promise<VerificationAggregate> {
    if (query === undefined || query === null) {
      throw new VerificationNotFoundException(
        'Get verification by public ID query is required.',
      );
    }

    if (
      query.verificationPublicId === undefined ||
      query.verificationPublicId === null
    ) {
      throw new VerificationNotFoundException(
        'Verification public ID is required.',
      );
    }

    const aggregate = await this.verificationRepository.findByPublicId(
      query.verificationPublicId,
    );

    if (aggregate === null) {
      throw new VerificationNotFoundException(
        `Verification ${query.verificationPublicId.value} was not found.`,
      );
    }

    return aggregate;
  }
}
