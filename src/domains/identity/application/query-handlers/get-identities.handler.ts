// -----------------------------------------------------------------------------
// Identity — Get Identities Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving a filtered, sorted, paginated
// collection of Identity aggregates for administrative member management.
//
// Responsibilities:
//
// 1. Receive GetIdentitiesQuery.
// 2. Translate its validated criteria into the Identity repository contract.
// 3. Delegate directory search to IdentityRepository.searchDirectory().
// 4. Return the paginated result.
//
// Architectural boundaries:
//
// - Uses the IdentityRepository contract.
// - Does not access Prisma or persistence directly.
// - Does not mutate Identity aggregates.
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

import type {
  IdentityDirectoryPage,
  IdentityRepository,
} from '../../domain/repositories/identity.repository';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetIdentitiesQuery } from '../queries/get-identities.query';

// =============================================================================
// Handler
// =============================================================================

@Injectable()
export class GetIdentitiesHandler implements QueryHandler<
  GetIdentitiesQuery,
  IdentityDirectoryPage
> {
  // ==========================================================================
  // Constructor
  // ==========================================================================

  public constructor(
    @Inject(IDENTITY_TOKENS.REPOSITORIES.IDENTITY)
    private readonly identityRepository: IdentityRepository,
  ) {}

  // ==========================================================================
  // Execution
  // ==========================================================================

  /**
   * Retrieves one page of Identity aggregates matching the supplied criteria.
   *
   * Input validation and authorization belong to the appropriate application
   * and HTTP boundaries. The repository performs database-side filtering,
   * sorting, pagination, and total-count calculation.
   *
   * @param query Validated Identity directory criteria.
   * @returns A page of matching Identity aggregates and pagination metadata.
   */
  public async execute(
    query: GetIdentitiesQuery,
  ): Promise<IdentityDirectoryPage> {
    return this.identityRepository.searchDirectory({
      page: query.page,
      pageSize: query.pageSize,
      search: query.search,
      status: query.status,
      rolePublicId: query.rolePublicId,
      createdFrom: query.createdFrom,
      createdTo: query.createdTo,
      sortBy: query.sortBy,
      sortDirection: query.sortDirection,
    });
  }
}

// -----------------------------------------------------------------------------
// Default Export
// -----------------------------------------------------------------------------

export default GetIdentitiesHandler;
