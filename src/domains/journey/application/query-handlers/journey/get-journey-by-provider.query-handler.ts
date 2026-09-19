// -----------------------------------------------------------------------------
// sisiMove — Get Journey By Provider Query Handler
// -----------------------------------------------------------------------------
//
// Application-layer query handler for retrieving Journeys belonging to a
// specific Journey provider.
//
// Responsibilities:
// - convert the primitive provider public ID into the Journey domain value
//   object;
// - delegate the read operation to the JourneyRepository application port;
// - return the Journey entities produced by the repository read operation.
//
// This handler deliberately does NOT:
// - access Prisma directly;
// - perform HTTP concerns;
// - perform authentication;
// - perform authorization;
// - resolve the current authenticated identity;
// - instantiate a repository;
// - expose Prisma models.
//
// The presentation layer determines the provider identity for /journeys/me
// from the authenticated JWT identity and passes that identity into the
// application query.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

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

import type { JourneyEntity } from '../../../domain/entities/journey.entity';
import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

import { JourneyProviderPublicId } from '../../../domain/value-objects/journey-provider-public-id.vo';

// -----------------------------------------------------------------------------
// Journey Application
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../journey.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class GetJourneyByProviderQueryHandler implements QueryHandler<
  GetJourneyByProviderQuery,
  JourneyEntity[]
> {
  public constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly repository: JourneyRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(
    query: GetJourneyByProviderQuery,
  ): Promise<JourneyEntity[]> {
    const providerPublicId = new JourneyProviderPublicId(
      query.providerPublicId,
    );

    return this.repository.findJourneysByProvider(providerPublicId);
  }
}
