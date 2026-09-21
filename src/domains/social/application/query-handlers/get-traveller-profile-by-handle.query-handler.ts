// -----------------------------------------------------------------------------
// sisiMove — Get Traveller Profile By Handle Query Handler
// -----------------------------------------------------------------------------
//
// Application query handler for resolving a Traveller Profile by handle.
//
// Dependency injection:
//
// - TravellerProfileRepository is a domain abstraction.
// - The repository is injected through the existing Traveller Profile
//   application token because the repository is a TypeScript interface.
//
// -----------------------------------------------------------------------------

import { Inject } from '@nestjs/common';

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { GetTravellerProfileByHandleQuery } from '../queries/get-traveller-profile-by-handle.query';

import { TRAVELLER_PROFILE_TOKENS } from '../traveller-profile.tokens';

import type { TravellerProfileEntity } from '../../domain/entities/traveller-profile.entity';
import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerHandle } from '../../domain/value-objects/traveller-handle.vo';

// =============================================================================
// Get Traveller Profile By Handle Query Handler
// =============================================================================

export class GetTravellerProfileByHandleQueryHandler implements QueryHandler<
  GetTravellerProfileByHandleQuery,
  TravellerProfileEntity | null
> {
  constructor(
    @Inject(TRAVELLER_PROFILE_TOKENS.REPOSITORY)
    private readonly repository: TravellerProfileRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  async execute(
    query: GetTravellerProfileByHandleQuery,
  ): Promise<TravellerProfileEntity | null> {
    const handle = new TravellerHandle(query.handle);

    return this.repository.findProfileByHandle(handle);
  }
}
