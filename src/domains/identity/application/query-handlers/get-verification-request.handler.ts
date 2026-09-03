// -----------------------------------------------------------------------------
// Identity — Get Verification Request Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving a single VerificationRequestEntity
// owned by a Verification aggregate.
//
// Aggregate:
//
// VerificationAggregate
// ├── VerificationEntity
// └── VerificationRequestEntity[]
//
// VerificationRequestEntity is a child entity and is therefore resolved
// exclusively through its owning VerificationAggregate.
//
// Responsibilities:
//
// - resolve the VerificationAggregate by VerificationPublicId;
// - ensure the aggregate exists;
// - resolve the requested VerificationRequestEntity through the aggregate;
// - return the owned request.
//
// The handler does NOT:
//
// - mutate VerificationEntity;
// - mutate VerificationRequestEntity;
// - create Verification Requests;
// - submit Verification Requests;
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
// - introduce a VerificationRequestRepository;
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
//     GetVerificationRequestQuery
//              │
//              ▼
// verificationRepository.findByPublicId()
//              │
//              ├── Verification not found → throw
//              │
//              ▼
//       VerificationAggregate
//              │
//              ▼
// aggregate.getRequest(requestPublicId)
//              │
//              ├── Request not found → throw
//              │
//              ▼
//   VerificationRequestEntity
//              │
//              ▼
//             return
//
// -----------------------------------------------------------------------------
//
// Ownership boundary:
//
// VerificationRequestEntity cannot be independently resolved from a repository
// because it is not an aggregate root.
//
// The handler therefore deliberately resolves:
//
//     VerificationAggregate
//
// first, and then obtains:
//
//     verificationAggregate.getRequest(requestPublicId)
//
// This also guarantees that the requested request belongs to the specified
// Verification aggregate.
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

import type { GetVerificationRequestQuery } from '../queries/get-verification-request.query';

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

// -----------------------------------------------------------------------------
// Request Exceptions
// -----------------------------------------------------------------------------

import { VerificationRequestNotFoundException } from '../../domain/exceptions/verification-request-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles retrieval of a single VerificationRequestEntity owned by a
 * Verification aggregate.
 *
 * The repository rehydrates the complete aggregate:
 *
 * VerificationAggregate
 * ├── VerificationEntity
 * └── VerificationRequestEntity[]
 *
 * The request is then resolved through the aggregate ownership boundary.
 *
 * No domain mutation occurs during query execution.
 */
@Injectable()
export class GetVerificationRequestHandler implements QueryHandler<
  GetVerificationRequestQuery,
  VerificationRequestEntity
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
   * Executes the GetVerificationRequestQuery.
   *
   * Returns the requested VerificationRequestEntity when it exists within the
   * specified Verification aggregate.
   */
  public async execute(
    query: GetVerificationRequestQuery,
  ): Promise<VerificationRequestEntity> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new VerificationNotFoundException(
        'Get verification request query is required.',
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
    // 3. Verification Request public ID guard
    // -------------------------------------------------------------------------

    if (query.requestPublicId === undefined) {
      throw new VerificationRequestNotFoundException(
        'Verification request public ID is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 4. Load complete Verification aggregate
    // -------------------------------------------------------------------------
    //
    // The repository is responsible for rehydrating:
    //
    // VerificationAggregate
    // ├── VerificationEntity
    // └── VerificationRequestEntity[]
    //
    // No request is queried independently.
    // -------------------------------------------------------------------------

    const aggregate = await this.verificationRepository.findByPublicId(
      query.verificationPublicId,
    );

    // -------------------------------------------------------------------------
    // 5. Ensure Verification exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new VerificationNotFoundException(
        `Verification ${query.verificationPublicId.value} was not found.`,
      );
    }

    // -------------------------------------------------------------------------
    // 6. Resolve request through aggregate boundary
    // -------------------------------------------------------------------------
    //
    // getRequest() guarantees that the requested VerificationRequestEntity
    // belongs to this Verification aggregate.
    // -------------------------------------------------------------------------

    const request = aggregate.getRequest(query.requestPublicId);

    // -------------------------------------------------------------------------
    // 7. Return request
    // -------------------------------------------------------------------------

    return request;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetVerificationRequestHandler;
