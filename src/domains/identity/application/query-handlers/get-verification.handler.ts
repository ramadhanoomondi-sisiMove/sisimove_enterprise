// -----------------------------------------------------------------------------
// Identity — Get Verification Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving the Verification aggregate owned by
// an Identity.
//
// Aggregate:
//
// VerificationAggregate
// ├── VerificationEntity
// └── VerificationRequestEntity[]
//
// Responsibilities:
//
// - resolve the Verification aggregate through Identity public identity;
// - ensure the Verification exists;
// - return the complete rehydrated aggregate.
//
// The handler does NOT:
//
// - mutate VerificationEntity;
// - mutate VerificationRequestEntity;
// - create VerificationRequestEntity;
// - approve or reject Verification Requests;
// - grant MEMBER or DRIVER verification;
// - reject, reopen, expire, or revoke Verification;
// - create domain events;
// - persist the aggregate;
// - access Prisma directly;
// - expose persistence models;
// - modify Identity;
// - modify Identity roles;
// - perform external verification-provider operations;
// - send notifications;
// - perform external side effects.
//
// Query behavior belongs to the application layer.
// Aggregate reconstruction belongs to the repository/infrastructure layer.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     GetVerificationQuery
//              │
//              ▼
// verificationRepository.findByIdentityPublicId()
//              │
//              ├── not found → throw
//              │
//              ▼
//       VerificationAggregate
//              │
//              ▼
//             return
//
// -----------------------------------------------------------------------------
//
// Aggregate retrieval:
//
// VerificationRepository.findByIdentityPublicId() is responsible for
// rehydrating the complete aggregate:
//
// VerificationAggregate
// ├── VerificationEntity
// └── VerificationRequestEntity[]
//
// The handler intentionally does not reconstruct entities or requests itself.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { IDENTITY_TOKENS } from '../identity.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetVerificationQuery } from '../queries/get-verification.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { VerificationAggregate } from '../../domain/aggregates/verification.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { VerificationRepository } from '../../domain/repositories/verification.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { VerificationNotFoundException } from '../../domain/exceptions/verification-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles retrieval of the Verification aggregate associated with an Identity.
 *
 * The repository is responsible for returning the complete aggregate:
 *
 * VerificationAggregate
 * ├── VerificationEntity
 * └── VerificationRequestEntity[]
 *
 * The handler performs no domain mutation.
 */
@Injectable()
export class GetVerificationHandler implements QueryHandler<
  GetVerificationQuery,
  VerificationAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.VERIFICATION)
    private readonly verificationRepository: VerificationRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the GetVerificationQuery.
   *
   * Returns the complete Verification aggregate associated with the supplied
   * Identity.
   */
  public async execute(
    query: GetVerificationQuery,
  ): Promise<VerificationAggregate> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new VerificationNotFoundException(
        'Get verification query is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Identity public ID guard
    // -------------------------------------------------------------------------

    if (query.identityPublicId === undefined) {
      throw new VerificationNotFoundException(
        'Verification identity public ID is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 3. Load complete Verification aggregate
    // -------------------------------------------------------------------------
    //
    // The repository resolves the Verification through the owning Identity:
    //
    // Identity
    //   └── Verification
    //
    // The repository must rehydrate the complete aggregate, including all
    // aggregate-owned VerificationRequestEntity instances.
    // -------------------------------------------------------------------------

    const aggregate = await this.verificationRepository.findByIdentityPublicId(
      query.identityPublicId,
    );

    // -------------------------------------------------------------------------
    // 4. Ensure aggregate exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new VerificationNotFoundException(
        `Verification for identity ${query.identityPublicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // 5. Return aggregate
    // -------------------------------------------------------------------------

    return aggregate;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetVerificationHandler;
