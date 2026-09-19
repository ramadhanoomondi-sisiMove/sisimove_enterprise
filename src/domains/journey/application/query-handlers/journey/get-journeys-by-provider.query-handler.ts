// src/domains/journey/application/query-handlers/journey/get-journeys-by-provider.query-handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Get Journeys By Provider Query Handler
// -----------------------------------------------------------------------------
//
// Application-layer query handler for retrieving Journeys belonging to a
// specific Journey provider.
//
// Responsibilities:
// - convert the primitive provider public ID into the Journey domain value
//   object;
// - delegate the read operation to the JourneyRepository application port;
// - return the Journey entities produced by the repository.
//
// This handler deliberately does NOT:
// - access Prisma directly;
// - perform HTTP concerns;
// - perform authentication;
// - perform authorization;
// - resolve the current authenticated identity;
// - instantiate a repository;
// - expose persistence models.
//
// The authenticated /journeys/me controller resolves the provider identity
// from the authenticated JWT and passes that identity into this query.
//
// Repository dependency:
// JourneyRepository is an application/domain contract and therefore must be
// injected through the runtime JOURNEY_TOKENS.REPOSITORY token. Relying on
// TypeScript interface inference would not provide Nest with a runtime token.
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

import type { GetJourneysByProviderQuery } from '../../queries/journey/get-journeys-by-provider.query';

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
// Query Handler
// -----------------------------------------------------------------------------

@Injectable()
export class GetJourneysByProviderQueryHandler implements QueryHandler<
  GetJourneysByProviderQuery,
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
    query: GetJourneysByProviderQuery,
  ): Promise<JourneyEntity[]> {
    const providerPublicId = new JourneyProviderPublicId(
      query.providerPublicId,
    );

    return this.repository.findJourneysByProvider(providerPublicId);
  }
}
