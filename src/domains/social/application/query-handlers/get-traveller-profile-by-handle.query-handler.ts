// src/domains/social/application/query-handlers/get-traveller-profile-by-handle.query-handler.ts

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { GetTravellerProfileByHandleQuery } from '../queries/get-traveller-profile-by-handle.query';

import type { TravellerProfileEntity } from '../../domain/entities/traveller-profile.entity';
import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerHandle } from '../../domain/value-objects/traveller-handle.vo';

export class GetTravellerProfileByHandleQueryHandler implements QueryHandler<
  GetTravellerProfileByHandleQuery,
  TravellerProfileEntity | null
> {
  constructor(private readonly repository: TravellerProfileRepository) {}

  async execute(
    query: GetTravellerProfileByHandleQuery,
  ): Promise<TravellerProfileEntity | null> {
    const handle = new TravellerHandle(query.handle);

    return this.repository.findProfileByHandle(handle);
  }
}
