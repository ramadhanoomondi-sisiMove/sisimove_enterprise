// -----------------------------------------------------------------------------
// Identity — Count Identities Handler
// -----------------------------------------------------------------------------
//
// Application query handler for counting existing Identity records.
//
// Responsibilities:
//
// 1. Receive CountIdentitiesQuery.
// 2. Delegate counting to IdentityRepository.
// 3. Return the total number of Identity records.
//
// Architectural boundaries:
//
// - Uses the IdentityRepository contract.
// - Does not access Prisma or persistence directly.
// - Does not rehydrate individual Identity aggregates.
// - Does not mutate Identity records.
// - Does not perform authorization; endpoint guards and permissions remain
//   responsible for protecting access.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Identity Application
// -----------------------------------------------------------------------------

import { IDENTITY_TOKENS } from '../identity.tokens';

// -----------------------------------------------------------------------------
// Identity Domain
// -----------------------------------------------------------------------------

import type { IdentityRepository } from '../../domain/repositories/identity.repository';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { CountIdentitiesQuery } from '../queries/count-identities.query';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class CountIdentitiesHandler implements QueryHandler<
  CountIdentitiesQuery,
  number
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.IDENTITY)
    private readonly identityRepository: IdentityRepository,
  ) {}

  // ===========================================================================
  // Execution
  // ===========================================================================

  /**
   * Counts all Identity records.
   *
   * Delegates to IdentityRepository.count() so persistence details remain
   * inside the infrastructure implementation.
   *
   * @returns Total number of Identity records.
   */
  public async execute(): Promise<number> {
    return this.identityRepository.count();
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default CountIdentitiesHandler;
