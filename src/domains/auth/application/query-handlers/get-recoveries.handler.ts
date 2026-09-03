// -----------------------------------------------------------------------------
// Recovery — Get Recoveries Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving multiple Recovery aggregates.
//
// Aggregate:
//
// RecoveryAggregate
// └── RecoveryEntity
//
// Responsibilities:
//
// - resolve Recovery aggregates through RecoveryRepository;
// - ensure the query exists;
// - retrieve the complete Recovery aggregate collection;
// - return the rehydrated aggregates.
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
// - persist aggregates;
// - access Prisma directly;
// - resolve persistence models;
// - validate Identity domain state;
// - load Identity aggregates;
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
//     GetRecoveriesQuery
//            │
//            ▼
// recoveryRepository.findAll()
//            │
//            ▼
//     RecoveryAggregate[]
//            │
//            ▼
//          return
//
// -----------------------------------------------------------------------------
//
// Aggregate retrieval:
//
// RecoveryRepository.findAll() is responsible for retrieving and rehydrating
// the complete Recovery aggregate collection:
//
// RecoveryAggregate[]
// └── RecoveryAggregate
//      └── RecoveryEntity
//
// The handler intentionally does not reconstruct aggregates itself.
//
// -----------------------------------------------------------------------------
//
// Empty result:
//
// An empty Recovery collection is a valid query result.
//
// No exception is thrown when no Recovery aggregates exist.
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

import type { GetRecoveriesQuery } from '../queries/get-recoveries.query';

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
 * Handles retrieval of multiple Recovery aggregates.
 *
 * The repository is responsible for retrieving and rehydrating the complete
 * aggregate collection.
 *
 * RecoveryAggregate[]
 * └── RecoveryAggregate
 *      └── RecoveryEntity
 *
 * The handler performs no domain mutation.
 */
@Injectable()
export class GetRecoveriesHandler implements QueryHandler<
  GetRecoveriesQuery,
  RecoveryAggregate[]
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
   * Executes the GetRecoveriesQuery.
   *
   * Returns all Recovery aggregates.
   *
   * An empty collection is a valid result when no Recovery aggregates exist.
   */
  public async execute(
    query: GetRecoveriesQuery,
  ): Promise<RecoveryAggregate[]> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new RecoveryException('Recovery query is required.');
    }

    // -------------------------------------------------------------------------
    // 2. Load complete aggregate collection
    // -------------------------------------------------------------------------
    //
    // The repository is responsible for retrieving and rehydrating the
    // complete Recovery aggregates.
    //
    // RecoveryAggregate[]
    // └── RecoveryAggregate
    //      └── RecoveryEntity
    //
    // Rehydration must not emit domain events.
    // -------------------------------------------------------------------------

    const aggregates = await this.recoveryRepository.findAll();

    // -------------------------------------------------------------------------
    // 3. Return aggregate collection
    // -------------------------------------------------------------------------
    //
    // An empty collection is valid.
    //
    // The handler must not convert an empty result into a not-found
    // exception because this is a collection query.
    // -------------------------------------------------------------------------

    return aggregates;
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetRecoveriesHandler;
