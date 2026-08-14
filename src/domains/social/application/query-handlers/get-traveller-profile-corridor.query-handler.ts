// src/domains/social/application/query-handlers/get-traveller-profile-corridor.query-handler.ts

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { GetTravellerProfileCorridorQuery } from '../queries/get-traveller-profile-corridor.query';

import type { TravellerProfileCorridorEntity } from '../../domain/entities/traveller-profile-corridor.entity';
import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { TravellerProfileCorridorId } from '../../domain/value-objects/traveller-profile-corridor-id.vo';

export class GetTravellerProfileCorridorQueryHandler implements QueryHandler<
  GetTravellerProfileCorridorQuery,
  TravellerProfileCorridorEntity | null
> {
  constructor(private readonly repository: TravellerProfileRepository) {}

  async execute(
    query: GetTravellerProfileCorridorQuery,
  ): Promise<TravellerProfileCorridorEntity | null> {
    const corridorId = new TravellerProfileCorridorId(query.corridorId);

    return this.repository.findCorridorById(corridorId);
  }
}
