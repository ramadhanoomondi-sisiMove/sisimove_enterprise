// src/domains/journey/application/handlers/journey/remove-asset.handler.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { RemoveJourneyAssetCommand } from '../../commands/journey';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyNotFoundException } from '../../../domain/exceptions';

// -----------------------------------------------------------------------------
// Repository
// -----------------------------------------------------------------------------

import type { JourneyRepository } from '../../../domain/repositories/journey.repository';

// -----------------------------------------------------------------------------
// Handler
// -----------------------------------------------------------------------------

export class RemoveAssetHandler implements CommandHandler<
  RemoveJourneyAssetCommand,
  void
> {
  constructor(private readonly repository: JourneyRepository) {}

  async execute(command: RemoveJourneyAssetCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    //
    // The command already carries JourneyPublicId as a value object.
    // Do not reconstruct it with `new JourneyPublicId(...)`.
    // -------------------------------------------------------------------------

    const aggregate = await this.repository.findByPublicId(
      command.journeyPublicId,
    );

    if (aggregate === null) {
      throw new JourneyNotFoundException();
    }

    // -------------------------------------------------------------------------
    // Resolve Asset
    //
    // The command already carries JourneyAssetPublicIdReference as a value
    // object. The aggregate owns the resolution of that reference.
    // -------------------------------------------------------------------------

    const asset = aggregate.getAssetByReference(command.assetPublicId);

    if (asset === undefined) {
      return;
    }

    // -------------------------------------------------------------------------
    // Aggregate Mutation
    // -------------------------------------------------------------------------

    aggregate.removeAssetByReference(command.assetPublicId);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}
