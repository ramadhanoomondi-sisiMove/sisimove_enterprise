// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { QueryHandler } from '../../../../../foundation/kernel/application/query-handler';

// -----------------------------------------------------------------------------
// Query
// -----------------------------------------------------------------------------

import type { GetJourneysByProviderAndStatusQuery } from '../../queries/journey/get-journeys-by-provider-and-status.query';

// -----------------------------------------------------------------------------
// Domain
// -----------------------------------------------------------------------------

import type { JourneyEntity } from '../../../domain/entities/journey.entity';
import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

import { JourneyProviderPublicId } from '../../../domain/value-objects/journey-provider-public-id.vo';
import { JourneyStatusValueObject } from '../../../domain/value-objects/journey-status.vo';

// -----------------------------------------------------------------------------
// Query Handler
// -----------------------------------------------------------------------------

export class GetJourneysByProviderAndStatusQueryHandler implements QueryHandler<
  GetJourneysByProviderAndStatusQuery,
  JourneyEntity[]
> {
  constructor(private readonly repository: JourneyRepository) {}

  async execute(
    query: GetJourneysByProviderAndStatusQuery,
  ): Promise<JourneyEntity[]> {
    const providerPublicId = new JourneyProviderPublicId(
      query.providerPublicId,
    );

    const status = new JourneyStatusValueObject(query.status);

    return this.repository.findJourneysByProviderAndStatus(
      providerPublicId,
      status,
    );
  }
}
