// -----------------------------------------------------------------------------
// Recovery — Get Recovery Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving a Recovery aggregate.
//
// Aggregate:
//
// RecoveryAggregate
// └── RecoveryEntity
//
// Responsibilities:
//
// - resolve the Recovery aggregate through RecoveryRepository;
// - ensure the query exists;
// - ensure the Recovery public ID exists;
// - ensure the aggregate exists;
// - return the complete rehydrated aggregate.
//
// The handler does NOT:
//
// - mutate RecoveryEntity;
// - complete, cancel, or expire Recovery;
// - change recovery-token state;
// - generate recovery tokens;
// - hash recovery tokens;
// - compare recovery tokens;
// - create domain events;
// - persist the aggregate;
// - access Prisma directly;
// - resolve persistence models;
// - validate Identity domain state;
// - load the Identity aggregate;
// - reset passwords;
// - authenticate users;
// - create Sessions;
// - manage Devices;
// - generate OTP challenges;
// - perform authorization;
// - perform external side effects.
//
// Query behavior belongs to the application layer.
// Aggregate reconstruction belongs to the repository/infrastructure layer.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     GetRecoveryQuery
//            │
//            ▼
// recoveryRepository.findByPublicId()
//            │
//            ├── not found → throw
//            │
//            ▼
//     RecoveryAggregate
//            │
//            ▼
//          return
//
// -----------------------------------------------------------------------------
//
// Aggregate retrieval:
//
// RecoveryRepository.findByPublicId() is responsible for returning the
// complete Recovery aggregate:
//
// RecoveryAggregate
// └── RecoveryEntity
//
// The handler intentionally does not reconstruct the aggregate itself.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Application — Tokens
// -----------------------------------------------------------------------------

import { AUTH_TOKENS } from '../auth.tokens';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetRecoveryQuery } from '../queries/get-recovery.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { RecoveryAggregate } from '../../domain/aggregates/recovery.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { RecoveryRepository } from '../../domain/repositories/recovery.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { RecoveryException } from '../../domain/exceptions/recovery.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles retrieval of a Recovery aggregate by public identifier.
 *
 * The repository is responsible for rehydrating the complete aggregate:
 *
 * RecoveryAggregate
 * └── RecoveryEntity
 *
 * The handler performs no domain mutation.
 */
@Injectable()
export class GetRecoveryHandler implements QueryHandler<
  GetRecoveryQuery,
  RecoveryAggregate
> {
  // ===========================================================================

  // Constructor

  // ===========================================================================

  public constructor(
    @Inject(AUTH_TOKENS.REPOSITORIES.RECOVERY)
    private readonly recoveryRepository: RecoveryRepository,
  ) {}

  // ===========================================================================

  // Execute

  // ===========================================================================

  /**
   * Executes the GetRecoveryQuery.
   *
   * Returns the complete Recovery aggregate when it exists.
   */
  public async execute(query: GetRecoveryQuery): Promise<RecoveryAggregate> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new RecoveryException('Recovery query is required.');
    }

    // -------------------------------------------------------------------------
    // 2. Recovery public ID guard
    // -------------------------------------------------------------------------

    if (query.recoveryPublicId === undefined) {
      throw new RecoveryException('Recovery public ID is required.');
    }

    // -------------------------------------------------------------------------
    // 3. Load complete aggregate
    // -------------------------------------------------------------------------
    //
    // RecoveryRepository.findByPublicId() is responsible for returning
    // the rehydrated Recovery aggregate:
    //
    // RecoveryAggregate
    // └── RecoveryEntity
    //
    // Rehydration must not emit domain events.
    // -------------------------------------------------------------------------

    const aggregate = await this.recoveryRepository.findByPublicId(
      query.recoveryPublicId,
    );

    // -------------------------------------------------------------------------
    // 4. Ensure aggregate exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new RecoveryException(
        `Recovery ${query.recoveryPublicId.value} was not found.`,
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

export default GetRecoveryHandler;
