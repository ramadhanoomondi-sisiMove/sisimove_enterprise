// src/domains/journey/application/handlers/journey/remove-asset.handler.ts

// -----------------------------------------------------------------------------
// sisiMove — Remove Journey Asset Command Handler
// -----------------------------------------------------------------------------
//
// Application-layer command handler responsible for removing an asset
// reference from a Journey aggregate.
//
// Responsibilities:
// - resolve the Journey aggregate by its public identifier;
// - resolve the referenced asset within the Journey aggregate;
// - delegate removal to the Journey aggregate;
// - persist the resulting aggregate state.
//
// Architectural rules:
// - This command is frozen and already carries its domain Value Objects.
// - The handler must not reconstruct JourneyPublicId or
//   JourneyAssetPublicIdReference.
// - Journey Asset is a child entity owned by the Journey aggregate.
// - Asset resolution and mutation remain within the Journey aggregate boundary.
// - Removing an already-absent asset is treated as an idempotent operation.
// - Repository dependencies are resolved through the application token.
// -----------------------------------------------------------------------------

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Inject, Injectable } from '@nestjs/common';

import type { CommandHandler } from '../../../../../foundation/kernel/application/command-handler';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

import type { RemoveJourneyAssetCommand } from '../../commands/journey/remove-journey-asset.command';

// -----------------------------------------------------------------------------
// Exceptions
// -----------------------------------------------------------------------------

import { JourneyNotFoundException } from '../../../domain/exceptions';

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
export class RemoveAssetHandler implements CommandHandler<
  RemoveJourneyAssetCommand,
  void
> {
  // ---------------------------------------------------------------------------
  // Constructor
  // ---------------------------------------------------------------------------
  //
  // Resolve the Journey repository through the application-level token.
  // ---------------------------------------------------------------------------

  public constructor(
    @Inject(JOURNEY_TOKENS.REPOSITORY)
    private readonly repository: JourneyRepository,
  ) {}

  // ---------------------------------------------------------------------------
  // Execute
  // ---------------------------------------------------------------------------

  public async execute(command: RemoveJourneyAssetCommand): Promise<void> {
    // -------------------------------------------------------------------------
    // Resolve Journey Aggregate
    //
    // The frozen command already carries JourneyPublicId as a Value Object.
    // Do not reconstruct it.
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
    // The frozen command already carries JourneyAssetPublicIdReference as a
    // Value Object.
    //
    // Asset resolution remains inside the Journey aggregate boundary.
    // -------------------------------------------------------------------------

    const asset = aggregate.getAssetByReference(command.assetPublicId);

    // -------------------------------------------------------------------------
    // Idempotent Removal
    //
    // If the referenced asset is already absent, there is no aggregate state
    // change and therefore nothing to persist.
    // -------------------------------------------------------------------------

    if (asset === undefined) {
      return;
    }

    // -------------------------------------------------------------------------
    // Aggregate Mutation
    // -------------------------------------------------------------------------
    //
    // The aggregate owns the removal operation and therefore remains
    // responsible for enforcing its child-entity invariants.
    // -------------------------------------------------------------------------

    aggregate.removeAssetByReference(command.assetPublicId);

    // -------------------------------------------------------------------------
    // Persist Aggregate
    // -------------------------------------------------------------------------

    await this.repository.save(aggregate);
  }
}
