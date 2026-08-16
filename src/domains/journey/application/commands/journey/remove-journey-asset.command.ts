// src/domains/journey/application/commands/journey/remove-journey-asset.command.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Domain Value Objects
// -----------------------------------------------------------------------------

import type { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';
import type { JourneyAssetPublicIdReference } from '../../../domain/value-objects/journey-asset-public-id-reference.vo';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class RemoveJourneyAssetCommand extends Command {
  constructor(
    public readonly journeyPublicId: JourneyPublicId,
    public readonly assetPublicId: JourneyAssetPublicIdReference,
    public readonly correlationId: string,
    public readonly causationId?: string,
  ) {
    super();
  }
}
