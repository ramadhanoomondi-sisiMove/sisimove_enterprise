// src/domains/journey/application/commands/journey/attach-asset.command.ts

// -----------------------------------------------------------------------------
// Foundation
// -----------------------------------------------------------------------------

import { Command } from '../../../../../foundation/kernel/application/command';

// -----------------------------------------------------------------------------
// Value Objects
// -----------------------------------------------------------------------------

import type { JourneyPublicId } from '../../../domain/value-objects/journey-public-id.vo';
import type { JourneyAssetPublicIdReference } from '../../../domain/value-objects/journey-asset-public-id-reference.vo';

// -----------------------------------------------------------------------------
// Command
// -----------------------------------------------------------------------------

export class AttachJourneyAssetCommand extends Command {
  constructor(
    /**
     * Public identifier of the Journey.
     */
    public readonly journeyPublicId: JourneyPublicId,

    /**
     * Public reference of the asset being attached.
     */
    public readonly assetPublicId: JourneyAssetPublicIdReference,

    /**
     * Correlation identifier for distributed tracing.
     */
    public readonly correlationId: string,

    /**
     * Causation identifier for distributed tracing.
     */
    public readonly causationId?: string,
  ) {
    super();
  }
}
