// src/domains/social/application/query-handlers/get-traveller-profile-by-member-public-id.query-handler.ts

import type { QueryHandler } from '../../../../foundation/kernel/application/query-handler';

import type { GetTravellerProfileByMemberPublicIdQuery } from '../queries/get-traveller-profile-by-member-public-id.query';

import type { TravellerProfileAggregate } from '../../domain/aggregates/traveller-profile.aggregate';
import type { TravellerProfileRepository } from '../../domain/repositories/traveller-profile.repository';

import { MemberPublicId } from '../../domain/value-objects/member-public-id.vo';

export class GetTravellerProfileByMemberPublicIdQueryHandler implements QueryHandler<
  GetTravellerProfileByMemberPublicIdQuery,
  TravellerProfileAggregate | null
> {
  constructor(private readonly repository: TravellerProfileRepository) {}

  async execute(
    query: GetTravellerProfileByMemberPublicIdQuery,
  ): Promise<TravellerProfileAggregate | null> {
    const memberPublicId = new MemberPublicId(query.memberPublicId);

    return this.repository.findByMemberPublicId(memberPublicId);
  }
}
