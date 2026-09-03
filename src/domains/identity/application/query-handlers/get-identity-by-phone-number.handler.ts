// -----------------------------------------------------------------------------
// Identity — Get Identity By Phone Number Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving an Identity aggregate by phone
// number.
//
// Aggregate:
//
// IdentityAggregate
// └── IdentityEntity
//     └── IdentityRoleEntity[]
//
// Responsibilities:
//
// - resolve the Identity aggregate through IdentityRepository.findByPhoneNumber();
// - ensure the aggregate exists;
// - return the complete rehydrated aggregate.
//
// The handler does NOT:
//
// - mutate IdentityEntity;
// - mutate IdentityRoleEntity;
// - activate, suspend, or close Identity;
// - assign or revoke Identity Roles;
// - create domain events;
// - persist the aggregate;
// - access Prisma directly;
// - expose persistence models;
// - execute authentication;
// - manage sessions or devices;
// - perform OTP verification;
// - manage Recovery;
// - manage Verification;
// - evaluate authorization;
// - perform external side effects.
//
// Query behavior belongs to the application layer.
// Aggregate reconstruction belongs to the repository/infrastructure layer.
//
// -----------------------------------------------------------------------------
//
// Application flow:
//
//     GetIdentityByPhoneNumberQuery
//                │
//                ▼
// identityRepository.findByPhoneNumber()
//                │
//                ├── not found → throw
//                │
//                ▼
//        IdentityAggregate
//                │
//                ▼
//              return
//
// -----------------------------------------------------------------------------
//
// Domain boundary:
//
// The query accepts IdentityPhoneNumber rather than a raw string.
//
// IdentityRepository is responsible for translating the IdentityPhoneNumber
// value object into the persistence representation required by the underlying
// store.
//
// The handler never performs that translation itself.
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

import type { GetIdentityByPhoneNumberQuery } from '../queries/get-identity-by-phone-number.query';

// -----------------------------------------------------------------------------
// Aggregate
// -----------------------------------------------------------------------------

import type { IdentityAggregate } from '../../domain/aggregates/identity.aggregate';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { IdentityRepository } from '../../domain/repositories/identity.repository';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { IdentityNotFoundException } from '../../domain/exceptions/identity-not-found.exception';

// =============================================================================
// Handler
// =============================================================================

/**
 * Handles retrieval of an Identity aggregate by phone number.
 *
 * The repository is responsible for returning the complete aggregate:
 *
 * IdentityAggregate
 * └── IdentityEntity
 *     └── IdentityRoleEntity[]
 *
 * The handler performs no domain mutation.
 */
@Injectable()
export class GetIdentityByPhoneNumberHandler implements QueryHandler<
  GetIdentityByPhoneNumberQuery,
  IdentityAggregate
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.IDENTITY)
    private readonly identityRepository: IdentityRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  /**
   * Executes the GetIdentityByPhoneNumberQuery.
   *
   * Returns the complete Identity aggregate when an Identity exists for the
   * supplied phone number.
   */
  public async execute(
    query: GetIdentityByPhoneNumberQuery,
  ): Promise<IdentityAggregate> {
    // -------------------------------------------------------------------------
    // 1. Query guard
    // -------------------------------------------------------------------------

    if (query === undefined) {
      throw new IdentityNotFoundException(
        'Get identity by phone number query is required.',
      );
    }

    // -------------------------------------------------------------------------
    // 2. Phone number guard
    // -------------------------------------------------------------------------

    if (query.phoneNumber === undefined) {
      throw new IdentityNotFoundException('Identity phone number is required.');
    }

    // -------------------------------------------------------------------------
    // 3. Load complete aggregate
    // -------------------------------------------------------------------------
    //
    // The repository performs the persistence lookup and rehydrates:
    //
    // IdentityAggregate
    // └── IdentityEntity
    //     └── IdentityRoleEntity[]
    //
    // No mutation or domain event generation occurs during query execution.
    // -------------------------------------------------------------------------

    const aggregate = await this.identityRepository.findByPhoneNumber(
      query.phoneNumber,
    );

    // -------------------------------------------------------------------------
    // 4. Ensure aggregate exists
    // -------------------------------------------------------------------------

    if (aggregate === null) {
      throw new IdentityNotFoundException(
        `Identity with phone number ${query.phoneNumber.value} was not found.`,
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

export default GetIdentityByPhoneNumberHandler;
