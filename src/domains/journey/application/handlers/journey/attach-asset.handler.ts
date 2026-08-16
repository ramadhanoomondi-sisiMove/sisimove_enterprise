// src/domains/journey/application/handlers/journey/attach-asset.handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { AttachJourneyAssetCommand } from '../../commands/journey/';

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
// Handler
// -----------------------------------------------------------------------------

export class AttachAssetHandler implements CommandHandler<
  AttachJourneyAssetCommand,
  void
> {
  constructor(private readonly journeyRepository: JourneyRepository) {}

  async execute(command: AttachJourneyAssetCommand): Promise<void> {
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
    // The command carries the asset public reference, not the internal
    // JourneyAssetId. Resolve the asset using the public reference.
    // -------------------------------------------------------------------------

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

    aggregate.attachAsset(asset);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.journeyRepository.save(aggregate);
  }
}
