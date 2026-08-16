// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneyByProviderQuery } from '../../queries/journey/get-journey-by-provider.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyAggregate } from '../../../domain/aggregates/journey.aggregate';
import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

import { JourneyProviderPublicId } from '../../../domain/value-objects/journey-provider-public-id.vo';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetJourneyByProviderQueryHandler implements QueryHandler<
  GetJourneyByProviderQuery,
  JourneyAggregate[]
> {
  constructor(private readonly repository: JourneyRepository) {}

  async execute(query: GetJourneyByProviderQuery): Promise<JourneyAggregate[]> {
    const providerPublicId = new JourneyProviderPublicId(
      query.providerPublicId,
    );

    return this.repository.findByProviderPublicId(providerPublicId);
  }
}
