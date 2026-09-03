// -----------------------------------------------------------------------------
// Identity — Get Verification Requests Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving the Verification Requests owned by
// a specific Verification aggregate.
//
// Aggregate:
//
// VerificationAggregate
// ├── VerificationEntity
// └── VerificationRequestEntity[]
//
// VerificationRequestEntity is a child entity owned by VerificationAggregate.
// It is therefore read through its owning aggregate rather than through an
// independent VerificationRequestRepository.
//
// Responsibilities:
//
// - resolve the VerificationAggregate by VerificationPublicId;
// - ensure the aggregate exists;
// - return the aggregate-owned VerificationRequestEntity collection.
//
// The handler does NOT:
//
// - mutate VerificationEntity;
// - mutate VerificationRequestEntity;
// - create Verification Requests;
// - approve Verification Requests;
// - reject Verification Requests;
// - cancel Verification Requests;
// - expire Verification Requests;
// - grant MEMBER verification;
// - grant DRIVER verification;
// - reject, reopen, expire, or revoke Verification;
// - create domain events;
// - persist the aggregate;
// - access Prisma directly;
// - expose persistence models;
// - modify Identity;
// - perform verification-provider operations;
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
//     GetVerificationRequestsQuery
//              │
//              ▼
// verificationRepository.findByPublicId()
//              │
//              ├── not found → throw
//              │
//              ▼
//       VerificationAggregate
//              │
//              ▼
//         aggregate.requests
//              │
//              ▼
//             return
//
// -----------------------------------------------------------------------------
//
// Aggregate boundary:
//
// VerificationRequestEntity remains owned by VerificationAggregate.
//
// Therefore the handler intentionally does NOT:
//
// - inject VerificationRequestRepository;
// - query VerificationRequestEntity independently;
// - reconstruct request entities itself.
//
// The authoritative request collection is:
//
//     verificationAggregate.requests
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

import type { GetVerificationRequestsQuery } from '../queries/get-verification-requests.query';

// -----------------------------------------------------------------------------
// Entity
// -----------------------------------------------------------------------------

import type { VerificationRequestEntity } from '../../domain/entities/verification-request.entity';

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
 * Handles retrieval of all Verification Requests owned by a Verification
 * aggregate.
 *
 * The repository rehydrates the complete aggregate:
 *
 * VerificationAggregate
 * ├── VerificationEntity
 * └── VerificationRequestEntity[]
 *
 * The handler performs no domain mutation.
 */
@Injectable()
export class GetVerificationRequestsHandler implements QueryHandler<
  GetVerificationRequestsQuery,
  readonly VerificationRequestEntity[]
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
   * Executes the GetVerificationRequestsQuery.
   *
   * Returns all VerificationRequestEntity instances owned by the specified
   * Verification aggregate.
   */
  public async execute(
    query: GetVerificationRequestsQuery,
  ): Promise<readonly VerificationRequestEntity[]> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new VerificationNotFoundException(
        'Get verification requests query is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Verification public ID guard
    // -------------------------------------------------------------------------

    if (query.verificationPublicId === undefined) {
      throw new VerificationNotFoundException(
        'Verification public ID is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 3. Load complete Verification aggregate
    // -------------------------------------------------------------------------
    //
    // The repository resolves the aggregate by its public identity and
    // rehydrates all aggregate-owned VerificationRequestEntity instances.
    // -------------------------------------------------------------------------

    const aggregate = await this.verificationRepository.findByPublicId(
      query.verificationPublicId,
    );

    // -------------------------------------------------------------------------
    // 4. Ensure Verification exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new VerificationNotFoundException(
        `Verification ${query.verificationPublicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // 5. Return aggregate-owned requests
    // -------------------------------------------------------------------------
    //
    // VerificationAggregate.requests is the authoritative read boundary for
    // VerificationRequestEntity children.
    //
    // The returned collection is already exposed by the aggregate as a
    // read-only collection.
    // -------------------------------------------------------------------------

    return aggregate.requests;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetVerificationRequestsHandler;
