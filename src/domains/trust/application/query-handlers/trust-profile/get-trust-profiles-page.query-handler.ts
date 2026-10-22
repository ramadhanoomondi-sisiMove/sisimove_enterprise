// src/domains/trust/application/query-handlers/trust-profile/get-trust-profiles-page.query-handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Trust Profiles Page Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for retrieving a paginated collection of Trust
// Profile entities.
//
// Responsibilities:
// - Validate pagination parameters.
// - Delegate paginated retrieval to the TrustProfileRepository abstraction.
// - Apply optional status and verification-level filters.
// - Return the profiles and pagination metadata.
//
// This handler deliberately does NOT:
// - access Prisma directly;
// - import infrastructure implementations;
// - load complete Trust Profile aggregates;
// - construct public Trust projections;
// - perform HTTP concerns.
//
// -----------------------------------------------------------------------------

// =============================================================================
// Foundation
// =============================================================================

import { Inject } from '@nestjs/common';

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// =============================================================================
// Query
// =============================================================================

import type { GetTrustProfilesPageQuery } from '../../queries/trust-profile/get-trust-profiles-page.query';

// =============================================================================
// Domain
// =============================================================================

import type { TrustProfileEntity } from '../../../domain/entities/trust-profile.entity';
import type { TrustProfileRepository } from '../../../domain/repositories/trust-profile.repository';

// =============================================================================
// Application DI
// =============================================================================

import { TRUST_PROFILE_TOKENS } from '../../trust-profile.tokens';

// =============================================================================
// Result
// =============================================================================

export interface TrustProfilesPage {
  readonly profiles: readonly TrustProfileEntity[];
  readonly page: number;
  readonly pageSize: number;
  readonly total: number;
  readonly totalPages: number;
}

// =============================================================================
// Query Handler
// =============================================================================

export class GetTrustProfilesPageQueryHandler implements QueryHandler<
  GetTrustProfilesPageQuery,
  TrustProfilesPage
> {
  constructor(
    @Inject(TRUST_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TrustProfileRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  async execute(query: GetTrustProfilesPageQuery): Promise<TrustProfilesPage> {
    if (!Number.isInteger(query.page) || query.page < 1) {
      throw new Error('Page must be a positive integer.');
    }

    if (
      !Number.isInteger(query.pageSize) ||
      query.pageSize < 1 ||
      query.pageSize > 100
    ) {
      throw new Error('Page size must be between 1 and 100.');
    }

    const skip = (query.page - 1) * query.pageSize;

    const result = await this.repository.findProfilesPage({
      skip,
      take: query.pageSize,
      ...(query.status ? { status: query.status } : {}),
      ...(query.verificationLevel
        ? { verificationLevel: query.verificationLevel }
        : {}),
    });

    return {
      profiles: result.profiles,
      page: query.page,
      pageSize: query.pageSize,
      total: result.total,
      totalPages: Math.ceil(result.total / query.pageSize),
    };
  }
}
