// src/domains/journey/application/handlers/journey/attach-asset.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Attach Journey Asset Command Handler
// -----------------------------------------------------------------------------
//
// Application-layer command handler for attaching an existing Journey Asset
// to a Journey aggregate.
//
// Responsibilities:
// - resolve the Journey aggregate;
// - resolve the existing Journey Asset through the Journey aggregate boundary;
// - delegate the attachment mutation to the Journey aggregate;
// - persist the mutated aggregate.
//
// The handler does NOT:
// - access Prisma directly;
// - perform HTTP concerns;
// - mutate persistence models;
// - implement Journey business rules.
//
// Journey owns the attachment relationship, while the asset itself remains
// resolved through the Journey repository boundary.
//
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// NestJS
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { AttachJourneyAssetCommand } from '../../commands/journey/attach-journey-asset.command';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import {
  JourneyAssetNotAttachedException,
  JourneyNotFoundException,
} from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Application Tokens
// -----------------------------------------------------------------------------

import { JOURNEY_TOKENS } from '../../journey.tokens';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

@Injectable()
export class AttachAssetHandler implements CommandHandler<
  AttachJourneyAssetCommand,
  void
> {
  // ===========================================================================
  // Constructor
  // ===========================================================================

  public constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly journeyRepository: JourneyRepository,
  ) {}

  // ===========================================================================
  // Execute
  // ===========================================================================

  public async execute(command: AttachJourneyAssetCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    // -------------------------------------------------------------------------

    const aggregate = await this.journeyRepository.findByPublicId(
      command.journeyPublicId,
    );

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Resolve Journey Asset
    // -------------------------------------------------------------------------
    //
    // The command carries the asset public reference rather than the internal
    // JourneyAssetId. The repository resolves the asset within the Journey
    // aggregate boundary.
    //

    const asset = await this.journeyRepository.findAssetByReference(
      aggregate.journeyId,
      command.assetPublicId,
    );

    if (asset === null) {
      throw new JourneyAssetNotAttachedException(
        `Journey asset '${command.assetPublicId.value}' is not attached to ` +
          `Journey '${command.journeyPublicId.value}'.`,
      );
    }

    // -------------------------------------------------------------------------
    // Aggregate Mutation
    // -------------------------------------------------------------------------
    //
    // The Journey aggregate owns the business rules governing asset
    // attachment.
    //

    aggregate.attachAsset(asset);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyRepository.save(aggregate);
  }
}
